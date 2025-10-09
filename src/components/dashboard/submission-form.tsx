"use client";

import type { Task, User, Submission } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useTransition, useRef } from "react";
import { Clock, Upload, Loader2, CheckCircle, File as FileIcon, Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { createSubmissionAction } from "@/lib/submission-actions";
import { Input } from "../ui/input";
import { format } from "date-fns";

type Countdown = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

function calculateCountdown(eta: string): Countdown | null {
  const difference = +new Date(eta) - +new Date();
  if (difference > 0) {
    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }
  return null;
}

export default function SubmissionForm({ task, user, initialSubmission, isDeadlinePassed }: { task: Task; user: User, initialSubmission?: Submission, isDeadlinePassed: boolean }) {
  const [countdown, setCountdown] = useState<Countdown | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [isSubmitted, setIsSubmitted] = useState(!!initialSubmission);
  const [isEditing, setIsEditing] = useState(!initialSubmission);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();

   useEffect(() => {
    setIsClient(true);
    setCountdown(calculateCountdown(task.eta));
    const timer = setInterval(() => {
      setCountdown(calculateCountdown(task.eta));
    }, 1000);

    return () => clearInterval(timer);
  }, [task.eta]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedFile) {
      toast({
        variant: "destructive",
        title: "No File Selected",
        description: "Please choose a file to submit.",
      });
      return;
    }

    const formData = new FormData(event.currentTarget);
    
    startTransition(async () => {
      try {
        const result = await createSubmissionAction(formData);

        if (result.success) {
            toast({
              title: `Submission ${initialSubmission ? 'Updated' : 'Successful'}!`,
              description: `Your deliverable for "${task.title}" has been submitted.`,
            });
            setIsSubmitted(true);
            setIsEditing(false);
            setSelectedFile(null);
        } else {
             toast({
              variant: "destructive",
              title: "Submission Failed",
              description: result.error || "There was an error submitting your deliverable. Please try again.",
            });
        }
      } catch (error) {
        console.error(error);
        toast({
          variant: "destructive",
          title: "Submission Failed",
          description: "There was an error submitting your deliverable. Please try again.",
        });
      }
    });
  };
  
  const cardBg = isSubmitted && !isEditing ? "bg-green-50 dark:bg-green-900/20" : "bg-muted/50";
  const cardBorder = isSubmitted && !isEditing ? "border-green-200 dark:border-green-800" : "";

  return (
    <Card className={`${cardBg} ${cardBorder}`}>
        <CardHeader>
            <CardTitle>{task.title}</CardTitle>
            <CardDescription>{task.objective}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
             {isClient && countdown ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>
                        Time left: {countdown.days}d {countdown.hours}h {countdown.minutes}m {countdown.seconds}s
                    </span>
                </div>
            ) : (
                <div className="flex items-center gap-2 text-sm text-destructive font-medium">
                    <Clock className="h-4 w-4" />
                    <span>{isClient ? 'Deadline has passed.' : 'Calculating...'}</span>
                </div>
            )}
            
            {isEditing && !isDeadlinePassed && (
              <form onSubmit={handleSubmit} ref={formRef} className="space-y-4">
                <input type="hidden" name="submissionId" value={initialSubmission?.id} />
                <input type="hidden" name="taskId" value={task.id} />
                <input type="hidden" name="taskTitle" value={task.title} />
                <input type="hidden" name="assigneeId" value={user.id} />
                <input type="hidden" name="assigneeName" value={user.name} />

                <div className="flex flex-col sm:flex-row items-center gap-4">
                    <Input type="file" name="file" ref={fileInputRef} onChange={handleFileChange} className="max-w-xs"/>
                    <Button type="submit" disabled={isPending || !selectedFile} className="w-full sm:w-auto">
                        {isPending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...
                            </>
                        ) : (
                            <>
                                <Upload className="mr-2 h-4 w-4" /> {initialSubmission ? 'Update Deliverable' : 'Submit Deliverable'}
                            </>
                        )}
                    </Button>
                </div>
                {selectedFile && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground border rounded-lg p-2 bg-background">
                        <FileIcon className="h-4 w-4" />
                        <span className="font-medium">Selected:</span>
                        <span>{selectedFile.name}</span>
                    </div>
                )}
              </form>
            )}
            
            {isSubmitted && !isEditing && (
                 <div className="space-y-3">
                    <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                        <CheckCircle className="h-5 w-5" />
                        <p className="font-semibold">Successfully Submitted on {format(new Date(initialSubmission?.submittedAt || Date.now()), "PPpp")}</p>
                    </div>
                     {!isDeadlinePassed && (
                        <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Submission
                        </Button>
                    )}
                 </div>
            )}
        </CardContent>
    </Card>
  )
}
