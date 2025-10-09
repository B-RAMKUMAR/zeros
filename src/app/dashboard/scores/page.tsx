import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getSubmissions, getTasks } from "@/lib/data";
import type { Submission, Task } from "@/lib/types";
import { Trophy, Download } from "lucide-react";
import Link from "next/link";

type EnrichedSubmission = Submission & { average: number };

export default async function ScoresPage() {
  const tasks = await getTasks();
  const submissions = await getSubmissions();

  const scoredSubmissions = submissions.filter(
    (s) => s.status === "Scored" && s.scores
  );

  const tasksWithSubmissions = tasks
    .map((task) => {
      const relatedSubmissions: EnrichedSubmission[] = scoredSubmissions
        .filter((s) => s.taskId === task.id)
        .map((s) => {
          const scoreValues = Object.values(s.scores!);
          const average =
            scoreValues.reduce((sum, score) => sum + score, 0) /
            scoreValues.length;
          return { ...s, average };
        });

      if (relatedSubmissions.length === 0) {
        return null;
      }

      const taskTotalAverage =
        relatedSubmissions.reduce((sum, s) => sum + s.average, 0) /
        relatedSubmissions.length;

      return {
        ...task,
        submissions: relatedSubmissions,
        average: taskTotalAverage,
      };
    })
    .filter((t): t is NonNullable<typeof t> => t !== null);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-3xl">
            <Trophy className="h-8 w-8" />
            Scores &amp; Leaderboard
          </CardTitle>
          <CardDescription>
            Detailed score breakdown for each task and apprentice.
          </CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
            <CardTitle>Task Score Details</CardTitle>
            <CardDescription>Click on a task to view the detailed scoring for each submission.</CardDescription>
        </CardHeader>
        <CardContent>
            {tasksWithSubmissions.length > 0 ? (
                <Accordion type="single" collapsible className="w-full">
                    {tasksWithSubmissions.map((task) => (
                    <AccordionItem value={`task-${task.id}`} key={task.id}>
                        <AccordionTrigger>
                            <div className="flex justify-between w-full pr-4">
                                <span className="font-medium text-lg">{task.title}</span>
                                <div className="flex items-center gap-2">
                                     <span className="text-sm text-muted-foreground">Task Average:</span>
                                    <Badge variant="default">{task.average.toFixed(2)}</Badge>
                                </div>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Apprentice</TableHead>
                                    <TableHead>Scorer</TableHead>
                                    <TableHead>Depth</TableHead>
                                    <TableHead>Relevance</TableHead>
                                    <TableHead>Applicability</TableHead>
                                    <TableHead>Novelty</TableHead>
                                    <TableHead>Packaging</TableHead>
                                    <TableHead>Average</TableHead>
                                    <TableHead className="text-right">Deliverable</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {task.submissions.map(sub => (
                                    <TableRow key={sub.id}>
                                        <TableCell className="font-medium">{sub.assigneeName}</TableCell>
                                        <TableCell>{sub.scorer || 'N/A'}</TableCell>
                                        {sub.scores ? (
                                            <>
                                                <TableCell>{sub.scores.depth}</TableCell>
                                                <TableCell>{sub.scores.relevance}</TableCell>
                                                <TableCell>{sub.scores.applicability}</TableCell>
                                                <TableCell>{sub.scores.novelty}</TableCell>
                                                <TableCell>{sub.scores.packaging}</TableCell>
                                            </>
                                        ) : (
                                            <TableCell colSpan={5} className="text-center">N/A</TableCell>
                                        )}
                                        <TableCell>
                                            <Badge variant="secondary">{sub.average.toFixed(2)}</Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button asChild variant="outline" size="sm">
                                                <a href={sub.fileUrl} download>
                                                    <Download className="mr-2 h-4 w-4" />
                                                    View File
                                                </a>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        </AccordionContent>
                    </AccordionItem>
                    ))}
                </Accordion>
            ) : (
                <p className="text-center text-muted-foreground py-8">No scored submissions found for any task.</p>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
