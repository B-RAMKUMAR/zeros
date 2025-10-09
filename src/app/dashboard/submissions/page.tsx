import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Upload } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { getTasks, getSubmissions } from "@/lib/data";
import { redirect } from "next/navigation";
import SubmissionForm from "@/components/dashboard/submission-form";
import type { Submission } from "@/lib/types";

export default async function SubmissionsPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "Apprentice") {
    redirect("/dashboard");
  }

  const allTasks = await getTasks();
  const userTasks = allTasks.filter(task => task.assigneeId === user.id);
  const allSubmissions = await getSubmissions();
  
  const userSubmissions = allSubmissions.filter(s => s.assigneeId === user.id);
  const submittedTaskIds = new Set(userSubmissions.map(s => s.taskId));
  
  const now = new Date();
  
  const tasksToDisplay = userTasks.filter(task => {
    // Exclude tasks that are already scored or are overdue and not yet submitted
    if(task.status === 'Scored') return false;
    if(new Date(task.eta) < now && !submittedTaskIds.has(task.id)) return false;
    return true;
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-6 w-6" />
          Submit Deliverable
        </CardTitle>
        <CardDescription>
          Upload or update your completed work for any active task. You can edit your submission any time before the deadline.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {tasksToDisplay.length > 0 ? (
          <div className="space-y-6">
            {tasksToDisplay.map(task => {
                const existingSubmission = userSubmissions.find(s => s.taskId === task.id);
                const isDeadlinePassed = new Date(task.eta) < now;
                return (
                    <SubmissionForm 
                        key={task.id} 
                        task={task} 
                        user={user} 
                        initialSubmission={existingSubmission}
                        isDeadlinePassed={isDeadlinePassed}
                    />
                );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold">No Actionable Tasks</h3>
            <p className="text-muted-foreground mt-2">
              You have no tasks that are currently available for submission.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
