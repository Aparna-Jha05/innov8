import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import type { AssessCodeQualityOutput } from '@/ai/flows/code-quality-assessment';
import { CheckCircle, Lightbulb, BookOpen, Scaling, BrainCircuit } from 'lucide-react';

interface QualityAssessmentCardProps {
  report: AssessCodeQualityOutput;
}

const qualitySections = [
  {
    title: 'Style',
    key: 'style',
    icon: CheckCircle,
  },
  {
    title: 'Readability',
    key: 'readability',
    icon: BookOpen,
  },
  {
    title: 'Adherence to Standards',
    key: 'adherence',
    icon: Scaling,
  },
    {
    title: 'Problem-Solving Approach',
    key: 'problemSolving',
    icon: BrainCircuit,
  },
  {
    title: 'Suggestions & Optimizations',
    key: 'suggestions',
    icon: Lightbulb,
  },
] as const;


export function QualityAssessmentCard({ report }: QualityAssessmentCardProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Code Quality Assessment</CardTitle>
        <CardDescription>AI-powered analysis of your solution.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {qualitySections.map((section, index) => (
          <React.Fragment key={section.key}>
            <div className="flex items-start gap-4">
               <section.icon className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
              <div className="space-y-1">
                <h4 className="font-semibold text-sm">{section.title}</h4>
                <p className="text-sm text-muted-foreground">{report[section.key]}</p>
              </div>
            </div>
            {index < qualitySections.length - 1 && <Separator />}
          </React.Fragment>
        ))}
      </CardContent>
    </Card>
  );
}
