import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
  import type { User, Announcement } from "@/lib/types";
  import { Megaphone } from "lucide-react";
  
  type OperatorDashboardProps = {
    user: User;
    announcements: Announcement[];
  };
  
  export default function OperatorDashboard({ user, announcements }: OperatorDashboardProps) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Welcome, {user.name}!</CardTitle>
            <CardDescription>
              This is the Program Operator dashboard. You can manage announcements and other operational tasks here.
            </CardDescription>
          </CardHeader>
        </Card>
  
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Megaphone className="h-5 w-5" />
              Announcements
            </CardTitle>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>
      </div>
    );
  }
  