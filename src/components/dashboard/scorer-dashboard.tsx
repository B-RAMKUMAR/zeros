import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
  import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";
  import type { User, Submission } from "@/lib/types";
  import { Button } from "../ui/button";
  import { Badge } from "../ui/badge";
  import { Download, Edit, ArrowRight } from "lucide-react";
  import Link from "next/link";
  
  type ScorerDashboardProps = {
    user: User;
    submissions: Submission[];
  };
  
  export default function ScorerDashboard({ user, submissions }: ScorerDashboardProps) {
    const pendingSubmissions = submissions.filter(s => s.status === 'Pending Score');
    const scoredByYou = submissions.filter(s => s.status === 'Scored' && s.scorer === user.name);
    
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Welcome, {user.name}!</CardTitle>
            <CardDescription>
              Here are the latest submissions awaiting your review.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Pending Submissions</CardTitle>
                    <CardDescription>
                        These deliverables are ready for scoring.
                    </CardDescription>
                </div>
                 <Button asChild>
                    <Link href="/dashboard/give-score">
                        Go to Scoring Page <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                </Button>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Apprentice</TableHead>
                            <TableHead>Task</TableHead>
                            <TableHead>Submitted At</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {pendingSubmissions.length > 0 ? pendingSubmissions.slice(0, 5).map(sub => (
                             <TableRow key={sub.id}>
                                <TableCell>{sub.assigneeName}</TableCell>
                                <TableCell>{sub.taskTitle}</TableCell>
                                <TableCell>{new Date(sub.submittedAt).toLocaleString()}</TableCell>
                            </TableRow>
                        )) : (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center">No pending submissions.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Recently Scored By You</CardTitle>
                <CardDescription>
                    A log of submissions you have recently scored.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Apprentice</TableHead>
                            <TableHead>Task</TableHead>
                            <TableHead>Score</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {scoredByYou.length > 0 ? scoredByYou.slice(0, 5).map(sub => (
                            <TableRow key={sub.id}>
                                <TableCell>{sub.assigneeName}</TableCell>
                                <TableCell>{sub.taskTitle}</TableCell>
                                <TableCell>
                                    <Badge>{sub.score}</Badge>
                                </TableCell>
                            </TableRow>
                        )) : (
                             <TableRow>
                                <TableCell colSpan={3} className="text-center">You have not scored any submissions yet.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
      </div>
    );
  }