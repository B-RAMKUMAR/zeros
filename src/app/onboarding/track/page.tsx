
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Rocket, Send } from "lucide-react";

export default function TrackOnboardingStatusPage() {
  const [email, setEmail] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (email) {
      router.push(`/onboarding/status?email=${encodeURIComponent(email)}`);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/40 relative">
       <div className="absolute top-4 left-4">
        <Link href="/" className="flex items-center justify-center gap-2">
          <Rocket className="h-6 w-6 text-accent" />
          <span className="text-xl font-bold tracking-tighter">ZEROS Launchpad</span>
        </Link>
      </div>
      <Card className="mx-auto max-w-lg w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            Track Your Enrollment Status
          </CardTitle>
          <CardDescription>
            Enter your email address below to see the current status of your
            enrollment request.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="your.name@mu-sigma.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full">
              <Send className="mr-2 h-4 w-4" />
              Check Status
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
