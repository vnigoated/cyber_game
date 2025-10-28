'use server';

/**
 * @fileOverview An AI mentor that guides the player through the game, providing hints,
 * summarizing lessons, and adapting scenarios based on the player's weak points.
 *
 * - adaptiveMentorGuidance - A function that handles the adaptive mentor guidance process.
 * - AdaptiveMentorGuidanceInput - The input type for the adaptiveMentorGuidance function.
 * - AdaptiveMentorGuidanceOutput - The return type for the adaptiveMentorGuidance function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const AdaptiveMentorGuidanceInputSchema = z.object({
  playerPerformanceSummary: z
    .string()
    .describe('A summary of the player performance in the game.'),
  currentScenario: z
    .string()
    .optional()
    .describe('The details of the current scenario the player is facing.'),
  feedbackHistory: z
    .array(z.string())
    .optional()
    .describe('A history of feedback given to the player.'),
});
export type AdaptiveMentorGuidanceInput = z.infer<typeof AdaptiveMentorGuidanceInputSchema>;

const AdaptiveMentorGuidanceOutputSchema = z.object({
  hint: z.string().describe('A helpful hint for the current scenario.'),
  summary: z.string().describe('A summary of lessons learned so far.'),
  scenarioAdaptation: z
    .string()
    .describe(
      'Suggestions on how to adapt future scenarios based on the player weaknesses.'
    ),
});
export type AdaptiveMentorGuidanceOutput = z.infer<typeof AdaptiveMentorGuidanceOutputSchema>;

export async function adaptiveMentorGuidance(
  input: AdaptiveMentorGuidanceInput
): Promise<AdaptiveMentorGuidanceOutput> {
  return adaptiveMentorGuidanceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'adaptiveMentorGuidancePrompt',
  input: {
    schema: AdaptiveMentorGuidanceInputSchema,
  },
  output: {
    schema: AdaptiveMentorGuidanceOutputSchema,
  },
  prompt: `You are Agent Nova, a cybersecurity mentor. Based on the player's performance, current scenario, and feedback history, provide a hint for the current scenario, a summary of lessons learned, and suggestions for adapting future scenarios to address the player's weaknesses.

Player Performance Summary: {{{playerPerformanceSummary}}}
Current Scenario: {{{currentScenario}}}
Feedback History: {{{feedbackHistory}}}

Hint: 
Summary: 
Scenario Adaptation: `,
});

const adaptiveMentorGuidanceFlow = ai.defineFlow(
  {
    name: 'adaptiveMentorGuidanceFlow',
    inputSchema: AdaptiveMentorGuidanceInputSchema,
    outputSchema: AdaptiveMentorGuidanceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
