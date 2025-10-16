'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { summarizeChat } from '@/app/actions';
import { MessageSquareQuote } from 'lucide-react';
import type { ChatMessage } from '@/app/page';

interface ChatSummaryCardProps {
  chatHistory: ChatMessage[];
  problemTitle: string;
}

export function ChatSummaryCard({ chatHistory, problemTitle }: ChatSummaryCardProps) {
  const [summary, setSummary] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getSummary = async () => {
      setIsLoading(true);
      const result = await summarizeChat({ chatHistory, problemTitle });
      setSummary(result.summary);
      setIsLoading(false);
    };

    getSummary();
  }, [chatHistory, problemTitle]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base font-medium">
          <MessageSquareQuote className="w-4 h-4" />
          Interviewer Chat Summary
        </CardTitle>
        <CardDescription>A summary of your conversation with the AI interviewer.</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">{summary}</p>
        )}
      </CardContent>
    </Card>
  );
}
