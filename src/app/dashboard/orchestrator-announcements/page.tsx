import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { getAnnouncements } from "@/lib/data";
import { Megaphone, Send } from "lucide-react";
import { format } from "date-fns";

export default async function OrchestratorAnnouncementsPage() {
  const announcements = await getAnnouncements();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Megaphone className="h-6 w-6" />
            Post a New Announcement
          </CardTitle>
          <CardDescription>
            Broadcast a message to all program participants. It will appear on their dashboards.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="space-y-2">
                <Input type="text" placeholder="Announcement Title" />
            </div>
            <div className="space-y-2">
                <Textarea placeholder="Write your announcement content here..." />
            </div>
            <Button>
                <Send className="mr-2 h-4 w-4" />
                Post Announcement
            </Button>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
            <CardTitle>Posted Announcements</CardTitle>
            <CardDescription>A log of all past announcements.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            {announcements.length > 0 ? (
                announcements.map((ann) => (
                    <div key={ann.id} className="border rounded-lg p-4 bg-muted">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="font-semibold">{ann.title}</h3>
                                <p className="text-sm text-muted-foreground mt-1">{ann.content}</p>
                            </div>
                            <div className="text-right text-xs text-muted-foreground whitespace-nowrap pl-4">
                                <p>{format(new Date(ann.date), "PPP")}</p>
                                <p>by {ann.author}</p>
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <p className="text-center text-muted-foreground">No announcements have been posted yet.</p>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
