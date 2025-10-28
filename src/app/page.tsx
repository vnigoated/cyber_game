'use client';

import { useState, useEffect, useCallback } from 'react';
import type { GameState, Scenario, Mistake } from '@/lib/types';
import { SCENARIOS } from '@/lib/scenarios';
import IntroScreen from '@/components/game/IntroScreen';
import GameScreen from '@/components/game/GameScreen';
import DebriefScreen from '@/components/game/DebriefScreen';
import MatrixBackground from '@/components/game/MatrixBackground';
import { useAuth, useUser, useFirestore, addDocumentNonBlocking } from '@/firebase';
import { initiateAnonymousSignIn } from '@/firebase';
import { collection } from 'firebase/firestore';


// Function to shuffle an array
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export default function Home() {
  const [gameState, setGameState] = useState<GameState>('intro');
  const [score, setScore] = useState(0);
  const [mistakes, setMistakes] = useState<Mistake[]>([]);
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [gameKey, setGameKey] = useState(0);
  const [playerName, setPlayerName] = useState('Anonymous Agent');

  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();

  useEffect(() => {
    if (auth && !isUserLoading && !user) {
      initiateAnonymousSignIn(auth);
    }
  }, [isUserLoading, user, auth]);

  const startGame = useCallback((name: string) => {
    setScenarios(shuffleArray(SCENARIOS));
    setScore(0);
    setMistakes([]);
    setPlayerName(name);
    setGameState('playing');
    setGameKey(prevKey => prevKey + 1);
  }, []);

  const finishGame = useCallback(() => {
    if (user && firestore) {
      const leaderboardRef = collection(firestore, 'leaderboard_entries');
      addDocumentNonBlocking(leaderboardRef, {
        userProfileId: user.uid,
        username: user.isAnonymous ? playerName : user.displayName || playerName,
        score: score,
        timestamp: new Date(),
      });
    }
    setGameState('debrief');
  }, [user, firestore, score, playerName]);

  const updateScore = useCallback((points: number) => {
    setScore(prev => prev + points);
  }, []);

  const addMistake = useCallback((scenario: Scenario, choice: string) => {
    setMistakes(prev => [...prev, { scenario, choice }]);
  }, []);

  const renderGameState = () => {
    if (isUserLoading) {
      return <div className="text-center text-primary">Initializing Challenge...</div>;
    }
    switch (gameState) {
      case 'intro':
        return <IntroScreen onStart={startGame} />;
      case 'playing':
        return (
          <GameScreen
            key={gameKey}
            scenarios={scenarios}
            onFinish={finishGame}
            updateScore={updateScore}
            addMistake={addMistake}
          />
        );
      case 'debrief':
        return <DebriefScreen score={score} mistakes={mistakes} onPlayAgain={() => setGameState('intro')} playerName={playerName} />;
      default:
        return <IntroScreen onStart={startGame} />;
    }
  };

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden p-4 sm:p-6 md:p-8">
      <MatrixBackground />
      <div className="z-10 w-full max-w-4xl">{renderGameState()}</div>
    </main>
  );
}
