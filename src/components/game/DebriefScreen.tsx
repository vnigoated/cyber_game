'use client';

import { useState, useEffect, FC, useMemo, useRef, useCallback } from 'react';
import type { Mistake, Certification } from '@/lib/types';
import { STRINGS } from '@/lib/strings';
import { getAIFeedback } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CHARACTERS } from '@/lib/characters';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '../ui/skeleton';
import { Shield, ShieldCheck, ShieldAlert, ShieldOff, CheckCircle, XCircle, AlertTriangle, Trophy, Download, BookOpen } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { toPng } from 'html-to-image';
import Certificate from './Certificate';

type DebriefScreenProps = {
  score: number;
  mistakes: Mistake[];
  onPlayAgain: () => void;
  playerName: string;
};

const badgeIcons: Record<string, FC<any>> = {
    ShieldOff,
    ShieldCheck,
    Shield,
    ShieldAlert,
}

const choiceIcons: Record<string, FC<any>> = {
    trust: CheckCircle,
    verify: AlertTriangle,
    report: ShieldAlert,
}

const CERTIFICATE_THRESHOLD = 120; // 10% of 1200 (12 scenarios * 100)

const DebriefScreen: FC<DebriefScreenProps> = ({ score, mistakes, onPlayAgain, playerName }) => {
  const [aiFeedback, setAiFeedback] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const certificateRef = useRef<HTMLDivElement>(null);

  const certification: Certification = useMemo(() => {
    const levels = [...STRINGS.certificationLevels].reverse();
    return levels.find(c => score >= c.minScore) || levels[levels.length -1];
  }, [score]);
  
  const CertificationBadge = badgeIcons[certification.badge as string] || Shield;
  const agent = CHARACTERS.agentNova;
  
  useEffect(() => {
    const fetchFeedback = async () => {
      setIsLoading(true);
      const summary = mistakes.length > 0
        ? `Player made ${mistakes.length} mistakes. Incorrectly handled: ${mistakes.map(m => m.scenario.attackType).join(', ')}.`
        : "Player made no mistakes.";
      
      try {
        const feedback = await getAIFeedback(summary);
        setAiFeedback(feedback.summary);
      } catch (error) {
        console.error("Error fetching AI feedback:", error);
        setAiFeedback("Could not load personalized feedback at this time. Great job on completing the challenge!");
      } finally {
        setIsLoading(false);
      }
    };
    fetchFeedback();
  }, [mistakes]);

  const handleDownloadCertificate = useCallback(() => {
    if (certificateRef.current === null) {
      return;
    }

    toPng(certificateRef.current, { cacheBust: true })
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = 'cyber-defenders-certificate.png';
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => {
        console.error('oops, something went wrong!', err);
      });
  }, [certificateRef]);

  const canReceiveCertificate = score >= CERTIFICATE_THRESHOLD;

  return (
    <div className="flex flex-col items-center justify-center">
      <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
        <div ref={certificateRef}>
          {canReceiveCertificate && (
             <Certificate 
                username={playerName} 
                certificationTitle={certification.title} 
                date={new Date().toLocaleDateString()} 
             />
          )}
        </div>
      </div>
      <Card className="w-full max-w-3xl bg-card/80 backdrop-blur-sm border-primary/20 shadow-lg shadow-primary/10 opacity-0 fade-in">
        <CardHeader className="text-center">
            <CardTitle className="font-headline text-3xl text-primary text-glow">{STRINGS.debrief.title}</CardTitle>
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <Avatar className="h-8 w-8">
                    <Image src={agent.avatar} alt={agent.name} width={32} height={32} data-ai-hint={agent.avatarHint} />
                    <AvatarFallback>{agent.name.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <span>{agent.name} - {agent.role}</span>
            </div>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-center">
                <Card className="p-4 bg-background/50">
                    <h3 className="font-headline text-lg text-muted-foreground">{STRINGS.debrief.scoreTitle}</h3>
                    <p className="text-5xl font-bold text-primary text-glow">{score}</p>
                </Card>
                <Card className="p-4 bg-background/50">
                    <h3 className="font-headline text-lg text-muted-foreground">{STRINGS.debrief.certificationTitle}</h3>
                    <div className="flex items-center justify-center gap-3 mt-2">
                        <CertificationBadge className="w-12 h-12 text-accent text-glow-accent" />
                        <p className="text-2xl font-bold text-accent">{certification.title}</p>
                    </div>
                </Card>
            </div>
            
            <Card className="p-4 bg-background/50">
                <h3 className="font-headline text-lg text-primary mb-2">{STRINGS.debrief.aiFeedbackTitle}</h3>
                {isLoading ? (
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                    </div>
                ) : (
                    <p className="text-muted-foreground italic">"{aiFeedback}"</p>
                )}
            </Card>

            <div>
                <h3 className="font-headline text-lg text-primary mb-2 text-center">{STRINGS.debrief.mistakesTitle}</h3>
                {mistakes.length === 0 ? (
                    <p className="text-center text-green-400">{STRINGS.debrief.noMistakes}</p>
                ) : (
                    <ScrollArea className="h-64">
                    <Accordion type="single" collapsible className="w-full">
                        {mistakes.map(({ scenario, choice }, index) => {
                            const MistakeIcon = choiceIcons[choice] || XCircle;
                            const CorrectIcon = choiceIcons[scenario.correctChoice] || CheckCircle;
                            return(
                            <AccordionItem value={`item-${index}`} key={index}>
                                <AccordionTrigger>
                                    <div className="flex items-center gap-2">
                                        <XCircle className="text-destructive h-5 w-5 flex-shrink-0"/>
                                        <span className="text-left">{scenario.title}</span>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="space-y-3">
                                    <p className="font-semibold">Attack Type: <Badge variant="secondary">{scenario.attackType}</Badge></p>
                                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-6">
                                        <p className="flex items-center gap-2">
                                            <strong>{STRINGS.debrief.yourChoice}:</strong>
                                            <Badge variant="destructive" className="capitalize"><MistakeIcon className="mr-1 h-3 w-3" />{choice}</Badge>
                                        </p>
                                        <p className="flex items-center gap-2">
                                            <strong>{STRINGS.debrief.correctChoice}:</strong>
                                            <Badge variant="outline" className="capitalize text-green-400 border-green-400"><CorrectIcon className="mr-1 h-3 w-3" />{scenario.correctChoice}</Badge>
                                        </p>
                                    </div>
                                    <p><strong>Pro Tip:</strong> {scenario.feedback.tip}</p>
                                </AccordionContent>
                            </AccordionItem>
                        )})}
                    </Accordion>
                    </ScrollArea>
                )}
            </div>

            <div className="text-center mt-6 flex flex-wrap justify-center items-center gap-4">
                <Button onClick={onPlayAgain} size="lg" className="font-bold text-lg">
                    {STRINGS.debrief.playAgainButton}
                </Button>
                 <Link href="/leaderboard" passHref>
                    <Button size="lg" variant="outline" className="font-bold text-lg">
                        <Trophy className="mr-2 h-5 w-5"/>
                        View Leaderboard
                    </Button>
                </Link>
                <Link href="/training-room" passHref>
                  <Button size="lg" variant="outline" className="font-bold text-lg">
                    <BookOpen className="mr-2 h-5 w-5" />
                    Training Room
                  </Button>
                </Link>
                {canReceiveCertificate && (
                  <Button onClick={handleDownloadCertificate} size="lg" variant="secondary" className="font-bold text-lg">
                    <Download className="mr-2 h-5 w-5"/>
                    Download Certificate
                  </Button>
                )}
            </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DebriefScreen;
