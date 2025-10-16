'use server';

/**
 * @fileOverview Provides adaptive hints to candidates during coding interviews.
 *
 * - adaptiveHinting - A function that provides hints tailored to the candidate's code and performance.
 * - AdaptiveHintingInput - The input type for the adaptiveHinting function.
 * - AdaptiveHintingOutput - The return type for the adaptiveHinting function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AdaptiveHintingInputSchema = z.object({
  code: z.string().describe('The current code written by the candidate.'),
  problemDescription: z.string().describe('The description of the coding problem.'),
  question: z.string().describe('The specific question asked by the candidate.'),
  performance: z.object({
    syntaxErrors: z.number().describe('The number of syntax errors in the code.'),
    runtimeErrors: z.number().describe('The number of runtime errors in the code.'),
    complexity: z.string().describe('The estimated algorithmic complexity of the code.'),
  }).describe('The performance metrics of the code.'),
  hintLevel: z.enum(['Nudge', 'Guide', 'Direction']).describe('The current hint level.'),
});
export type AdaptiveHintingInput = z.infer<typeof AdaptiveHintingInputSchema>;

const AdaptiveHintingOutputSchema = z.object({
  hint: z.string().describe('The tailored hint for the candidate.'),
  newHintLevel: z.enum(['Nudge', 'Guide', 'Direction']).describe('The new hint level for the next iteration.'),
});
export type AdaptiveHintingOutput = z.infer<typeof AdaptiveHintingOutputSchema>;

export async function adaptiveHinting(input: AdaptiveHintingInput): Promise<AdaptiveHintingOutput> {
  return adaptiveHintingFlow(input);
}

const prompt = ai.definePrompt({
  name: 'adaptiveHintingPrompt',
  input: {schema: AdaptiveHintingInputSchema},
  output: {schema: AdaptiveHintingOutputSchema},
  prompt: `You are an expert coding interviewer providing hints to a candidate.

  Problem Description: {{{problemDescription}}}
  
  Candidate's Question: "{{{question}}}"

  Current Code:
  \`\`\`
  {{{code}}}
  \`\`\`
  Performance Metrics:
  - Syntax Errors: {{performance.syntaxErrors}}
  - Runtime Errors: {{performance.runtimeErrors}}
  - Complexity: "{{performance.complexity}}"
  
  Current Hint Level: {{{hintLevel}}}

  Based on the candidate's code, their specific question, performance, and current hint level, provide a tailored hint to help them solve the problem. 
  Your primary goal is to answer the user's question in the context of the code and the problem. If they are asking for a hint, provide one.
  Also, determine the appropriate hint level for the next iteration.

  Follow these guidelines when creating the hint:
  - Nudge: A gentle suggestion to nudge the candidate in the right direction.
  - Guide: A more specific hint that provides more detailed guidance.
  - Direction: A very specific instruction that almost gives away the answer.
  - If the candidate is struggling, increase the hint level.
  - If the candidate is doing well, maintain or decrease the hint level.
  - newHintLevel should never skip a level (e.g. Nudge -> Direction is not allowed)

  The hint should be clear, concise, and helpful, directly addressing the user's question.
  Do not mention Big O complexity in the hint.

  Example Output (Do not include the <<BEGIN>> and <<END>> markers):
  Your response should include the hint and newHintLevel as a single JSON.
  <<BEGIN>>
  {
    "hint": "You're on the right track with using a loop. To check for duplicates, consider using a data structure that provides fast lookups, like a hash set.",
    "newHintLevel": "Guide"
  }
  <<END>>`,
});

const adaptiveHintingFlow = ai.defineFlow(
  {
    name: 'adaptiveHintingFlow',
    inputSchema: AdaptiveHintingInputSchema,
    outputSchema: AdaptiveHintingOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
