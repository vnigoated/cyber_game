import { useState } from 'react';
import { STRINGS } from '@/lib/strings';
import { Button } from '@/components/ui/button';
import { CyberCard, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/CyberCard'; // Updated import
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CHARACTERS } from '@/lib/characters';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { BookOpen, Terminal } from 'lucide-react';

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
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
      <CyberCard className="w-full max-w-3xl animate-in fade-in zoom-in duration-500">
        <CardHeader className="text-center pb-2 border-b border-primary/20 mb-4 bg-black/40">
          <div className="flex flex-col items-center gap-2 mb-2">
            <div className="flex items-center gap-2 text-primary font-mono text-sm tracking-[0.2em] opacity-80 uppercase">
              <Terminal className="h-4 w-4" />
              <span>System Initialization</span>
            </div>
            <h1 className="font-headline text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-primary/80 drop-shadow-[0_0_10px_rgba(0,255,0,0.5)]">
              {STRINGS.appName}
            </h1>
            <p className="text-lg text-primary/80 font-mono tracking-widest uppercase">{STRINGS.appSubtitle}</p>
          </div>

          <div className="flex items-center justify-center gap-6 mt-6 p-4 border border-primary/10 bg-primary/5 rounded-md mx-auto max-w-lg">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-primary/20 animate-pulse blur-md"></div>
              <Avatar className="h-20 w-20 border-2 border-primary relative z-10">
                <Image src={agent.avatar} alt={agent.name} width={80} height={80} data-ai-hint={agent.avatarHint} />
                <AvatarFallback>{agent.name.substring(0, 2)}</AvatarFallback>
              </Avatar>
            </div>
            <div className="text-left font-mono">
              <p className="text-xl text-primary font-bold tracking-tight">Mission Briefing</p>
              <p className="text-sm text-muted-foreground uppercase tracking-widest">{agent.name} // {agent.role}</p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="text-center space-y-8 py-6 px-8">
          <div className="space-y-4 text-foreground/90 font-mono text-sm md:text-base leading-relaxed max-w-2xl mx-auto">
            {STRINGS.intro.briefing.map((line, index) => (
              <p key={index} className="border-l-2 border-primary/30 pl-4 text-left">
                <span className="text-primary mr-2">{`>`}</span>
                {line}
              </p>
            ))}
          </div>

          <div className="space-y-4 max-w-md mx-auto pt-4 border-t border-primary/10">
            <Label htmlFor="playerName" className="text-primary font-headline text-xl">Identity Verification</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-primary/50 font-mono text-xs">ID_TAG:</span>
              <Input
                id="playerName"
                type="text"
                placeholder="ENTER AGENT ALIAS"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                className="text-center text-lg font-mono bg-black/50 border-primary/50 text-primary placeholder:text-primary/30 h-12 uppercase tracking-wider focus-visible:ring-primary focus-visible:ring-offset-0"
                maxLength={25}
              />
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex-col sm:flex-row justify-center items-center gap-6 pb-8 bg-black/20 pt-4">
          <Link href="/training-room" passHref>
            <Button variant="outline" size="lg" className="border-primary text-primary hover:bg-primary/10 font-mono uppercase tracking-wider">
              <BookOpen className="mr-2 h-4 w-4" />
              Archive
            </Button>
          </Link>
          <Button
            onClick={handleStart}
            size="lg"
            className="font-bold text-lg bg-primary text-black hover:bg-primary/90 font-mono uppercase tracking-widest px-8 shadow-[0_0_20px_rgba(0,255,0,0.4)] hover:shadow-[0_0_30px_rgba(0,255,0,0.6)] transition-all"
            disabled={!playerName.trim()}
          >
            {STRINGS.intro.startButton}
          </Button>
        </CardFooter>
      </CyberCard>
    </div>
  );
};

export default IntroScreen;
