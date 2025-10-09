"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { createJournalEntryAction } from "@/lib/actions";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "../ui/scroll-area";

export default function JournalGenerator({ userId }: { userId: number }) {
  const [isLoading, setIsLoading] = useState(false);
  const [journalEntry, setJournalEntry] = useState("");
  const { toast } = useToast();

  const handleGenerate = async () => {
    setIsLoading(true);
    setJournalEntry("");
    try {
      const result = await createJournalEntryAction(userId);
      if (result.success && result.data) {
        setJournalEntry(result.data.journalEntry);
        toast({
            title: "Journal Entry Generated",
            description: "Your daily journal entry has been successfully created.",
        })
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Generation Failed",
        description: "There was an error generating your journal entry. Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Button onClick={handleGenerate} disabled={isLoading} size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Generating...
          </>
        ) : (
          "Generate Today's Entry"
        )}
      </Button>
      {(isLoading || journalEntry) && (
        <ScrollArea className="h-96 w-full rounded-md border p-4">
            {isLoading && !journalEntry && <p className="text-muted-foreground">Generating your personalized entry, please wait...</p>}
            {journalEntry && <div className="prose prose-invert max-w-none whitespace-pre-wrap">{journalEntry}</div>}
        </ScrollArea>
      )}
    </div>
  );
}
