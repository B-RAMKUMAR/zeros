import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Rocket, LogIn, UserPlus, Search } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export default function Home() {
  const heroImage = PlaceHolderImages.find(p => p.id === "hero");

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b">
        <Link href="/" className="flex items-center justify-center gap-2">
          <Rocket className="h-6 w-6 text-accent" />
          <span className="text-xl font-bold tracking-tighter">Mu Sigma University ZEROS Program</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link href="/playbook">
            <Button variant="ghost">Playbook</Button>
          </Link>
           <Link href="/onboarding/track">
            <Button variant="ghost">
              <Search className="mr-2 h-4 w-4" /> Track Status
            </Button>
          </Link>
          <Link href="/login">
            <Button>
              <LogIn className="mr-2 h-4 w-4" /> Login
            </Button>
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 relative" style={{background: "linear-gradient(135deg, #FFFFFF, #E6EBF0)"}}>
          <div className="container px-4 md:px-6 z-10 relative">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="bg-background/80 backdrop-blur-sm p-6 rounded-lg">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none mt-2 text-primary">
                  Mu Sigma University ZEROS Program
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl mt-4">
                  The Digital Product for High-Efficiency Problem Solving.
                </p>
                <div className="mt-6">
                  <Link href="/login">
                    <Button size="lg">Login to Dashboard</Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-secondary/20">
          <div className="container px-4 md:px-6">
             <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:grid-cols-2 mt-12">
              <Card className="transform hover:scale-105 transition-transform duration-300">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="bg-accent rounded-md p-3 flex items-center justify-center">
                      <BookOpen className="h-6 w-6 text-accent-foreground" />
                    </div>
                    <CardTitle className="text-2xl">Overall Program Playbook</CardTitle>
                  </div>
                  <CardDescription>
                    Program Overview: 4 Phases, 16 Deliverables. Objectives and Scorecard access.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href="/playbook">
                    <Button className="w-full">View Playbook</Button>
                  </Link>
                </CardContent>
              </Card>
              <Card className="transform hover:scale-105 transition-transform duration-300">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="bg-accent rounded-md p-3 flex items-center justify-center">
                      <UserPlus className="h-6 w-6 text-accent-foreground" />
                    </div>
                    <CardTitle className="text-2xl">Program Onboarding</CardTitle>
                  </div>
                  <CardDescription>
                    Review program terms and submit your official enrollment request.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href="/onboarding/request">
                    <Button className="w-full">Start Onboarding</Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">&copy; 2024 Mu Sigma University ZEROS Program. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}
