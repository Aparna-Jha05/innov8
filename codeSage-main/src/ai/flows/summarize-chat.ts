'use server';

/**
 * @fileOverview Summarizes a chat conversation.
 *
 * - summarizeChat - A function that summarizes a conversation.
 * - SummarizeChatInput - The input type for the summarizeChat function.
 * - SummarizeChatOutput - The return type for the summarizeChat function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ChatMessageSchema = z.object({
  role: z.enum(['user', 'ai']),
  content: z.string(),
});

const SummarizeChatInputSchema = z.object({
  chatHistory: z.array(ChatMessageSchema).describe('The chat history to summarize.'),
  problemTitle: z.string().describe('The title of the problem being discussed.'),
});
export type SummarizeChatInput = z.infer<typeof SummarizeChatInputSchema>;

const SummarizeChatOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the conversation.'),
});
export type SummarizeChatOutput = z.infer<typeof SummarizeChatOutputSchema>;


export async function summarizeChat(input: SummarizeChatInput): Promise<SummarizeChatOutput> {
  return summarizeChatFlow(input);
}

const summarizeChatPrompt = ai.definePrompt({
  name: 'summarizeChatPrompt',
  input: {schema: SummarizeChatInputSchema},
  output: {schema: SummarizeChatOutputSchema},
  prompt: `You are an expert at summarizing technical conversations.
  
  Please provide a concise, one-paragraph summary of the following chat session between a candidate and an AI interviewer about the coding problem: "{{problemTitle}}".
  
  Focus on the candidate's line of questioning and the key hints provided by the AI.

  Chat History:
  {{#each chatHistory}}
  - {{role}}: {{content}}
  {{/each}}
  `,
});

const summarizeChatFlow = ai.defineFlow(
  {
    name: 'summarizeChatFlow',
    inputSchema: SummarizeChatInputSchema,
    outputSchema: SummarizeChatOutputSchema,
  },
  async input => {
    // Don't summarize a short conversation
    if (input.chatHistory.length <= 2) {
      return { summary: "The candidate did not require any hints for this problem." };
    }
    const {output} = await summarizeChatPrompt(input);
    return output!;
  }
);
