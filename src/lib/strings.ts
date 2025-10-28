import { CHARACTERS } from "./characters";

export const STRINGS = {
  appName: "Cyber Defenders",
  appSubtitle: "The Social Engineering Challenge",
  intro: {
    title: "Mission Briefing",
    agentName: CHARACTERS.agentNova.name,
    agentRole: CHARACTERS.agentNova.role,
    briefing: [
      "Welcome, trainee. Your mission is to navigate a series of real-world scenarios at CyberNova Corp.",
      "You’ll meet coworkers, clients, and strangers through various channels.",
      "Not everyone is who they seem. Your job is to spot the threats before they succeed. Analyze every message. Question every request. Trust, but verify.",
      "Your performance will be scored. Let's see if you have what it takes to be a Cyber Defender."
    ],
    startButton: "Start Challenge",
  },
  game: {
    round: "Round",
    of: "of",
    score: "Score",
    channel: "Channel",
    trustButton: "Trust",
    verifyButton: "Verify",
    reportButton: "Report",
    nextButton: "Next Scenario",
    finishButton: "Finish Debrief",
    explainModeLabel: "Explain Mode",
    result: "Result",
    attackType: "Attack Type",
    proTip: "Pro Tip",
    protectFriendTitle: "Protect a Friend",
    protectFriendPrompt: "Now, explain this threat in simple terms to a non-technical friend or family member. How would you help them avoid this?"
  },
  debrief: {
    title: "Final Debrief",
    agentName: CHARACTERS.agentNova.name,
    agentRole: CHARACTERS.agentNova.role,
    scoreTitle: "Your Final Score",
    certificationTitle: "Certification Level",
    mistakesTitle: "Areas for Improvement",
    noMistakes: "Outstanding! You made no mistakes. A true Cyber Defender!",
    aiFeedbackTitle: "Agent Nova's Personalized Feedback",
    aiLoading: "Agent Nova is analyzing your performance...",
    yourChoice: "Your Choice",
    correctChoice: "Correct Choice",
    playAgainButton: "Play Again",
  },
  certificationLevels: [
    { level: 'Trainee', minScore: 0, title: "Cyber Trainee", badge: "ShieldOff" },
    { level: 'Analyst', minScore: 400, title: "Junior Analyst", badge: "ShieldCheck" },
    { level: 'Defender', minScore: 800, title: "Cyber Defender", badge: "Shield" },
    { level: 'Guardian', minScore: 1100, title: "Cyber Guardian", badge: "ShieldAlert" },
  ]
};
