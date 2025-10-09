import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { User, Task, Announcement } from "@/lib/types";
import TaskCard from "./task-card";
import { Megaphone } from "lucide-react";

type ApprenticeDashboardProps = {
  user: User;
  tasks: Task[];
  announcements: Announcement[];
};

export default function ApprenticeDashboard({
  user,
  tasks,
  announcements,
}: ApprenticeDashboardProps) {
  const upcomingTasks = tasks.filter(t => t.status !== 'Scored' && t.status !== 'Submitted');
  const submittedTasks = tasks.filter(t => t.status === 'Scored' || t.status === 'Submitted');

  return (
    <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
      <div className="xl:col-span-2 grid auto-rows-max items-start gap-4 md:gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Welcome, {user.name}!</CardTitle>
            <CardDescription>
              Here are your active tasks and recent announcements. Keep up the great work.
            </CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Tasks</CardTitle>
            <CardDescription>Tasks that require your attention.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            {upcomingTasks.length > 0 ? (
                upcomingTasks.map(task => <TaskCard key={task.id} task={task} />)
            ) : (
                <p className="text-muted-foreground">No upcoming tasks. Great job!</p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Completed & Submitted Tasks</CardTitle>
            <CardDescription>Tasks that are either submitted or already scored.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
             {submittedTasks.length > 0 ? (
                submittedTasks.map(task => <TaskCard key={task.id} task={task} />)
            ) : (
                <p className="text-muted-foreground">No submitted tasks yet.</p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid auto-rows-max items-start gap-4 md:gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Megaphone className="h-5 w-5" />
              Announcements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-96">
              <div className="space-y-4">
                {announcements.map((announcement) => (
                  <div key={announcement.id} className="p-4 bg-muted rounded-lg">
                    <h4 className="font-semibold">{announcement.title}</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      {announcement.content}
                    </p>
                    <p className="text-xs text-muted-foreground/70 mt-2">
                      {new Date(announcement.date).toLocaleDateString()} - {announcement.author}
                    </p>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
