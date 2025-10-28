'use server';

/**
 * @fileOverview An AI that provides feedback on a user's explanation of a cybersecurity threat.
 *
 * - getExplanationFeedback - A function that handles the feedback process.
 * - ExplanationFeedbackInput - The input type for the getExplanationFeedback function.
 * - ExplanationFeedbackOutput - The return type for the getExplanationfeedback function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const ExplanationFeedbackInputSchema = z.object({
  scenarioTitle: z.string().describe("The title of the scenario the user faced."),
  attackType: z.string().describe("The type of social engineering attack in the scenario."),
  explanation: z
    .string()
    .describe(
      'The user-written explanation of the threat for a non-technical person.'
    ),
});
export type ExplanationFeedbackInput = z.infer<
  typeof ExplanationFeedbackInputSchema
>;

const ExplanationFeedbackOutputSchema = z.object({
  feedback: z
    .string()
    .describe(
      'Constructive feedback on the user\'s explanation, focusing on clarity, simplicity, and effectiveness for a non-technical audience. Keep it concise (2-3 sentences).'
    ),
});
export type ExplanationFeedbackOutput = z.infer<
  typeof ExplanationFeedbackOutputSchema
>;

export async function getExplanationFeedback(
  input: ExplanationFeedbackInput
): Promise<ExplanationFeedbackOutput> {
  return explanationFeedbackFlow(input);
}

const prompt = ai.definePrompt({
  name: 'explanationFeedbackPrompt',
  input: {
    schema: ExplanationFeedbackInputSchema,
  },
  output: {
    schema: ExplanationFeedbackOutputSchema,
  },
  prompt: `You are Agent Nova, a cybersecurity mentor. A user has just explained a cybersecurity threat to a non-technical person (like a grandparent).

  The scenario was titled "{{scenarioTitle}}" and it was a "{{attackType}}" attack.

  The user's explanation was:
  "{{{explanation}}}"

  Your task is to provide brief, constructive feedback on their explanation. Focus on whether it is simple, clear, and actionable. Avoid technical jargon. For example, is it easy to understand? Does it clearly say what to do or not do? Keep the feedback to 2-3 sentences.
  `,
});

const explanationFeedbackFlow = ai.defineFlow(
  {
    name: 'explanationFeedbackFlow',
    inputSchema: ExplanationFeedbackInputSchema,
    outputSchema: ExplanationFeedbackOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
