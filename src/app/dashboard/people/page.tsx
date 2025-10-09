import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { getUsers } from "@/lib/data";
import PeopleManagement from "@/components/dashboard/people-management";
import { Users } from "lucide-react";

export default async function PeoplePage() {
  const users = await getUsers();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-6 w-6" />
          People Management
        </CardTitle>
        <CardDescription>
          View, add, and manage all users in the ZEROS program.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <PeopleManagement users={users} />
      </CardContent>
    </Card>
  );
}
