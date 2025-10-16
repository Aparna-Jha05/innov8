'use server';

/**
 * @fileOverview Assesses the code quality of a candidate's code.
 *
 * - assessCodeQuality - A function that assesses the code quality.
 * - AssessCodeQualityInput - The input type for the assessCodeQuality function.
 * - AssessCodeQualityOutput - The return type for the assessCodeQuality function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AssessCodeQualityInputSchema = z.object({
  code: z.string().describe('The code to assess.'),
  language: z.string().describe('The programming language of the code.'),
});
export type AssessCodeQualityInput = z.infer<typeof AssessCodeQualityInputSchema>;

const AssessCodeQualityOutputSchema = z.object({
  style: z.string().describe('Assessment of the code style.'),
  readability: z.string().describe('Assessment of the code readability.'),
  adherence: z
    .string()
    .describe('Assessment of the code adherence to coding standards.'),
  problemSolving: z
    .string()
    .describe(
      "Analysis of the candidate's problem-solving approach and methodology."
    ),
  suggestions: z
    .string()
    .describe('Suggestions for alternative solutions or optimizations.'),
});
export type AssessCodeQualityOutput = z.infer<typeof AssessCodeQualityOutputSchema>;

export async function assessCodeQuality(input: AssessCodeQualityInput): Promise<AssessCodeQualityOutput> {
  return assessCodeQualityFlow(input);
}

const assessCodeQualityPrompt = ai.definePrompt({
  name: 'assessCodeQualityPrompt',
  input: {schema: AssessCodeQualityInputSchema},
  output: {schema: AssessCodeQualityOutputSchema},
  prompt: `You are an expert software engineer who specializes in code quality assessment. Review the code provided, and assess its style, readability and adherence to coding standards.
  Also, identify the candidate’s problem-solving approach and methodology.
  Finally, provide suggestions for alternative solutions or optimizations.
  \nLanguage: {{{language}}}\nCode:\n{{{code}}}`,
});

const assessCodeQualityFlow = ai.defineFlow(
  {
    name: 'assessCodeQualityFlow',
    inputSchema: AssessCodeQualityInputSchema,
    outputSchema: AssessCodeQualityOutputSchema,
  },
  async input => {
    const {output} = await assessCodeQualityPrompt(input);
    return output!;
  }
);
