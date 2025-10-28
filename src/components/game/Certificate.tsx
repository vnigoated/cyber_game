'use client';

import React from 'react';
import { STRINGS } from '@/lib/strings';
import { ShieldCheck } from 'lucide-react';

interface CertificateProps {
  username: string;
  certificationTitle: string;
  date: string;
}

const Certificate: React.FC<CertificateProps> = ({ username, certificationTitle, date }) => {
  return (
    <div
      style={{
        width: '800px',
        height: '600px',
        fontFamily: 'sans-serif',
      }}
      className="bg-background text-foreground border-4 border-primary p-8 flex flex-col items-center justify-center text-center"
    >
      <div className="border-2 border-accent w-full h-full p-6 flex flex-col items-center justify-center">
        <h1 className="text-5xl font-bold text-primary text-glow mb-4">
          Certificate of Achievement
        </h1>
        <p className="text-xl text-muted-foreground mb-8">This certifies that</p>
        <h2 className="text-4xl font-headline font-bold text-accent text-glow-accent mb-8">
          {username}
        </h2>
        <p className="text-xl text-muted-foreground mb-4">
          has successfully completed the {STRINGS.appSubtitle} and achieved the rank of
        </p>
        <div className="flex items-center gap-4 mb-8">
          <ShieldCheck className="w-16 h-16 text-primary" />
          <h3 className="text-3xl font-bold text-primary">{certificationTitle}</h3>
        </div>
        <p className="text-lg text-muted-foreground">Awarded on: {date}</p>
      </div>
    </div>
  );
};

export default Certificate;
