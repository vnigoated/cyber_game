'use client';

import { useState, useMemo, FC, useEffect } from 'react';
import type { Scenario, PlayerChoice } from '@/lib/types';
import { STRINGS } from '@/lib/strings';
import { CHARACTERS } from '@/lib/characters';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { getExplanationFeedback } from '@/app/actions';
import { Shield, ShieldCheck, ShieldAlert, Mail, MessageSquare, Phone, Users, Globe, Smartphone, CheckCircle, XCircle, AlertTriangle, MessageCircleQuestion, Sparkles } from 'lucide-react';
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

type ProtectAFriendState = 'idle' | 'writing' | 'loading' | 'showing_feedback';

const GameScreen: FC<GameScreenProps> = ({ scenarios, onFinish, updateScore, addMistake }) => {
  const [currentRound, setCurrentRound] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<PlayerChoice | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [explainMode, setExplainMode] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  const [protectFriendState, setProtectFriendState] = useState<ProtectAFriendState>('idle');
  const [explanation, setExplanation] = useState('');
  const [explanationFeedback, setExplanationFeedback] = useState('');

  const scenario = useMemo(() => scenarios[currentRound], [scenarios, currentRound]);
  const character = useMemo(() => Object.values(CHARACTERS).find(c => c.id === scenario.characterId)!, [scenario]);

  const handleChoice = (choice: PlayerChoice) => {
    if (selectedChoice) return;

    const correct = choice === scenario.correctChoice;
    setSelectedChoice(choice);
    setIsCorrect(correct);
    
    if (correct) {
      updateScore(100);
      setScore(prev => prev + 100);
      if (scenario.correctChoice !== 'trust') {
        setProtectFriendState('writing');
      }
    } else {
      updateScore(-50);
      setScore(prev => prev - 50);
      addMistake(scenario, choice);
    }
    
    setShowFeedback(true);
  };

  const handleProtectFriendSubmit = async () => {
    if (!explanation) return;
    setProtectFriendState('loading');
    const result = await getExplanationFeedback({
      scenarioTitle: scenario.title,
      attackType: scenario.attackType,
      explanation: explanation,
    });
    setExplanationFeedback(result.feedback);
    setProtectFriendState('showing_feedback');
  };

  const handleNext = () => {
    setShowFeedback(false);
    setSelectedChoice(null);
    setIsCorrect(null);
    setProtectFriendState('idle');
    setExplanation('');
    setExplanationFeedback('');

    if (currentRound < scenarios.length - 1) {
      setCurrentRound(prev => prev + 1);
    } else {
      onFinish();
    }
  };

  const ChannelIcon = channelIcons[scenario.channel];

  const showNextButton = showFeedback && (protectFriendState === 'idle' || protectFriendState === 'showing_feedback');

  return (
    <Card className="w-full max-w-3xl mx-auto bg-card/80 backdrop-blur-sm border-primary/20 shadow-lg shadow-primary/10 opacity-0 fade-in">
      <CardHeader>
        <div className="flex justify-between items-center mb-4 gap-4">
          <div>
            <p className="font-headline text-primary text-glow">{STRINGS.game.round} {currentRound + 1} {STRINGS.game.of} {scenarios.length}</p>
          </div>
          <div className="flex items-center gap-2">
            <Label htmlFor="explain-mode" className="text-sm text-muted-foreground">{STRINGS.game.explainModeLabel}</Label>
            <Switch id="explain-mode" checked={explainMode} onCheckedChange={setExplainMode} />
          </div>
          <div>
            <p className="font-headline text-primary text-glow">{STRINGS.game.score}: <span className={cn(score >= 0 ? 'text-primary' : 'text-destructive')}>{score}</span></p>
          </div>
        </div>
        <Progress value={((currentRound + 1) / scenarios.length) * 100} className="w-full" />
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex gap-4 items-start">
          <Avatar className="h-16 w-16 border-2 border-primary/50">
            <Image src={character.avatar} alt={character.name} width={64} height={64} data-ai-hint={character.avatarHint} />
            <AvatarFallback>{character.name.substring(0, 2)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
             <div className="flex justify-between items-baseline">
                <div>
                    <p className="font-bold font-headline text-lg">{character.name}</p>
                    <p className="text-sm text-muted-foreground">{character.role}</p>
                </div>
                <Badge variant="outline" className="flex gap-2 items-center">
                    <ChannelIcon className="h-4 w-4" />
                    {scenario.channel}
                </Badge>
             </div>
             <div className="mt-4 p-4 rounded-lg bg-background/50 border border-border relative">
                 <p className="font-bold mb-2">{scenario.title}</p>
                 <p className="text-muted-foreground">{scenario.content}</p>
             </div>
          </div>
        </div>

        {showFeedback && (
          <Card className={cn("p-4 border-2 opacity-0 fade-in", isCorrect ? 'border-green-500' : 'border-red-500')}>
            <CardHeader className="p-0 mb-2">
                <h3 className="font-headline text-lg flex items-center gap-2">
                    {isCorrect ? <CheckCircle className="text-green-500"/> : <XCircle className="text-red-500" />}
                    {STRINGS.game.result}
                </h3>
            </CardHeader>
            <CardContent className="p-0 space-y-2">
                <p>{isCorrect ? scenario.feedback.correct : scenario.feedback.incorrect}</p>
                {explainMode && (
                    <>
                    <Separator />
                    <p><strong className="text-accent">{STRINGS.game.attackType}:</strong> {scenario.attackType}</p>
                    <p><strong className="text-primary">{STRINGS.game.proTip}:</strong> {scenario.feedback.tip}</p>
                    </>
                )}
            </CardContent>
          </Card>
        )}

        {protectFriendState !== 'idle' && (
          <Card className="p-4 bg-background/50 opacity-0 fade-in">
            <CardHeader className="p-0 mb-3">
              <h3 className="font-headline text-lg flex items-center gap-2 text-primary">
                <MessageCircleQuestion />
                {STRINGS.game.protectFriendTitle}
              </h3>
              <p className="text-sm text-muted-foreground">{STRINGS.game.protectFriendPrompt}</p>
            </CardHeader>
            <CardContent className="p-0 space-y-3">
              <Textarea 
                placeholder="e.g., Hey Grandpa, if you get an email about gift cards from your boss, call them to make sure it's real before you do anything!"
                value={explanation}
                onChange={(e) => setExplanation(e.target.value)}
                disabled={protectFriendState !== 'writing'}
              />
              {protectFriendState === 'writing' && (
                <Button onClick={handleProtectFriendSubmit} disabled={!explanation.trim()}>
                  Get Feedback
                </Button>
              )}
              {protectFriendState === 'loading' && <Skeleton className="h-10 w-32" />}
              {protectFriendState === 'showing_feedback' && (
                <div className="p-3 rounded-md bg-background border border-accent opacity-0 fade-in">
                  <h4 className="font-semibold flex items-center gap-2 mb-2"><Sparkles className="h-5 w-5 text-accent"/>Agent Nova's Feedback</h4>
                  <p className="text-muted-foreground italic">"{explanationFeedback}"</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row justify-center gap-3">
        {!selectedChoice ? (
          choiceButtons.map(({ choice, label, icon: Icon, variant }) => (
            <Button key={choice} onClick={() => handleChoice(choice)} className="w-full sm:w-auto" variant={variant}>
              <Icon className="mr-2 h-4 w-4" />
              {label}
            </Button>
          ))
        ) : (
          showNextButton && (
            <Button onClick={handleNext} className="w-full sm:w-1/2 font-bold text-base opacity-0 fade-in" style={{animationDelay: '0.5s'}}>
              {currentRound < scenarios.length - 1 ? STRINGS.game.nextButton : STRINGS.game.finishButton}
            </Button>
          )
        )}
      </CardFooter>
    </Card>
  );
};

export default GameScreen;
