'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { Problem } from "@/lib/problems";
import { ArrowRight } from "lucide-react";

interface ProblemSelectionProps {
    title: string;
    description: string;
    problem: Problem | undefined;
    onProblemSelect: (problem: Problem) => void;
}

export function ProblemSelection({ title, description, problem, onProblemSelect }: ProblemSelectionProps) {

    return (
        <div className="flex items-center justify-center h-full">
            <Card className="w-full max-w-2xl">
                <CardHeader>
                    <CardTitle>{title}</CardTitle>
                    <CardDescription>{description}</CardDescription>
                </CardHeader>
                <CardContent>
                    {problem ? (
                        <div>
                            <h3 className="font-semibold mb-2">{problem.title} <span className="text-xs font-normal text-muted-foreground capitalize">({problem.difficulty})</span></h3>
                            <p className="text-sm text-muted-foreground" dangerouslySetInnerHTML={{ __html: problem.description.replace(/`([^`]+)`/g, '<code class="font-code bg-muted px-1 py-0.5 rounded-sm text-foreground">$1</code>') }} />
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <Skeleton className="h-6 w-3/4" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-5/6" />
                        </div>
                    )}
                </CardContent>
                <CardFooter>
                    <Button onClick={() => problem && onProblemSelect(problem)} disabled={!problem}>
                        Start Problem <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}