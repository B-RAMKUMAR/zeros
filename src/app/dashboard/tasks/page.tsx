import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClipboardCheck } from "lucide-react";
import TaskCard from "@/components/dashboard/task-card";
import { getCurrentUser } from "@/lib/auth";
import { getTasks } from "@/lib/data";
import { redirect } from "next/navigation";
import type { Task } from "@/lib/types";

export default async function TasksPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "Apprentice") {
    redirect("/dashboard");
  }

  const allTasks = await getTasks();
  const userTasks = allTasks.filter(task => task.assigneeId === user.id);

  const activeTasks = userTasks.filter(
    (task) => task.status === "In Progress" || task.status === "Not Started"
  );
  const closedTasks = userTasks.filter(
    (task) =>
      task.status === "Submitted" ||
      task.status === "Scored" ||
      task.status === "Overdue"
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClipboardCheck className="h-6 w-6" />
            My Tasks
          </CardTitle>
          <CardDescription>
            View and manage all your assigned tasks for the ZEROS program.
          </CardDescription>
        </CardHeader>
      </Card>
      <Tabs defaultValue="active">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="active">Active Tasks</TabsTrigger>
          <TabsTrigger value="closed">Closed Tasks</TabsTrigger>
        </TabsList>
        <TabsContent value="active">
          <Card>
            <CardHeader>
              <CardTitle>Active</CardTitle>
              <CardDescription>
                Tasks that are in progress or have not been started yet.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {activeTasks.length > 0 ? (
                activeTasks.map((task) => <TaskCard key={task.id} task={task} />)
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                    You have no active tasks. Keep up the great work!
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="closed">
          <Card>
            <CardHeader>
              <CardTitle>Closed</CardTitle>
              <CardDescription>
                Tasks that have been submitted, scored, or are overdue.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {closedTasks.length > 0 ? (
                closedTasks.map((task) => <TaskCard key={task.id} task={task} />)
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                    You have no closed tasks yet.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
