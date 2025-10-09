"use client";

import type { Task } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Clock, Upload } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";

type Countdown = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

function calculateCountdown(eta: string): Countdown | null {
  const difference = +new Date(eta) - +new Date();
  if (difference > 0) {
    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }
  return null;
}

export default function TaskCard({ task }: { task: Task }) {
  const [countdown, setCountdown] = useState<Countdown | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setCountdown(calculateCountdown(task.eta));
    const timer = setInterval(() => {
      setCountdown(calculateCountdown(task.eta));
    }, 1000);

    return () => clearInterval(timer);
  }, [task.eta]);

  const getBadgeVariant = (status: Task["status"]) => {
    switch (status) {
      case "Scored":
        return "default";
      case "Submitted":
        return "secondary";
      case "In Progress":
        return "default";
      case "Overdue":
        return "destructive";
      default:
        return "outline";
    }
  };

  const isActionable = task.status === "Not Started" || task.status === "In Progress";
  
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
            <div>
                <CardTitle>{task.title}</CardTitle>
                <CardDescription>{task.objective}</CardDescription>
            </div>
            <Badge variant={getBadgeVariant(task.status)}>{task.status}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">{task.description}</p>
        {isClient && countdown ? (
            <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4" />
                <span>
                    Time left: {countdown.days}d {countdown.hours}h {countdown.minutes}m {countdown.seconds}s
                </span>
            </div>
        ) : (
             <div className="flex items-center gap-2 text-sm text-destructive">
                <Clock className="h-4 w-4" />
                <span>{isClient ? 'Deadline passed' : 'Calculating...'}</span>
            </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        {task.score !== null && task.score !== undefined ? (
             <div>
                <span className="text-sm font-medium">Score: {task.score}/100</span>
                <Progress value={task.score} className="w-32 mt-1" />
             </div>
        ) : <div />}
        {isActionable && (
            <Button asChild>
                <Link href="/dashboard/submissions">
                    <Upload className="mr-2 h-4 w-4" />
                    Submit Deliverable
                </Link>
            </Button>
        )}
      </CardFooter>
    </Card>
  );
}
