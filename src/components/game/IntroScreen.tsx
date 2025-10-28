'use client';

import { useState } from 'react';
import { STRINGS } from '@/lib/strings';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CHARACTERS } from '@/lib/characters';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { BookOpen } from 'lucide-react';

type IntroScreenProps = {
  onStart: (name: string) => void;
};

const IntroScreen: React.FC<IntroScreenProps> = ({ onStart }) => {
  const agent = CHARACTERS.agentNova;
  const [playerName, setPlayerName] = useState('');

  const handleStart = () => {
    if (playerName.trim()) {
      onStart(playerName.trim());
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh]">
      <Card className="w-full max-w-2xl bg-card/80 backdrop-blur-sm border-primary/20 shadow-lg shadow-primary/10">
        <CardHeader className="text-center">
          <div className="flex flex-col items-center gap-4 mb-4">
             <h1 className="font-headline text-4xl md:text-5xl font-bold text-glow">
              {STRINGS.appName}
            </h1>
            <p className="text-lg text-primary">{STRINGS.appSubtitle}</p>
          </div>
          <CardTitle className="font-headline text-2xl text-primary flex items-center justify-center gap-4">
            <Avatar className="h-16 w-16 border-2 border-primary">
              <Image src={agent.avatar} alt={agent.name} width={64} height={64} data-ai-hint={agent.avatarHint} />
              <AvatarFallback>{agent.name.substring(0, 2)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-2xl">{STRINGS.intro.title}</p>
              <p className="text-sm font-normal text-muted-foreground">{agent.name} - {agent.role}</p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <div className="space-y-2 text-muted-foreground px-4">
            {STRINGS.intro.briefing.map((line, index) => (
              <p key={index} className="opacity-0 fade-in" style={{animationDelay: `${index * 0.2}s`}}>{line}</p>
            ))}
          </div>
          <div className="px-4 space-y-2 text-left opacity-0 fade-in" style={{animationDelay: `0.6s`}}>
            <Label htmlFor="playerName" className="text-primary font-headline">Enter Your Agent Name</Label>
            <Input
              id="playerName"
              type="text"
              placeholder="e.g., Agent Smith"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              className="text-center text-lg"
              maxLength={25}
            />
          </div>
        </CardContent>
        <CardFooter className="flex-col sm:flex-row justify-center items-center gap-4 opacity-0 fade-in" style={{animationDelay: '1s'}}>
           <Link href="/training-room" passHref>
            <Button variant="outline" size="lg">
              <BookOpen className="mr-2 h-4 w-4"/>
              Go to Training Room
            </Button>
          </Link>
          <Button
            onClick={handleStart}
            size="lg"
            className="font-bold text-lg"
            disabled={!playerName.trim()}
          >
            {STRINGS.intro.startButton}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default IntroScreen;
