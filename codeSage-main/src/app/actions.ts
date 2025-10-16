'use server';

import {
  adaptiveHinting as getHintFlow,
  AdaptiveHintingInput,
} from '@/ai/flows/adaptive-hinting';
import {
  assessCodeQuality as assessCodeQualityFlow,
  AssessCodeQualityInput,
} from '@/ai/flows/code-quality-assessment';
import {
  summarizeChat as summarizeChatFlow,
  type SummarizeChatInput,
} from '@/ai/flows/summarize-chat';

// The realtime complexity analysis is no longer needed during the interview.
// The final report will generate its own analysis.

export async function getHint(input: AdaptiveHintingInput) {
  try {
    return await getHintFlow(input);
  } catch (error) {
    console.error('Error getting hint:', error);
    return { hint: 'Sorry, I am unable to provide a hint at the moment.', newHintLevel: input.hintLevel };
  }
}

export async function assessCodeQuality(
  input: AssessCodeQualityInput
) {
  try {
    return await assessCodeQualityFlow(input);
  } catch (error) {
    console.error('Error assessing code quality:', error);
    return {
      style: 'Error',
      readability: 'Error',
      adherence: 'Error',
      problemSolving: 'Error',
      suggestions: 'Could not assess code quality.',
    };
  }
}

export async function summarizeChat(
  input: SummarizeChatInput
) {
  try {
    return await summarizeChatFlow(input);
  } catch (error) {
    console.error('Error summarizing chat:', error);
    return {
      summary: 'Could not generate chat summary.',
    };
  }
}
