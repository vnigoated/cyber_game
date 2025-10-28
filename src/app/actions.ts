'use server';

import { adaptiveMentorGuidance } from "@/ai/flows/adaptive-mentor-guidance";
import { getExplanationFeedback as getExplanationFeedbackFlow } from "@/ai/flows/explanation-feedback-flow";
import type { ExplanationFeedbackInput } from "@/ai/flows/explanation-feedback-flow";

export async function getAIFeedback(playerPerformanceSummary: string) {
    try {
        const result = await adaptiveMentorGuidance({
            playerPerformanceSummary,
            currentScenario: 'Game Debriefing',
            feedbackHistory: [],
        });
        return result;
    } catch (error) {
        console.error('AI feedback generation failed:', error);
        return {
            hint: "Always double-check the sender's email address.",
            summary: "You've shown great potential. Keep practicing to sharpen your instincts. Focus on verifying unusual requests, even from trusted sources.",
            scenarioAdaptation: "Focus on phishing and impersonation scenarios next time.",
        };
    }
}

export async function getExplanationFeedback(input: ExplanationFeedbackInput) {
    try {
        const result = await getExplanationFeedbackFlow(input);
        return result;
    } catch (error) {
        console.error('AI explanation feedback generation failed:', error);
        return {
            feedback: "I seem to be having trouble connecting to the network. The most important thing is to keep your explanation simple and tell your friend what to look out for next time. Avoid technical terms."
        };
    }
}
