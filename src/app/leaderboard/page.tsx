'use client';

import { useCollection, useMemoFirebase } from '@/firebase';
import { useFirestore } from '@/firebase';
import { collection, query, orderBy, limit } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import MatrixBackground from '@/components/game/MatrixBackground';
import { Trophy, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

type LeaderboardEntry = {
  id: string;
  username: string;
  score: number;
  timestamp: {
    seconds: number;
    nanoseconds: number;
  };
};

const LeaderboardPage = () => {
  const firestore = useFirestore();

  const leaderboardQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'leaderboard_entries'), orderBy('score', 'desc'), limit(20));
  }, [firestore]);

  const { data: leaderboardData, isLoading } = useCollection<LeaderboardEntry>(leaderboardQuery);

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden p-4 sm:p-6 md:p-8">
      <MatrixBackground />
      <div className="z-10 w-full max-w-4xl">
        <Card className="w-full max-w-3xl mx-auto bg-card/80 backdrop-blur-sm border-primary/20 shadow-lg shadow-primary/10 opacity-0 fade-in">
          <CardHeader className="text-center">
            <div className="relative">
              <Link href="/" passHref className="absolute left-0 top-1/2 -translate-y-1/2">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-6 w-6 text-primary" />
                </Button>
              </Link>
              <CardTitle className="font-headline text-3xl text-primary text-glow flex items-center justify-center gap-3">
                <Trophy className="h-8 w-8 text-accent text-glow-accent" />
                Global Leaderboard
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px] text-center font-headline text-primary">Rank</TableHead>
                  <TableHead className="font-headline text-primary">Agent</TableHead>
                  <TableHead className="text-right font-headline text-primary">Score</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading && Array.from({ length: 10 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell className="text-center"><Skeleton className="h-6 w-6 rounded-full mx-auto" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-3/4" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-5 w-1/4 ml-auto" /></TableCell>
                  </TableRow>
                ))}
                {leaderboardData && leaderboardData.map((entry, index) => (
                  <TableRow key={entry.id} className="font-medium">
                    <TableCell className="text-center text-xl font-bold text-muted-foreground">
                      {index + 1}
                    </TableCell>
                    <TableCell className="text-lg">{entry.username}</TableCell>
                    <TableCell className="text-right text-lg text-primary font-bold">{entry.score}</TableCell>
                  </TableRow>
                ))}
                {!isLoading && (!leaderboardData || leaderboardData.length === 0) && (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-muted-foreground">
                      No scores recorded yet. Be the first!
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default LeaderboardPage;
