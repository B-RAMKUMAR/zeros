import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { getTasks, getSubmissions, getUsers } from "@/lib/data";
import { ClipboardCheck } from "lucide-react";
import TaskManagement from "@/components/dashboard/task-management";

export default async function OrchestratorTasksPage() {
  const tasks = await getTasks();
  const submissions = await getSubmissions();
  const users = await getUsers();

  const tasksWithSubmissionCounts = tasks.map(task => ({
    ...task,
    submissionCount: submissions.filter(s => s.taskId === task.id).length,
  }));

  const apprentices = users.filter(u => u.role === 'Apprentice');

  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle className="flex items-center gap-2">
            <ClipboardCheck className="h-6 w-6" />
            Task Management
          </CardTitle>
          <CardDescription>
            Create, view, and manage all tasks for the ZEROS program.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <TaskManagement 
          initialTasks={tasksWithSubmissionCounts} 
          allSubmissions={submissions}
          apprentices={apprentices}
        />
      </CardContent>
    </Card>
  );
}
