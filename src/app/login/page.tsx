import Link from "next/link";
import { Rocket } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LoginForm } from "@/components/auth/login-form";
import { Suspense } from "react";
import { Separator } from "@/components/ui/separator";

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/40">
       <div className="absolute top-4 left-4">
        <Link href="/" className="flex items-center justify-center gap-2">
          <Rocket className="h-6 w-6 text-accent" />
          <span className="text-xl font-bold tracking-tighter">ZEROS Launchpad</span>
        </Link>
      </div>
      <Card className="mx-auto max-w-sm w-full">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your credentials to access your dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <LoginForm />
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
            <Separator />
            <div className="text-sm text-center">
                First time logging in?{" "}
                <Link href="/first-time-login" className="underline font-semibold text-primary">
                    Set your password
                </Link>
            </div>
        </CardFooter>
      </Card>
    </div>
  );
}
