"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  UserCheck,
  Loader2,
  Lock,
  ArrowRight,
  CheckCircle,
  Rocket,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useTransition, useState } from "react";
import { checkUserByEmail, updateUserPassword } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

const EmailSchema = z.object({
  email: z
    .string()
    .email("Please enter a valid email.")
    .refine(
      (email) => email.endsWith("@mu-sigma.com"),
      "Must be a valid Mu Sigma email address."
    ),
});

const PasswordSchema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters."),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export default function FirstTimeLoginPage() {
  const [isPending, startTransition] = useTransition();
  const [step, setStep] = useState(1);
  const [validatedEmail, setValidatedEmail] = useState("");
  const { toast } = useToast();

  const emailForm = useForm<z.infer<typeof EmailSchema>>({
    resolver: zodResolver(EmailSchema),
    defaultValues: { email: "" },
  });

  const passwordForm = useForm<z.infer<typeof PasswordSchema>>({
    resolver: zodResolver(PasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const onEmailSubmit = (data: z.infer<typeof EmailSchema>) => {
    startTransition(async () => {
      const result = await checkUserByEmail(data.email);
      if (result.success) {
        setValidatedEmail(data.email);
        setStep(2);
        toast({
          title: "Email Verified!",
          description: "Please set your new password.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Verification Failed",
          description: result.error,
        });
      }
    });
  };

  const onPasswordSubmit = (data: z.infer<typeof PasswordSchema>) => {
    startTransition(async () => {
      const result = await updateUserPassword(validatedEmail, data.password);
      if (result.success) {
        setStep(3);
        toast({
          title: "Password Set Successfully!",
          description: "You can now log in with your new credentials.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Update Failed",
          description: result.error,
        });
      }
    });
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
        {step === 1 && (
          <>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <UserCheck className="h-6 w-6" />
                Verify Your Email
              </CardTitle>
              <CardDescription>
                First, please enter your Mu Sigma email address to verify your
                enrollment.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...emailForm}>
                <form
                  onSubmit={emailForm.handleSubmit(onEmailSubmit)}
                  className="space-y-6"
                >
                  <FormField
                    control={emailForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mu Sigma Email</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="your.name@mu-sigma.com"
                            type="email"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button className="w-full" type="submit" disabled={isPending}>
                    {isPending && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Verify Email
                  </Button>
                </form>
              </Form>
            </CardContent>
          </>
        )}

        {step === 2 && (
          <>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Lock className="h-6 w-6" />
                Set Your Password
              </CardTitle>
              <CardDescription>
                Welcome! Your email has been verified. Now create a secure
                password for your account.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...passwordForm}>
                <form
                  onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
                  className="space-y-6"
                >
                  <FormField
                    control={passwordForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New Password</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="••••••••"
                            type="password"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={passwordForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm New Password</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="••••••••"
                            type="password"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button className="w-full" type="submit" disabled={isPending}>
                    {isPending && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Set Password & Continue
                  </Button>
                </form>
              </Form>
            </CardContent>
          </>
        )}

        {step === 3 && (
          <>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <CheckCircle className="h-8 w-8 text-green-500" />
                All Set!
              </CardTitle>
              <CardDescription>
                Your password has been successfully created.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-center">
              <Alert>
                <AlertTitle>You're Ready to Go!</AlertTitle>
                <AlertDescription>
                  You can now log in to the ZEROS Launchpad using your email and
                  your new password.
                </AlertDescription>
              </Alert>
              <Button asChild className="w-full">
                <Link href="/login">
                  Proceed to Login <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </>
        )}
      </Card>
    </div>
  );
}
