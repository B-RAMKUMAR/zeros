import JournalGenerator from "@/components/dashboard/journal-generator";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FilePen } from "lucide-react";

export default async function JournalPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "Apprentice") {
    redirect("/dashboard");
  }

  return (
    <div className="container mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <FilePen className="h-6 w-6" />
            Automated Journal Entry
          </CardTitle>
          <CardDescription>
            Generate a personalized daily journal entry based on your recent activity. 
            This fosters structured self-reflection and helps document your journey.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <JournalGenerator userId={user.id} />
        </CardContent>
      </Card>
    </div>
  );
}
