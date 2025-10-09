import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { getAnnouncements } from "@/lib/data";
import { Megaphone } from "lucide-react";
import { format } from "date-fns";

export default async function AnnouncementsPage() {
  const announcements = await getAnnouncements();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Megaphone className="h-6 w-6" />
            Announcements
          </CardTitle>
          <CardDescription>
            A feed of all announcements from the Program Orchestrator.
          </CardDescription>
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
