'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import MatrixBackground from '@/components/game/MatrixBackground';
import { TRAINING_MATERIALS } from '@/lib/training-materials';
import { ArrowLeft, Lightbulb } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const TrainingRoomPage = () => {
  return (
    <main className="relative flex min-h-screen flex-col items-center overflow-hidden p-4 sm:p-6 md:p-8">
      <MatrixBackground />
      <div className="z-10 w-full max-w-4xl py-8">
        <Card className="w-full bg-card/80 backdrop-blur-sm border-primary/20 shadow-lg shadow-primary/10 opacity-0 fade-in">
          <CardHeader>
            <div className="relative text-center">
              <Link href="/" passHref className="absolute left-0 top-1/2 -translate-y-1/2">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-6 w-6 text-primary" />
                </Button>
              </Link>
              <CardTitle className="font-headline text-3xl text-primary text-glow">
                Training Room
              </CardTitle>
              <CardDescription>
                Study social engineering tactics to sharpen your defense skills.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full space-y-4">
              {TRAINING_MATERIALS.map((material) => (
                <AccordionItem value={material.id} key={material.id} className="bg-background/50 rounded-lg border px-4">
                  <AccordionTrigger className="text-lg font-headline text-accent hover:no-underline">
                    {material.title}
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-2">
                    <p className="text-muted-foreground">{material.description}</p>
                    <div>
                      <h4 className="font-semibold mb-2">Example Scenario:</h4>
                      <div className="p-3 rounded-md border border-dashed border-border text-sm italic">
                        <p>"{material.example}"</p>
                      </div>
                    </div>
                     <div>
                        <h4 className="font-semibold mb-2 flex items-center gap-2 text-primary">
                            <Lightbulb className="h-5 w-5"/>
                            Pro-Tip
                        </h4>
                        <p className="text-muted-foreground">{material.tip}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Key Identifiers:</h4>
                      <div className="flex flex-wrap gap-2">
                        {material.identifiers.map((tag, index) => (
                           <Badge key={index} variant="secondary">{tag}</Badge>
                        ))}
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default TrainingRoomPage;
