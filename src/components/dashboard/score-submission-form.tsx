"use client";

import { useState, useTransition } from "react";
import type { Submission, ScoreBreakdown } from "@/lib/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Download, Edit, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { updateScoresAction } from "@/lib/score-actions";


export default function ScoreSubmissionForm({ submissions, scorerName }: { submissions: Submission[], scorerName: string }) {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [scores, setScores] = useState<ScoreBreakdown>({
    depth: 5,
    relevance: 5,
    applicability: 5,
    novelty: 5,
    packaging: 5,
  });
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleScoreClick = (submission: Submission) => {
    setSelectedSubmission(submission);
    setScores({ depth: 5, relevance: 5, applicability: 5, novelty: 5, packaging: 5 });
    setDialogOpen(true);
  };
  
  const handleScoreChange = (category: keyof ScoreBreakdown, value: number[]) => {
    setScores(prev => ({ ...prev, [category]: value[0] }));
  };

  const handleSubmitScore = async () => {
    if (!selectedSubmission) return;

    startTransition(async () => {
        const result = await updateScoresAction({
            submissionId: selectedSubmission.id,
            scores: scores,
            scorerName: scorerName
        });

        if (result.success) {
            toast({
                title: "Scores Submitted",
                description: `Scores for ${selectedSubmission.assigneeName} on "${selectedSubmission.taskTitle}" have been recorded.`,
            });
            setDialogOpen(false);
        } else {
            toast({
                variant: "destructive",
                title: "Error",
                description: result.error || "Failed to submit scores.",
            });
        }
    });
  }

  const scoreCategories: { id: keyof ScoreBreakdown; label: string }[] = [
    { id: "depth", label: "Depth Score" },
    { id: "relevance", label: "Relevance Score" },
    { id: "applicability", label: "Applicability" },
    { id: "novelty", label: "Authenticity/Novelty" },
    { id: "packaging", label: "Packaging" },
  ];

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Apprentice</TableHead>
            <TableHead>Task</TableHead>
            <TableHead>Submitted At</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {submissions.length > 0 ? (
            submissions.map((sub) => (
              <TableRow key={sub.id}>
                <TableCell>{sub.assigneeName}</TableCell>
                <TableCell>{sub.taskTitle}</TableCell>
                <TableCell>{format(new Date(sub.submittedAt), "PPpp")}</TableCell>
                <TableCell className="text-right space-x-2">
                   <Button asChild variant="outline" size="sm">
                      <a href={sub.fileUrl} download>
                          <Download className="mr-2 h-4 w-4" /> Download
                      </a>
                   </Button>
                  <Button size="sm" onClick={() => handleScoreClick(sub)}>
                    <Edit className="mr-2 h-4 w-4" /> Score
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="text-center">
                No pending submissions to score.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Score Submission: {selectedSubmission?.taskTitle}</DialogTitle>
            <DialogDescription>
              Apprentice: {selectedSubmission?.assigneeName}. Provide scores from 0-10.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            {scoreCategories.map(cat => (
                 <div key={cat.id} className="grid gap-2">
                    <div className="flex justify-between">
                        <Label htmlFor={cat.id}>{cat.label}</Label>
                        <span className="text-sm font-bold w-10 text-center">{scores[cat.id]}</span>
                    </div>
                    <Slider
                      id={cat.id}
                      min={0}
                      max={10}
                      step={1}
                      value={[scores[cat.id]]}
                      onValueChange={(value) => handleScoreChange(cat.id, value)}
                    />
                 </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmitScore} disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Submit Scores
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
