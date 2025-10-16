'use client';

import { useState, useMemo, useEffect } from 'react';
import { Header } from '@/components/layout/header';
import { InterviewLayout } from '@/components/interview/interview-layout';
import { ReportLayout } from '@/components/report/report-layout';
import type { AssessCodeQualityOutput } from '@/ai/flows/code-quality-assessment';
import type { Problem } from '@/lib/problems';
import { problems } from '@/lib/problems';
import { Landing } from '@/components/layout/landing';
import { HiringManagerDashboard } from '@/components/hiring/hiring-manager-dashboard';
import { nanoid } from 'nanoid';

export type ChatMessage = {
  role: 'user' | 'ai';
  content: string;
};

export type InterviewResult = { problem: Problem, code: string, report: AssessCodeQualityOutput, chatHistory: ChatMessage[] };

export type InterviewSession = {
  id: string;
  candidateName: string;
  timestamp: string;
  results: InterviewResult[];
};

type ViewState = 'landing' | 'ongoing' | 'completed' | 'hiring_manager';

export default function Home() {
  const [viewState, setViewState] = useState<ViewState>('landing');
  const [interviewResults, setInterviewResults] = useState<InterviewResult[]>([]);
  const [currentProblem, setCurrentProblem] = useState<Problem | null>(null);
  
  const [randomizedProblems, setRandomizedProblems] = useState<Problem[]>([]);
  useEffect(() => {
    setRandomizedProblems([...problems].sort(() => Math.random() - 0.5));
  }, []);

  const getUnseenProblem = (seenProblems: Problem[], difficulty?: 'easy' | 'medium' | 'hard') => {
      const seenTitles = new Set(seenProblems.map(p => p.title));
      let available = randomizedProblems.filter(p => !seenTitles.has(p.title));

      if (difficulty) {
        const byDifficulty = available.filter(p => p.difficulty === difficulty);
        if(byDifficulty.length > 0) {
            return byDifficulty[0];
        }
      }

      if (available.length > 0) {
        return available[0];
      }
      
      return undefined;
  }

  const handleStartInterview = () => {
    if (randomizedProblems.length === 0) return;
    const firstProblem = getUnseenProblem([], 'easy');
    if(firstProblem) {
      setCurrentProblem(firstProblem);
      setViewState('ongoing');
    }
  };
  
  const handleViewHiringDashboard = () => {
    setViewState('hiring_manager');
  }

  const handleInterviewComplete = (report: AssessCodeQualityOutput, code: string, chatHistory: ChatMessage[]) => {
    if (!currentProblem) return;

    const newResult = { problem: currentProblem, code, report, chatHistory };
    const updatedResults = [...interviewResults, newResult];
    setInterviewResults(updatedResults);
    
    if (updatedResults.length < 2) {
      const lastResult = updatedResults[updatedResults.length - 1];
      const isGoodPerformance = 
        lastResult.report.style.toLowerCase().includes('good') && 
        lastResult.report.problemSolving.toLowerCase().includes('effective') && 
        lastResult.report.suggestions.length < 150;

      let nextLevel: 'easy' | 'medium' | 'hard';

      if (lastResult.problem.difficulty === 'easy') {
        nextLevel = isGoodPerformance ? 'medium' : 'easy';
      } else if (lastResult.problem.difficulty === 'medium') {
        nextLevel = isGoodPerformance ? 'hard' : 'medium';
      } else { // hard
        nextLevel = isGoodPerformance ? 'hard' : 'medium';
      }
      
      const seenProblemsForNext = updatedResults.map(r => r.problem);
      const nextProblem = getUnseenProblem(seenProblemsForNext, nextLevel);

       if(nextProblem) {
        setCurrentProblem(nextProblem);
        setViewState('ongoing');
      } else {
        const fallbackProblem = getUnseenProblem(seenProblemsForNext);
        if (fallbackProblem) {
           setCurrentProblem(fallbackProblem);
           setViewState('ongoing');
        } else {
          saveAndCompleteInterview(updatedResults);
        }
      }
    } else {
      saveAndCompleteInterview(updatedResults);
    }
  };
  
  const saveAndCompleteInterview = (finalResults: InterviewResult[]) => {
    const newSession: InterviewSession = {
      id: nanoid(),
      candidateName: `Candidate ${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      results: finalResults,
    };
    
    const allSessions: InterviewSession[] = JSON.parse(localStorage.getItem('interview_sessions') || '[]');
    allSessions.push(newSession);
    localStorage.setItem('interview_sessions', JSON.stringify(allSessions));

    setViewState('completed');
  }

  const handleReset = () => {
    setViewState('landing');
    setInterviewResults([]);
    setCurrentProblem(null);
    setRandomizedProblems([...problems].sort(() => Math.random() - 0.5));
  };

  const renderContent = () => {
    switch (viewState) {
      case 'landing':
        return <Landing onStart={handleStartInterview} onViewHiring={handleViewHiringDashboard} />
      case 'ongoing':
        return currentProblem && <InterviewLayout problem={currentProblem} onInterviewComplete={handleInterviewComplete} />;
      case 'completed':
        return <ReportLayout results={interviewResults} onReset={handleReset} />;
      case 'hiring_manager':
        return <HiringManagerDashboard onBack={handleReset} />;
      default:
        return null;
    }
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex-1 p-4 md:p-8">
        {renderContent()}
      </main>
    </div>
  );
}
