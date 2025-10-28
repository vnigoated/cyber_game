import type { Character } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const getImage = (id: string) => {
  const img = PlaceHolderImages.find(p => p.id === id);
  if (!img) return { url: '', hint: '' };
  return { url: img.imageUrl, hint: img.imageHint };
};

export const CHARACTERS: Record<string, Character> = {
  agentNova: {
    id: 'agentNova',
    name: 'Agent Nova',
    role: 'Mentor/Guide',
    avatar: getImage('agent-nova').url,
    avatarHint: getImage('agent-nova').hint,
  },
  ceoPatel: {
    id: 'ceoPatel',
    name: 'CEO Patel',
    role: 'CyberNova Corp. CEO',
    avatar: getImage('ceo-patel').url,
    avatarHint: getImage('ceo-patel').hint,
  },
  jamieIT: {
    id: 'jamieIT',
    name: 'Jamie',
    role: 'IT Support',
    avatar: getImage('jamie-it').url,
    avatarHint: getImage('jamie-it').hint,
  },
  riyaHR: {
    id: 'riyaHR',
    name: 'Riya',
    role: 'HR Staff',
    avatar: getImage('riya-hr').url,
    avatarHint: getImage('riya-hr').hint,
  },
  alexFinance: {
    id: 'alexFinance',
    name: 'Alex',
    role: 'Finance Department',
    avatar: getImage('alex-finance').url,
    avatarHint: getImage('alex-finance').hint,
  },
  mayaReceptionist: {
    id: 'mayaReceptionist',
    name: 'Maya',
    role: 'Receptionist',
    avatar: getImage('maya-receptionist').url,
    avatarHint: getImage('maya-receptionist').hint,
  },
  unknownCaller: {
    id: 'unknownCaller',
    name: 'Unknown Caller "Mike"',
    role: 'External Caller',
    avatar: getImage('unknown-caller').url,
    avatarHint: getImage('unknown-caller').hint,
  },
  randomStranger: {
    id: 'randomStranger',
    name: 'Stranger at Cafe',
    role: 'Unknown',
    avatar: getImage('random-stranger').url,
    avatarHint: getImage('random-stranger').hint,
  },
  socialMediaContact: {
    id: 'socialMediaContact',
    name: 'CyberInfluencer123',
    role: 'Social Media Contact',
    avatar: getImage('social-media-influencer').url,
    avatarHint: getImage('social-media-influencer').hint,
  },
  friendRequestBot: {
    id: 'friendRequestBot',
    name: 'New Connection Request',
    role: 'Automated Bot',
    avatar: getImage('friend-request-bot').url,
    avatarHint: getImage('friend-request-bot').hint,
  },
};
