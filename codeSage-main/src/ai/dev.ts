'use server';

import { config } from 'dotenv';
config();

import '@/ai/flows/adaptive-hinting.ts';
// Real-time analysis is no longer used during the interview.
// import '@/ai/flows/realtime-complexity-analysis.ts';
import '@/ai/flows/code-quality-assessment.ts';
import '@/ai/flows/summarize-chat.ts';
