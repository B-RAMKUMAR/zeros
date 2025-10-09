import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { UserCircle, Edit } from "lucide-react";

export default async function ProfilePage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const userInitials = user.name.split(" ").map((n) => n[0]).join("");

  return (
    <div className="space-y-6">
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                    <UserCircle className="h-6 w-6" />
                    My Profile
                </CardTitle>
                <CardDescription>
                    View and manage your personal information.
                </CardDescription>
            </CardHeader>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Your Details</CardTitle>
                 <Button variant="outline" disabled>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Profile
                </Button>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex items-center gap-4">
                    <Avatar className="h-20 w-20">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback className="text-2xl">{userInitials}</AvatarFallback>
                    </Avatar>
                    <div>
                        <h2 className="text-2xl font-bold">{user.name}</h2>
                        <p className="text-muted-foreground">{user.role}</p>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" value={user.name} readOnly />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" value={user.email} readOnly />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="role">Role</Label>
                        <Input id="role" value={user.role} readOnly />
                    </div>
                </div>
            </CardContent>
        </Card>
    </div>
  );
}
