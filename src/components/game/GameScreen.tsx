'use client';

import { useState, useMemo, FC, useEffect } from 'react';
import type { Scenario, PlayerChoice } from '@/lib/types';
import { STRINGS } from '@/lib/strings';
import { CHARACTERS } from '@/lib/characters';
import { Button } from '@/components/ui/button';
import { CyberCard, CardContent, CardFooter, CardHeader } from '@/components/ui/CyberCard'; // Updated to CyberCard
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

import { Skeleton } from '@/components/ui/skeleton';
import { ShieldAlert, Mail, MessageSquare, Phone, Users, Globe, Smartphone, CheckCircle, XCircle, AlertTriangle, Activity, AlertOctagon } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import Image from 'next/image';

type GameScreenProps = {
  scenarios: Scenario[];
  onFinish: () => void;
  updateScore: (points: number) => void;
  addMistake: (scenario: Scenario, choice: string) => void;
};

const channelIcons = {
  Email: Mail,
  Chat: MessageSquare,
  Phone: Phone,
  Physical: Users,
  'Social Media': Globe,
  SMS: Smartphone,
};

const choiceButtons: { choice: PlayerChoice; label: string; icon: FC<any>; variant: "default" | "secondary" | "destructive" }[] = [
  { choice: 'trust', label: STRINGS.game.trustButton, icon: CheckCircle, variant: 'default' },
  { choice: 'verify', label: STRINGS.game.verifyButton, icon: AlertTriangle, variant: 'secondary' },
  { choice: 'report', label: STRINGS.game.reportButton, icon: ShieldAlert, variant: 'destructive' },
]

// Typewriter Component
const TypewriterText = ({ text, speed = 10, onComplete }: { text: string; speed?: number, onComplete?: () => void }) => {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    setDisplayedText('');
    let i = 0;
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayedText(prev => prev + text.charAt(i));
        i++;
      } else {
        clearInterval(timer);
        onComplete && onComplete();
      }
    }, speed);
    return () => clearInterval(timer);
  }, [text, speed, onComplete]);

  return <span className="typing-cursor font-mono">{displayedText}</span>;
};




const GameScreen: FC<GameScreenProps> = ({ scenarios, onFinish, updateScore, addMistake }) => {
  const [currentRound, setCurrentRound] = useState(0);
  const [score, setScore] = useState(0);
  const [integrity, setIntegrity] = useState(100); // System Integrity Health Bar
  const [selectedChoice, setSelectedChoice] = useState<PlayerChoice | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [explainMode, setExplainMode] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isDamaged, setIsDamaged] = useState(false); // For shake effect
  const [isHacked, setIsHacked] = useState(false); // For glitch effect on question text



  const scenario = useMemo(() => scenarios[currentRound], [scenarios, currentRound]);
  const character = useMemo(() => Object.values(CHARACTERS).find(c => c.id === scenario.characterId)!, [scenario]);

  useEffect(() => {
    if (isDamaged) {
      const timer = setTimeout(() => setIsDamaged(false), 500);
      return () => clearTimeout(timer);
    }
  }, [isDamaged]);

  const handleChoice = (choice: PlayerChoice) => {
    if (selectedChoice) return;

    const correct = choice === scenario.correctChoice;
    setSelectedChoice(choice);
    setIsCorrect(correct);

    if (correct) {
      updateScore(100);
      setScore(prev => prev + 100);
      // Heal integrity slightly on correct answer?
      setIntegrity(prev => Math.min(100, prev + 5));
      setIntegrity(prev => Math.min(100, prev + 5));
    } else {
      updateScore(-50);
      setScore(prev => prev - 50);
      addMistake(scenario, choice);

      // DAMAGE
      setIsDamaged(true);
      setIntegrity(prev => Math.max(0, prev - 15));
    }

    setShowFeedback(true);
  };



  const handleNext = () => {
    setShowFeedback(false);
    setSelectedChoice(null);
    setIsCorrect(null);
    setIsCorrect(null);
    setIsHacked(false);

    if (currentRound < scenarios.length - 1) {
      setCurrentRound(prev => prev + 1);
    } else {
      onFinish();
    }
  };

  const ChannelIcon = channelIcons[scenario.channel];

  const showNextButton = showFeedback;

  return (
    <div className={cn("w-full max-w-4xl mx-auto p-2 transition-all duration-100", isDamaged && "animate-shake")}>
      {/* HUD Header */}
      <div className="flex justify-between items-end mb-4 bg-black/40 p-4 rounded-t-lg border-b border-primary/20">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest">System Integrity</span>
          <div className="w-48 h-4 bg-gray-900 border border-primary/30 relative overflow-hidden rounded-sm">
            <div
              className={cn(
                "h-full transition-all duration-500",
                integrity > 60 ? "bg-primary shadow-[0_0_10px_#00ff00]" :
                  integrity > 30 ? "bg-yellow-500 shadow-[0_0_10px_#eab308]" : "bg-destructive shadow-[0_0_10px_#ef4444] animate-pulse"
              )}
              style={{ width: `${integrity}%` }}
            />
          </div>
        </div>

        <div className="flex flex-col items-end gap-1">
          <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest">Current Session</span>
          <div className="flex items-center gap-4">
            <p className="font-mono text-xl text-primary font-bold">{score.toString().padStart(6, '0')}</p>
            <Badge variant="outline" className="font-mono bg-primary/10 text-primary border-primary/30">
              WAVE {currentRound + 1}/{scenarios.length}
            </Badge>
          </div>
        </div>
      </div>

      <CyberCard className={cn("w-full transition-colors duration-500", isDamaged ? "border-destructive/50" : "border-primary/30")}>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Activity className={cn("h-4 w-4", isDamaged ? "text-destructive" : "text-primary animate-pulse")} />
              <span className="text-xs font-mono text-primary/70 uppercase">Incoming Transmission...</span>
            </div>
            <div className="flex items-center gap-2">
              <Label htmlFor="explain-mode" className="text-xs font-mono text-muted-foreground cursor-pointer hover:text-primary">ANALYTICS MODE</Label>
              <Switch id="explain-mode" checked={explainMode} onCheckedChange={setExplainMode} />
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="flex flex-col items-center gap-2">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary to-blue-600 rounded-full blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
                <Avatar className={cn("h-24 w-24 border-2 relative bg-black", isDamaged ? "border-destructive animate-pulse" : "border-primary")}>
                  <Image src={character.avatar} alt={character.name} width={96} height={96} data-ai-hint={character.avatarHint} className="object-cover" />
                  <AvatarFallback>{character.name.substring(0, 2)}</AvatarFallback>
                </Avatar>
                {/* Channel Badge floating */}
                <div className="absolute -bottom-2 -right-2 bg-black border border-primary p-1 rounded-full text-primary">
                  <ChannelIcon className="h-4 w-4" />
                </div>
              </div>
              <div className="text-center font-mono">
                <p className="font-bold text-primary">{character.name}</p>
                <p className="text-xs text-muted-foreground uppercase">{character.role}</p>
              </div>
            </div>

            <div className="flex-1 space-y-4">
              <div className="border border-primary/20 bg-primary/5 p-4 rounded-sm relative overflow-hidden min-h-[120px]">
                {/* Scanline overlay for text box */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-0 pointer-events-none opacity-20 bg-[length:100%_4px,6px_6px]" />

                <div className="relative z-10">
                  <p className="font-bold font-mono text-lg mb-2 text-primary/90 flex items-center gap-2">
                    <span className="text-primary">{'>'}</span> {scenario.title}
                  </p>
                  <div className={cn("text-justify font-mono text-sm md:text-base leading-relaxed text-foreground/90", isHacked && "animate-glitch")}>
                    <TypewriterText text={scenario.content} speed={15} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {showFeedback && (
            <div className={cn(
              "p-4 border-l-4 rounded-r-md animate-in slide-in-from-left duration-300",
              isCorrect ? "bg-green-500/10 border-green-500" : "bg-red-500/10 border-red-500"
            )}>
              <div className="flex items-center gap-3 mb-2">
                {isCorrect ? <CheckCircle className="h-6 w-6 text-green-500" /> : <AlertOctagon className="h-6 w-6 text-red-500 animate-pulse" />}
                <h3 className={cn("font-bold font-mono text-xl uppercase", isCorrect ? "text-green-500" : "text-red-500")}>
                  {isCorrect ? "THREAT NEUTRALIZED" : "SECURITY BREACH DETECTED"}
                </h3>
              </div>
              <p className="font-mono text-sm md:text-base">{isCorrect ? scenario.feedback.correct : scenario.feedback.incorrect}</p>

              {explainMode && (
                <div className="mt-4 pt-4 border-t border-primary/20 space-y-2 text-sm font-mono">
                  <p><strong className="text-accent uppercase">Attack Vector:</strong> {scenario.attackType}</p>
                  <p><strong className="text-primary uppercase">Defense Protocol:</strong> {scenario.feedback.tip}</p>
                </div>
              )}
            </div>
          )}


        </CardContent>
        <CardFooter className="flex flex-col gap-4 pb-6 pt-2">
          {!selectedChoice ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
              {choiceButtons.map(({ choice, label, icon: Icon, variant }) => (
                <Button
                  key={choice}
                  onClick={() => handleChoice(choice)}
                  variant={variant === 'default' ? 'default' : variant === 'secondary' ? 'secondary' : 'destructive'}
                  className={cn(
                    "h-14 font-mono uppercase tracking-wider relative overflow-hidden text-wrap",
                    "hover:scale-105 transition-transform duration-200",
                    variant === 'default' && "bg-primary/20 hover:bg-primary/40 text-primary border border-primary/50 shadow-[0_0_15px_rgba(0,255,0,0.1)] hover:shadow-[0_0_20px_rgba(0,255,0,0.3)]",
                    variant === 'secondary' && "bg-yellow-500/20 hover:bg-yellow-500/40 text-yellow-500 border border-yellow-500/50",
                    variant === 'destructive' && "bg-red-500/20 hover:bg-red-500/40 text-red-500 border border-red-500/50"
                  )}
                >
                  <Icon className="mr-2 h-5 w-5" />
                  {label}
                </Button>
              ))}
            </div>
          ) : (
            showNextButton && (
              <Button onClick={handleNext} className="w-full sm:w-1/2 font-bold font-mono text-lg h-14 bg-primary text-black hover:bg-primary/90 uppercase tracking-widest shadow-[0_0_20px_#00ff00] animate-pulse">
                {currentRound < scenarios.length - 1 ? "Initialize Next Sequence >>" : "Complete Mission >>"}
              </Button>
            )
          )}
        </CardFooter>
      </CyberCard>
    </div>
  );
};

export default GameScreen;
