'use client';

import { useState, useEffect } from 'react';
import type { InterviewSession } from '@/app/page';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { QualityAssessmentCard } from '../report/quality-assessment-card';
import { FinalCodeCard } from '../report/final-code-card';
import { ChatSummaryCard } from '../report/chat-summary-card';
import { format } from 'date-fns';
import { Briefcase, ArrowLeft, User, Calendar, AlertTriangle } from 'lucide-react';

interface HiringManagerDashboardProps {
    onBack: () => void;
}

export function HiringManagerDashboard({ onBack }: HiringManagerDashboardProps) {
    const [sessions, setSessions] = useState<InterviewSession[]>([]);

    useEffect(() => {
        const storedSessions = JSON.parse(localStorage.getItem('interview_sessions') || '[]');
        // FIX: Added explicit types for sort function parameters
        setSessions(storedSessions.sort((a: InterviewSession, b: InterviewSession) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
    }, []);

    return (
        <div className="container mx-auto max-w-7xl">
            <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold font-headline flex items-center gap-2">
                        <Briefcase className="w-6 h-6 text-primary" />
                        Hiring Manager Dashboard
                    </h1>
                    <p className="text-muted-foreground">
                        Review completed interview sessions.
                    </p>
                </div>
                <Button variant="outline" onClick={onBack} size="sm">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Home
                </Button>
            </div>
            
            {sessions.length === 0 ? (
                 <Card className="flex flex-col items-center justify-center py-20">
                    <AlertTriangle className="w-12 h-12 text-muted-foreground mb-4" />
                    <h3 className="text-xl font-semibold">No Interview Sessions Found</h3>
                    <p className="text-muted-foreground">Complete an interview as a candidate to see results here.</p>
                </Card>
            ) : (
                <Accordion type="multiple" className="w-full space-y-4">
                    {sessions.map((session) => (
                         <AccordionItem value={session.id} key={session.id} className="border-b-0 rounded-lg border bg-card text-card-foreground shadow-sm">
                            <AccordionTrigger className="p-6 hover:no-underline">
                                <div className='flex flex-col sm:flex-row sm:items-center sm:gap-6 text-left'>
                                    <h2 className="text-lg font-semibold flex items-center gap-2"><User className="w-5 h-5 text-primary"/>{session.candidateName}</h2>
                                    <div className="text-sm text-muted-foreground flex items-center gap-2">
                                        <Calendar className="w-4 h-4"/>
                                        {format(new Date(session.timestamp), "PPP p")}
                                    </div>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent>
                                <div className="p-6 pt-0">
                                    <Accordion type="single" collapsible className="w-full space-y-4" defaultValue={`problem-${session.id}-0`}>
                                        {session.results.map((result, index) => (
                                            <AccordionItem value={`problem-${session.id}-${index}`} key={index} className="border-b-0 rounded-lg border bg-background">
                                                <AccordionTrigger className="p-4 hover:no-underline text-base font-semibold">
                                                     Problem {index + 1}: {result.problem.title} <span className="text-sm font-normal text-muted-foreground capitalize ml-2">({result.problem.difficulty})</span>
                                                </AccordionTrigger>
                                                <AccordionContent>
                                                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8 p-4 pt-0">
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
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            )}
        </div>
    );
}
