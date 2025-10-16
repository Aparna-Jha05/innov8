'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getHint, assessCodeQuality } from '@/app/actions';
import type { AssessCodeQualityOutput } from '@/ai/flows/code-quality-assessment';
import { Code } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ProblemDescriptionCard } from './problem-description-card';
import { HintSystemCard } from './hint-system-card';
import type { Problem } from '@/lib/problems';
import type { ChatMessage } from '@/app/page';

type HintLevel = 'Nudge' | 'Guide' | 'Direction';

// Define a custom interface for the SpeechRecognition API to resolve the TypeScript error.
// This interface includes only the properties and methods used in this component.
interface ISpeechRecognition {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onstart: () => void;
  onend: () => void;
  onerror: (event: any) => void;
  onresult: (event: any) => void;
  start: () => void;
  stop: () => void;
}

interface InterviewLayoutProps {
  problem: Problem;
  onInterviewComplete: (report: AssessCodeQualityOutput, code: string, chatHistory: ChatMessage[]) => void;
}

export function InterviewLayout({ problem, onInterviewComplete }: InterviewLayoutProps) {
  const [code, setCode] = useState<string>('');
  const [language, setLanguage] = useState<string>('python');
  
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [hintLevel, setHintLevel] = useState<HintLevel>('Nudge');
  const [isGettingHint, setIsGettingHint] = useState<boolean>(false);

  const [isRecording, setIsRecording] = useState<boolean>(false);
  // Use the custom interface for the recognitionRef.
  const recognitionRef = useRef<ISpeechRecognition | null>(null);
  
  const [isAssessing, setIsAssessing] = useState<boolean>(false);

  const { toast } = useToast();
  
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);
  const codeHasChanged = useRef(false);
  
  const playText = useCallback((text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    }
  }, []);

  const handleGetHint = useCallback(async (userQuestion?: string) => {
    if(isGettingHint) return;

    setIsGettingHint(true);
    const question = userQuestion || "I'm stuck, can I get a hint?";
    
    // Don't add automatic questions to history
    if (userQuestion && userQuestion !== "The user seems stuck, provide a hint.") {
        setChatHistory(prev => [...prev, { role: 'user', content: question }]);
    }
    
    // Performance data is no longer available in real-time, sending defaults.
    const performance = { syntaxErrors: 0, runtimeErrors: 0, complexity: "N/A" };
    const result = await getHint({ 
      code, 
      problemDescription: problem.description,
      question,
      performance, 
      hintLevel 
    });

    if (result.hint) {
       setChatHistory(prev => [...prev, { role: 'ai', content: result.hint }]);
       playText(result.hint);
    }
    if(result.newHintLevel) {
      setHintLevel(result.newHintLevel);
    }
    setIsGettingHint(false);
  }, [code, hintLevel, problem.description, playText, isGettingHint]);
  
  // Effect for proactive hint
  useEffect(() => {
    let idleTimeout = 10000; // Default to 10 seconds

    const startIdleTimer = () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      
      // If the last message was from the AI, wait 30 seconds
      if (chatHistory.length > 0 && chatHistory[chatHistory.length - 1].role === 'ai') {
        idleTimeout = 30000;
      } else {
        idleTimeout = 10000;
      }

      idleTimerRef.current = setTimeout(() => {
        // Trigger hint if code hasn't changed during the idle period.
        if (!codeHasChanged.current) {
          handleGetHint("The user seems stuck, provide a hint.");
        }
        
        // Reset for the next check.
        codeHasChanged.current = false;
        
        // And start the timer again.
        startIdleTimer(); 
      }, idleTimeout);
    };

    // Don't start the timer immediately on mount, wait for initial message to be processed
    const initialTimer = setTimeout(startIdleTimer, 500);

    // Cleanup function to clear the timer when the component unmounts.
    return () => {
      clearTimeout(initialTimer);
      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current);
      }
    };
  }, [handleGetHint, chatHistory]);

  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
    codeHasChanged.current = true;
  };
  
   useEffect(() => {
    setCode(problem.initialCode);
    const welcomeMessage = `Hello! Let's start with this problem: "${problem.title}". Take a moment to read the description. I'm here if you need any help. Good luck!`;
    setChatHistory([{ role: 'ai', content: welcomeMessage }]);
    playText(welcomeMessage);
    codeHasChanged.current = false; // Reset on new problem
    
    // Stop any speaking from previous problem
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [problem, playText]);

  const handleToggleRecording = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
    } else {
      startRecording();
    }
  };

  const startRecording = () => {
    // Ensure this code runs only in the browser.
    if (typeof window === 'undefined') {
        return;
    }
    
    const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognitionAPI) {
      toast({
        variant: "destructive",
        title: "Browser Not Supported",
        description: "Your browser does not support the Web Speech API.",
      });
      return;
    }
    
    const recognition: ISpeechRecognition = new SpeechRecognitionAPI();
    recognitionRef.current = recognition;
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsRecording(true);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
       toast({
        variant: "destructive",
        title: "Speech Recognition Error",
        description: "Could not understand audio, please try again.",
      });
    };
    
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      if (transcript) {
        handleGetHint(transcript);
      } else {
         toast({
          variant: "destructive",
          title: "Voice not detected",
          description: "Could not understand audio, please try again.",
        });
      }
    };
    
    recognition.start();
  };
  
  const handleSubmit = async () => {
    setIsAssessing(true);
    try {
      const report = await assessCodeQuality({ code, language });
      onInterviewComplete(report, code, chatHistory);
      toast({
        title: "Submission successful",
        description: "Your code has been submitted and assessed.",
      });
    } catch(e) {
      toast({
        variant: "destructive",
        title: "Assessment Failed",
        description: "Could not generate the code quality report.",
      });
    } finally {
      setIsAssessing(false);
    }
  };

  return (
    <div className="mx-auto grid w-full max-w-7xl gap-8 lg:grid-cols-2">
      <div className="lg:col-span-1">
        <div className="space-y-6 sticky top-24">
          <ProblemDescriptionCard title={problem.title} description={problem.description} />
          <HintSystemCard 
            chatHistory={chatHistory}
            hintLevel={hintLevel}
            isGettingHint={isGettingHint}
            onGetHint={() => handleGetHint("I'd like a hint.")}
            isRecording={isRecording}
            onToggleRecording={handleToggleRecording}
          />
        </div>
      </div>

      <div className="lg:col-span-1">
        <Card className="h-full flex flex-col shadow-lg">
          <CardHeader className="flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <Code className="w-5 h-5" />
              <h2 className="font-headline text-lg">Code Editor</h2>
            </div>
            <Select defaultValue={language} onValueChange={setLanguage}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="python">Python</SelectItem>
                <SelectItem value="javascript">JavaScript</SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent className="flex-1 flex">
            <Textarea
              value={code}
              onChange={(e) => handleCodeChange(e.target.value)}
              placeholder="Type your code here..."
              className="font-code text-base h-full flex-1 resize-none border-none focus-visible:ring-0 focus-visible:ring-offset-0 p-4"
            />
          </CardContent>
          <CardFooter className="justify-end gap-2 border-t pt-4">
            <Button onClick={handleSubmit} disabled={isAssessing} size="lg">
              {isAssessing ? 'Submitting...' : 'Submit & Continue'}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
