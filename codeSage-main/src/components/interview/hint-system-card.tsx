import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Lightbulb, Mic, StopCircle, User, Bot } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useEffect, useRef } from 'react';
import type { ChatMessage } from '@/app/page';

type HintLevel = 'Nudge' | 'Guide' | 'Direction';

interface HintSystemCardProps {
  chatHistory: ChatMessage[];
  hintLevel: HintLevel;
  isGettingHint: boolean;
  onGetHint: () => void;
  isRecording: boolean;
  onToggleRecording: () => void;
}

export function HintSystemCard({ 
  chatHistory,
  hintLevel, 
  isGettingHint, 
  onGetHint, 
  isRecording, 
  onToggleRecording,
}: HintSystemCardProps) {
  const scrollAreaViewportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaViewportRef.current) {
        scrollAreaViewportRef.current.scrollTo({
        top: scrollAreaViewportRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [chatHistory]);

  return (
    <Card className="flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-medium flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-accent"/>
          Agentic Interviewer
        </CardTitle>
        <Badge variant="outline" className="text-accent border-accent">{hintLevel}</Badge>
      </CardHeader>
      <CardContent className="flex-1 p-0">
        <ScrollArea className="h-48" viewportRef={scrollAreaViewportRef}>
          <div className="p-4 space-y-4">
            {chatHistory.length === 0 && !isRecording && (
               <p className="text-sm text-muted-foreground italic text-center py-4">Click "Get Hint" or use the mic to ask a question.</p>
            )}

            {chatHistory.map((message, index) => (
              <div key={index} className={cn("flex items-start gap-3", message.role === 'user' ? 'justify-end' : 'items-start')}>
                {message.role === 'ai' && <Bot className="w-5 h-5 text-accent flex-shrink-0 mt-1" />}
                <div className={cn("p-2 rounded-lg text-sm max-w-[90%]", 
                  message.role === 'user' ? 'bg-secondary' : 'bg-background'
                )}>
                  <p className="text-foreground">{message.content}</p>
                </div>
                {message.role === 'user' && <User className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-1" />}
              </div>
            ))}

            {isGettingHint && chatHistory[chatHistory.length-1]?.role !== 'ai' && (
              <div className="flex items-start gap-3">
                 <Bot className="w-5 h-5 text-accent flex-shrink-0 mt-1" />
                 <div className="p-2 rounded-lg text-sm bg-background">
                    <Skeleton className="h-4 w-24" />
                 </div>
              </div>
            )}
            
            {isRecording && (
               <p className="text-sm text-muted-foreground italic text-center py-4">Listening...</p>
            )}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="gap-2 border-t pt-4">
        <Button onClick={onGetHint} disabled={isGettingHint || isRecording} className="w-full bg-accent/10 text-accent-foreground border-accent/20 border hover:bg-accent/20">
          <Lightbulb className="mr-2 h-4 w-4" />
          {isGettingHint ? 'Thinking...' : 'Get Hint'}
        </Button>
        <Button onClick={onToggleRecording} disabled={isGettingHint} variant="outline" size="icon" className={`w-12 transition-colors ${isRecording ? 'bg-destructive/20 border-destructive text-destructive' : ''}`}>
          {isRecording ? <StopCircle className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
        </Button>
      </CardFooter>
    </Card>
  );
}
