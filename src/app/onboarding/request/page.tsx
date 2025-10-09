"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserPlus, Loader2, CheckCircle, ArrowRight, Rocket } from "lucide-react";
import { useForm, SubmitHandler } from "react-hook-form";
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
import { createAccessRequest } from "@/lib/request-actions";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";


const FormSchema = z.object({
  fullName: z.string().min(1, "Full name is required."),
  email: z.string().email("Please enter a valid Mu Sigma email.").refine(
    (email) => email.endsWith("@mu-sigma.com"),
    "Must be a valid Mu Sigma email address."
  ),
  role: z.string().min(1, "Current role is required."),
  terms: z.literal<boolean>(true, {
    errorMap: () => ({ message: "You must accept the terms and conditions" }),
  }),
});

export default function OnboardingRequestPage() {
  const [isPending, startTransition] = useTransition();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");
  const { toast } = useToast();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      fullName: "",
      email: "",
      role: "",
      terms: false,
    },
  });

  const onSubmit: SubmitHandler<z.infer<typeof FormSchema>> = (data) => {
    startTransition(async () => {
      const result = await createAccessRequest(data);
      if (result.success) {
        setIsSubmitted(true);
        setSubmittedEmail(data.email);
        toast({
          title: "Request Submitted!",
          description: "Your enrollment request has been sent for approval.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Submission Failed",
          description: result.error,
        });
      }
    });
  };
  
  if(isSubmitted) {
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
                        <CheckCircle className="h-8 w-8 text-green-500" />
                        Request Sent Successfully!
                    </CardTitle>
                    <CardDescription>
                       Your enrollment request has been submitted for approval. You will receive an email once it's reviewed.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 text-center">
                    <Alert>
                        <AlertTitle>What's Next?</AlertTitle>
                        <AlertDescription>
                            The program orchestrator has been notified. You can track the status of your request on the status page.
                        </AlertDescription>
                    </Alert>
                    <Button asChild className="w-full">
                        <Link href={`/onboarding/status?email=${encodeURIComponent(submittedEmail)}`}>
                            Track Your Status <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
  }

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
            <UserPlus className="h-6 w-6" />
            Program Enrollment & Intent Confirmation
          </CardTitle>
          <CardDescription>
            Complete the form below to request enrollment in the ZEROS Program.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-primary">
                  1. Program Terms & Commitment
                </h3>
                <div className="p-4 mt-2 border rounded-lg bg-background">
                  <p className="text-sm text-muted-foreground">
                    I understand the time commitment (10-15 hrs/week) and agree
                    to uphold Mu Sigma University's academic integrity and IP
                    policy.
                  </p>
                </div>
                 <FormField
                  control={form.control}
                  name="terms"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 mt-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          I confirm and accept the program terms.
                        </FormLabel>
                         <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-primary">
                  2. Your Information
                </h3>
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Your full name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
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
                 <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Role</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Apprentice Analyst" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button className="w-full" type="submit" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Request Enrollment
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
