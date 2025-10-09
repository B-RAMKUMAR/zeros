"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { getAccessRequests } from "@/lib/request-actions";
import type { AccessRequest } from "@/lib/types";
import {
  Loader2,
  Clock,
  CheckCircle,
  XCircle,
  FileQuestion,
  Rocket,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import Link from "next/link";
import { Button } from "@/components/ui/button";

function StatusDisplay() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const [request, setRequest] = useState<AccessRequest | null | undefined>(
    undefined
  );

  useEffect(() => {
    if (email) {
      const fetchRequest = async () => {
        const allRequests = await getAccessRequests();
        const userRequest =
          allRequests.find((r) => r.userEmail === email) || null;
        setRequest(userRequest);
      };
      fetchRequest();
    } else {
      setRequest(null);
    }
  }, [email]);

  const getStatusInfo = (status: AccessRequest["status"] | null | undefined) => {
    switch (status) {
      case "Pending":
        return {
          icon: <Clock className="h-8 w-8 text-yellow-500" />,
          title: "Request Pending",
          description:
            "Your enrollment request is awaiting review by the Program Orchestrator.",
          badge: <Badge variant="secondary">Pending</Badge>,
          alert: (
             <Alert>
                <AlertTitle>Next Steps</AlertTitle>
                <AlertDescription>
                    You will be notified via email once your request has been reviewed. No further action is needed at this time.
                </AlertDescription>
            </Alert>
          )
        };
      case "Approved":
        return {
          icon: <CheckCircle className="h-8 w-8 text-green-500" />,
          title: "Request Approved!",
          description:
            "Welcome to the ZEROS Program! Your account has been created.",
          badge: <Badge className="bg-green-500">Approved</Badge>,
           alert: (
             <Alert variant="default" className="bg-green-500/10 border-green-500/50">
                <AlertTitle>You're In!</AlertTitle>
                <AlertDescription>
                    The next step is to set your password. You can do this from the login page by clicking "Set your password".
                </AlertDescription>
            </Alert>
          )
        };
      case "Rejected":
        return {
          icon: <XCircle className="h-8 w-8 text-destructive" />,
          title: "Request Rejected",
          description: "Unfortunately, your enrollment request was not approved at this time.",
          badge: <Badge variant="destructive">Rejected</Badge>,
           alert: (
             <Alert variant="destructive">
                <AlertTitle>Information</AlertTitle>
                <AlertDescription>
                    If you believe this was a mistake, please reach out to the Program Orchestrator for more details.
                </AlertDescription>
            </Alert>
          )
        };
      default:
        return {
          icon: <FileQuestion className="h-8 w-8 text-muted-foreground" />,
          title: "No Request Found",
          description: "We couldn't find an enrollment request associated with this email address.",
          badge: null,
          alert: (
             <Alert>
                <AlertTitle>Need to enroll or check status?</AlertTitle>
                <AlertDescription>
                    If you haven't requested enrollment yet, you can start the process from the onboarding page. To check a status, please enter your email on the tracking page.
                </AlertDescription>
            </Alert>
          )
        };
    }
  };

  if (request === undefined) {
    return (
      <div className="flex items-center justify-center space-x-2">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="text-lg">Loading your status...</p>
      </div>
    );
  }
  
  const statusInfo = getStatusInfo(request?.status);

  return (
    <Card className="mx-auto max-w-lg w-full">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">{statusInfo.icon}</div>
        <CardTitle className="text-2xl">{statusInfo.title}</CardTitle>
        <CardDescription>{statusInfo.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {request && (
           <div className="border rounded-lg p-4 space-y-2">
                <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Your Name:</span>
                    <span className="font-medium">{request.userName}</span>
                </div>
                 <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Your Email:</span>
                    <span className="font-medium">{request.userEmail}</span>
                </div>
                 <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Status:</span>
                    <span>{statusInfo.badge}</span>
                </div>
           </div>
        )}
       
        {statusInfo.alert}

        <div className="flex justify-center">
            {request?.status === "Approved" ? (
                <Button asChild>
                    <Link href="/login">Go to Login</Link>
                </Button>
            ) : (
                 <Button asChild variant="outline">
                    <Link href="/onboarding/request">Back to Enrollment Form</Link>
                </Button>
            )}
        </div>
      </CardContent>
    </Card>
  );
}


export default function OnboardingStatusPage() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-muted/40 relative">
            <div className="absolute top-4 left-4">
              <Link href="/" className="flex items-center justify-center gap-2">
                <Rocket className="h-6 w-6 text-accent" />
                <span className="text-xl font-bold tracking-tighter">ZEROS Launchpad</span>
              </Link>
            </div>
            <Suspense fallback={<Loader2 className="h-10 w-10 animate-spin"/>}>
                <StatusDisplay />
            </Suspense>
        </div>
    )
}
