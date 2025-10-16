import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { FileTerminal, AlertCircle, Clock, MemoryStick } from 'lucide-react';
import type { AnalyzeComplexityOutput } from '@/ai/flows/realtime-complexity-analysis';

interface AnalysisPanelProps {
  complexity: AnalyzeComplexityOutput | null;
  isAnalyzing: boolean;
  executionTime: number;
  memoryUsage: number;
}

export function AnalysisPanel({ complexity, isAnalyzing, executionTime, memoryUsage }: AnalysisPanelProps) {
  const syntaxErrors = complexity?.syntaxErrors || [];
  const syntaxErrorCount = isAnalyzing ? -1 : syntaxErrors.length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-medium flex items-center gap-2">
          <FileTerminal className="w-4 h-4"/>
          Real-time Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Complexity (Big O)</span>
          {isAnalyzing ? <Skeleton className="h-5 w-12" /> : 
            <Badge variant="secondary" className="font-mono">{complexity?.complexity || 'N/A'}</Badge>
          }
        </div>
        <Separator />
        <div>
           <p className="text-sm font-medium mb-2">Explanation</p>
          {isAnalyzing ? (
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">{complexity?.explanation || 'Type your code to see complexity analysis.'}</p>
          )}
        </div>
        <Separator />
        <div className="space-y-2">
          <p className="text-sm font-medium">Live Metrics</p>
          <div className="flex justify-between items-center text-sm">
            <span className={`flex items-center gap-1.5 text-muted-foreground ${syntaxErrorCount > 0 ? 'text-destructive' : ''}`}>
              <AlertCircle className={`w-4 h-4 ${syntaxErrorCount > 0 ? 'text-destructive' : ''}`} /> Syntax Errors
            </span>
            {isAnalyzing ? <Skeleton className="h-5 w-4" /> : <span className="font-mono">{syntaxErrorCount}</span>}
          </div>
           <div className="flex justify-between items-center text-sm">
            <span className="flex items-center gap-1.5 text-muted-foreground"><Clock className="w-4 h-4" /> Execution Time</span>
            <span className="font-mono text-muted-foreground">{isAnalyzing ? '--' : executionTime} ms</span>
          </div>
           <div className="flex justify-between items-center text-sm">
            <span className="flex items-center gap-1.5 text-muted-foreground"><MemoryStick className="w-4 h-4" /> Memory Usage</span>
            <span className="font-mono text-muted-foreground">{isAnalyzing ? '--' : memoryUsage} MB</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
