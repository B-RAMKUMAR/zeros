"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { History, Check, X, Loader2 } from "lucide-react";
import { format } from "date-fns";
import type { AccessRequest } from "@/lib/types";
import { useState, useTransition, useEffect } from "react";
import { getAccessRequests, approveAccessRequest, rejectAccessRequest } from "@/lib/request-actions";
import { useToast } from "@/hooks/use-toast";


export default function RequestsPage() {
  const [allRequests, setAllRequests] = useState<AccessRequest[]>([]);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  useEffect(() => {
    const fetchRequests = async () => {
      const requests = await getAccessRequests();
      setAllRequests(requests);
    };
    fetchRequests();
  }, []);

  const handleApprove = async (requestId: number, userName: string) => {
    startTransition(async () => {
      const result = await approveAccessRequest(requestId);
      if (result.success) {
        toast({ title: "Request Approved", description: `${userName} has been granted access and a user account has been created.` });
        const requests = await getAccessRequests();
        setAllRequests(requests);
      } else {
        toast({ variant: "destructive", title: "Approval Failed", description: result.error });
      }
    });
  };
  
  const handleReject = async (requestId: number, userName: string) => {
     startTransition(async () => {
      const result = await rejectAccessRequest(requestId);
      if (result.success) {
        toast({ title: "Request Rejected", description: `The request from ${userName} has been rejected.` });
        const requests = await getAccessRequests();
        setAllRequests(requests);
      } else {
        toast({ variant: "destructive", title: "Rejection Failed", description: result.error });
      }
    });
  };

  const pendingRequests = allRequests.filter(r => r.status === 'Pending');
  const processedRequests = allRequests.filter(r => r.status !== 'Pending');

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <History className="h-6 w-6" />
              Access Requests
            </CardTitle>
            <CardDescription>
              Approve or deny requests from individuals wanting to join the ZEROS program.
            </CardDescription>
          </div>
           <Badge variant={pendingRequests.length > 0 ? "destructive" : "default"}>
              {pendingRequests.length} Pending
            </Badge>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Requested On</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pendingRequests.length > 0 ? (
                pendingRequests.map((req) => (
                  <TableRow key={req.id}>
                    <TableCell className="font-medium">{req.userName}</TableCell>
                    <TableCell>{req.userEmail}</TableCell>
                    <TableCell>{format(new Date(req.requestedAt), "PP")}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleReject(req.id, req.userName)} disabled={isPending}>
                         {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <><X className="mr-2 h-4 w-4" /> Reject</>}
                      </Button>
                      <Button size="sm" onClick={() => handleApprove(req.id, req.userName)} disabled={isPending}>
                        {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Check className="mr-2 h-4 w-4" /> Approve</>}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    No pending access requests.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
            <CardTitle>Request History</CardTitle>
            <CardDescription>A log of all previously approved or rejected access requests.</CardDescription>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {processedRequests.length > 0 ? (
                        processedRequests.map(req => (
                            <TableRow key={req.id}>
                                <TableCell>{req.userName}</TableCell>
                                <TableCell>{req.userEmail}</TableCell>
                                <TableCell>
                                    <Badge variant={req.status === 'Approved' ? "secondary" : "destructive"}>{req.status}</Badge>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={3} className="text-center">No processed requests yet.</TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </CardContent>
      </Card>
    </div>
  );
}
