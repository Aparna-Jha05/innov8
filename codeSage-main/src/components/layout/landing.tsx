'use client';

import { Button } from "@/components/ui/button";
import { ArrowRight, Briefcase } from "lucide-react";

interface LandingProps {
    onStart: () => void;
    onViewHiring: () => void;
}

export function Landing({ onStart, onViewHiring }: LandingProps) {
    return (
        <div className="flex flex-col items-center justify-center text-center h-full max-w-4xl mx-auto space-y-8 pt-16">
            <h1 className="text-4xl md:text-5xl font-bold font-headline">
                Welcome to CodeSage
            </h1>
            
            <p className="text-lg text-muted-foreground">
                The AI-powered platform for technical interviews. Conduct interviews, get real-time feedback, and review comprehensive performance reports.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
                <Button onClick={onStart} size="lg">
                    Start Interview as Candidate <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button onClick={onViewHiring} size="lg" variant="outline">
                    <Briefcase className="mr-2 w-5 h-5" />
                    Hiring Manager Dashboard
                </Button>
            </div>
        </div>
    );
}
