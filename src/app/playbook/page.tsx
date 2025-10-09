import { getPlaybookSections } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Rocket } from "lucide-react";
import Link from "next/link";
import PlaybookTabs from "@/components/dashboard/playbook-tabs";


export default async function PlaybookPage() {
  const sections = await getPlaybookSections();

  return (
    <div className="flex flex-col min-h-screen bg-muted/20">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b sticky top-0 bg-background/95 backdrop-blur-sm z-10">
        <Link href="/" className="flex items-center justify-center gap-2">
          <Rocket className="h-6 w-6 text-accent" />
          <span className="text-xl font-bold tracking-tighter">
            ZEROS Launchpad
          </span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link href="/dashboard">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
        </nav>
      </header>

      <main className="flex-1 container mx-auto py-12 px-4 md:px-6">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter text-primary">
            ZEROS Program Playbook - Phase 1
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
            Your comprehensive guide to the objectives, schedule, and scoring of the ZEROS program.
          </p>
        </div>

        <PlaybookTabs sections={sections} />

      </main>

      <footer className="py-6 border-t bg-background mt-12">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          &copy; 2024 Mu Sigma University ZEROS Program.
        </div>
      </footer>
    </div>
  );
}
