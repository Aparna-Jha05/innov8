// A Genkit flow that provides real-time feedback on the algorithmic complexity (Big O) of code.

'use server';

/**
 * @fileOverview A real-time complexity analysis AI agent.
 *
 * - analyzeComplexity - A function that handles the complexity analysis process.
 * - AnalyzeComplexityInput - The input type for the analyzeComplexity function.
 * - AnalyzeComplexityOutput - The return type for the analyzeComplexity function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeComplexityInputSchema = z.object({
  code: z.string().describe('The code to analyze.'),
  language: z.string().describe('The programming language of the code.'),
});
export type AnalyzeComplexityInput = z.infer<typeof AnalyzeComplexityInputSchema>;

const AnalyzeComplexityOutputSchema = z.object({
  complexity: z.string().describe('The estimated algorithmic complexity (Big O) of the code.'),
  explanation: z
    .string()
    .describe('An explanation of how the complexity was determined.'),
  syntaxErrors: z.array(z.object({
    line: z.number().describe('The line number of the error.'),
    message: z.string().describe('The error message.')
  })).describe('An array of syntax errors found in the code. If no errors, return an empty array.'),
});
export type AnalyzeComplexityOutput = z.infer<typeof AnalyzeComplexityOutputSchema>;

export async function analyzeComplexity(input: AnalyzeComplexityInput): Promise<AnalyzeComplexityOutput> {
  return analyzeComplexityFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeComplexityPrompt',
  input: {schema: AnalyzeComplexityInputSchema},
  output: {schema: AnalyzeComplexityOutputSchema},
  prompt: `You are an expert software engineer specializing in analyzing code complexity and finding syntax errors.

  You will receive code as input and must:
  1. Determine its algorithmic complexity (Big O) in terms of time complexity, explaining how it was determined. If the code is incomplete, provide feedback on potential complexity assuming the code was completed in a standard way.
  2. Identify any syntax errors in the code. For each error, provide the line number and a descriptive message. If there are no errors, return an empty array for syntaxErrors.

  Language: {{{language}}}

  Code:
  \`\`\`
  {{{code}}}
  \`\`\`
  `,
});

const analyzeComplexityFlow = ai.defineFlow(
  {
    name: 'analyzeComplexityFlow',
    inputSchema: AnalyzeComplexityInputSchema,
    outputSchema: AnalyzeComplexityOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
