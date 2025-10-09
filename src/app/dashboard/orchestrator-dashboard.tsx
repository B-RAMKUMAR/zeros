import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { User, Announcement, AccessRequest } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Check, UserPlus, Megaphone, X, ArrowRight } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";

type OrchestratorDashboardProps = {
  user: User;
  announcements: Announcement[];
  requests: AccessRequest[];
  users: User[];
};

export default function OrchestratorDashboard({ user, announcements, requests, users }: OrchestratorDashboardProps) {
  const pendingRequests = requests.filter(r => r.status === 'Pending');
  
  return (
    <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
      <div className="xl:col-span-2 grid auto-rows-max items-start gap-4 md:gap-8">
          <Card>
          <CardHeader>
              <CardTitle>Welcome, {user.name}!</CardTitle>
              <CardDescription>
              Oversee the ZEROS program, manage users, and communicate with the team.
              </CardDescription>
          </CardHeader>
          </Card>

          <Card>
          <CardHeader className="flex flex-row items-center justify-between">
              <div>
                  <CardTitle>Access Requests</CardTitle>
                  <CardDescription>Approve or deny requests to join the program.</CardDescription>
              </div>
               <Button asChild>
                  <Link href="/dashboard/requests">
                      View All Requests <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
              </Button>
          </CardHeader>
          <CardContent>
               <Table>
                  <TableHeader>
                      <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                           <TableHead>Requested At</TableHead>
                          <TableHead className="text-right">
                              <Badge variant={pendingRequests.length > 0 ? "destructive" : "default"}>{pendingRequests.length} Pending</Badge>
                          </TableHead>
                      </TableRow>
                  </TableHeader>
                  <TableBody>
                      {pendingRequests.length > 0 ? pendingRequests.slice(0,3).map(req => (
                          <TableRow key={req.id}>
                              <TableCell>{req.userName}</TableCell>
                              <TableCell>{req.userEmail}</TableCell>
                              <TableCell>{new Date(req.requestedAt).toLocaleDateString()}</TableCell>
                              <TableCell className="text-right space-x-2">
                                  <Button variant="outline" size="icon"><X className="h-4 w-4" /></Button>
                                  <Button size="icon"><Check className="h-4 w-4" /></Button>
                              </TableCell>
                          </TableRow>
                      )) : (
                           <TableRow>
                              <TableCell colSpan={4} className="text-center">No pending requests.</TableCell>
                          </TableRow>
                      )}
                  </TableBody>
              </Table>
          </CardContent>
          </Card>
      </div>

      <div className="grid auto-rows-max items-start gap-4 md:gap-8">
          <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                   <div>
                      <CardTitle>Manage Users</CardTitle>
                      <CardDescription>
                          View all users in the system.
                      </CardDescription>
                  </div>
                   <Button asChild size="sm">
                      <Link href="/dashboard/people">
                          <UserPlus className="h-4 w-4 mr-2" />
                          Manage
                      </Link>
                  </Button>
              </CardHeader>
              <CardContent>
                   <Table>
                      <TableHeader>
                          <TableRow>
                              <TableHead>User</TableHead>
                              <TableHead>Role</TableHead>
                          </TableRow>
                      </TableHeader>
                      <TableBody>
                          {users.slice(0,3).map(u => (
                              <TableRow key={u.id}>
                                  <TableCell className="flex items-center gap-2">
                                       <Avatar className="h-8 w-8">
                                          <AvatarImage src={u.avatar} alt={u.name} />
                                          <AvatarFallback>{u.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                      </Avatar>
                                      <div>
                                          <p className="font-medium">{u.name}</p>
                                          <p className="text-xs text-muted-foreground">{u.email}</p>
                                      </div>
                                  </TableCell>
                                  <TableCell><Badge variant="outline">{u.role}</Badge></TableCell>
                              </TableRow>
                          ))}
                      </TableBody>
                  </Table>
              </CardContent>
          </Card>
          <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                   <div>
                      <CardTitle>Announcements</CardTitle>
                      <CardDescription>
                          Broadcast messages to all users.
                      </CardDescription>
                  </div>
                  <Button asChild size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90">
                      <Link href="/dashboard/orchestrator-announcements">
                          <Megaphone className="h-4 w-4 mr-2" />
                          New
                      </Link>
                  </Button>
              </CardHeader>
              <CardContent>
                  <div className="space-y-2">
                      {announcements.slice(0, 3).map(ann => (
                           <div key={ann.id} className="p-2 bg-muted rounded-lg">
                              <h4 className="font-semibold text-sm">{ann.title}</h4>
                              <p className="text-xs text-muted-foreground mt-1">
                                  {new Date(ann.date).toLocaleDateString()}
                              </p>
                          </div>
                      ))}
                  </div>
              </CardContent>
          </Card>
      </div>
    </div>
  );
}
