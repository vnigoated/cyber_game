import type { LucideIcon } from 'lucide-react';

export type Character = {
  id: string;
  name: string;
  role: string;
  avatar: string;
  avatarHint: string;
};

export type Channel = 'Email' | 'Chat' | 'SMS' | 'Phone' | 'Physical' | 'Social Media';

export type PlayerChoice = 'trust' | 'verify' | 'report';

export type Scenario = {
  id: number;
  characterId: string;
  channel: Channel;
  title: string;
  content: string;
  correctChoice: PlayerChoice;
  attackType: string;
  feedback: {
    correct: string;
    incorrect: string;
    tip: string;
  };
};

export type GameState = 'intro' | 'playing' | 'debrief';

export type Mistake = {
  scenario: Scenario;
  choice: string;
};

export type Certification = {
  level: string;
  minScore: number;
  title: string;
  badge: string;
};
