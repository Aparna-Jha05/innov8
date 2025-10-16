'use client';

import { Button } from '@/components/ui/button';
import { RefreshCw, Sparkles } from 'lucide-react';
import { QualityAssessmentCard } from './quality-assessment-card';
import { FinalCodeCard } from './final-code-card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import type { InterviewResult } from '@/app/page';
import { ChatSummaryCard } from './chat-summary-card';

interface ReportLayoutProps {
  results: InterviewResult[];
  onReset: () => void;
}

export function ReportLayout({ results, onReset }: ReportLayoutProps) {

  return (
    <div className="container mx-auto max-w-7xl">
      <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div className="space-y-1">
            <h1 className="text-2xl font-bold font-headline flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-primary" />
              Final Interview Report
            </h1>
            <p className="text-muted-foreground">
              Here's a summary of your performance across {results.length} problems.
            </p>
        </div>
        <Button variant="outline" onClick={onReset} size="sm">
          <RefreshCw className="mr-2 h-4 w-4" />
          Start New Session
        </Button>
      </div>

      <Accordion type="single" collapsible className="w-full space-y-4" defaultValue="problem-0">
        {results.map((result, index) => (
            <AccordionItem value={`problem-${index}`} key={index} className="border-b-0 rounded-lg border bg-card text-card-foreground shadow-sm">
                <AccordionTrigger className="p-6 hover:no-underline">
                    <h2 className="text-lg font-semibold">Problem {index + 1}: {result.problem.title} <span className="text-sm font-normal text-muted-foreground capitalize">({result.problem.difficulty})</span></h2>
                </AccordionTrigger>
                <AccordionContent>
                     <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8 p-6 pt-0">
                        <div className="lg:col-span-2">
                          <QualityAssessmentCard report={result.report} />
                        </div>
                        <div className="space-y-6 lg:space-y-8">
                           <FinalCodeCard code={result.code} />
                           <ChatSummaryCard chatHistory={result.chatHistory} problemTitle={result.problem.title} />
                        </div>
                    </div>
                </AccordionContent>
            </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
