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
import { getSubmissions } from "@/lib/data";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Edit, CheckSquare } from "lucide-react";
import ScoreSubmissionForm from "@/components/dashboard/score-submission-form";

export default async function GiveScorePage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "Scorer") {
    redirect("/dashboard");
  }
  
  const submissions = await getSubmissions();
  const pendingSubmissions = submissions.filter(s => s.status === 'Pending Score');
  const finishedSubmissions = submissions.filter(s => s.status === 'Scored' && s.scorer === user.name);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Edit className="h-6 w-6" />
            Pending for Review
          </CardTitle>
          <CardDescription>
            Review apprentice deliverables and provide scores. Submissions listed here are pending your review.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScoreSubmissionForm submissions={pendingSubmissions} scorerName={user.name} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckSquare className="h-6 w-6" />
            Scoring History
          </CardTitle>
          <CardDescription>
            A log of all submissions you have already scored.
          </CardDescription>
        </CardHeader>
        <CardContent>
           <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Apprentice</TableHead>
                <TableHead>Task</TableHead>
                <TableHead className="text-right">Final Score</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {finishedSubmissions.length > 0 ? (
                finishedSubmissions.map((sub) => (
                  <TableRow key={sub.id}>
                    <TableCell>{sub.assigneeName}</TableCell>
                    <TableCell>{sub.taskTitle}</TableCell>
                    <TableCell className="text-right">
                        <Badge variant="default">{sub.score}</Badge>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="text-center">
                    You have not scored any submissions yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
