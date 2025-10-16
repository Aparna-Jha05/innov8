import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Code } from 'lucide-react';

interface FinalCodeCardProps {
  code: string;
}

export function FinalCodeCard({ code }: FinalCodeCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base font-medium">
          <Code className="w-4 h-4" />
          Final Submission
        </CardTitle>
        <CardDescription>The code you submitted for assessment.</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-48 w-full rounded-md border bg-muted">
          <pre className="p-4 text-sm font-code">
            <code>{code}</code>
          </pre>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
