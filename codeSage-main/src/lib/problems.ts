import problemsData from './problems.json';

export type ProblemDifficulty = 'easy' | 'medium' | 'hard';

export interface Problem {
  title: string;
  description: string;
  initialCode: string;
  difficulty: ProblemDifficulty;
}

export const problems: Problem[] = problemsData.problems;
