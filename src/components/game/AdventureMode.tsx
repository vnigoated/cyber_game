'use client';

import { useState, useCallback } from 'react';
import type { Scenario } from '@/lib/types';
import AdventureScene from '@/components/3d/AdventureScene';
import GameScreen from '@/components/game/GameScreen';
import { Button } from '@/components/ui/button'; // Assuming we might need a pause/close btn?

type AdventureModeProps = {
    scenarios: Scenario[];
    onFinish: () => void;
    updateScore: (points: number) => void;
    addMistake: (scenario: Scenario, choice: string) => void;
};

const AdventureMode = ({ scenarios, onFinish, updateScore, addMistake }: AdventureModeProps) => {
    // We track which scenarios are done
    const [completedIds, setCompletedIds] = useState<number[]>([]);

    // The scenario strictly currently active (overlay open)
    const [activeScenarioId, setActiveScenarioId] = useState<number | null>(null);

    const handleScenarioTrigger = useCallback((id: number) => {
        // Only trigger if not already completed and not currently open
        // Note: GameScreen logic might need adjustment if we re-open?
        if (!completedIds.includes(id) && activeScenarioId === null) {
            setActiveScenarioId(id);
        }
    }, [completedIds, activeScenarioId]);

    const handleScenarioComplete = useCallback(() => {
        if (activeScenarioId !== null) {
            setCompletedIds(prev => [...prev, activeScenarioId]);
            setActiveScenarioId(null);

            // Check verification: Are all scenarios done?
            // We'll calculate progress. If strict "linear" is not enforced, we check count.
            if (completedIds.length + 1 >= scenarios.length) {
                onFinish();
            }
        }
    }, [activeScenarioId, completedIds, scenarios.length, onFinish]);

    // We need to "mock" a single-scenario list for the GameScreen 
    // because GameScreen expects a full list and handles its own indexing.
    // We will trick it by giving it just the ONE active scenario.
    // But GameScreen manages its own state... we might need to reset it.
    const activeScenario = scenarios.find(s => s.id === activeScenarioId);

    return (
        <div className="relative w-full h-full">
            {/* 3D World Layer */}
            <AdventureScene
                scenarios={scenarios}
                completedScenarioIds={completedIds}
                onScenarioTrigger={handleScenarioTrigger}
            />

            {/* 2D Overlay Layer (Only when active) */}
            {activeScenario && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                        {/* 
                  Reusing GameScreen. 
                  Note: GameScreen internally handles "currentRound".
                  If we pass an array of length 1, it will handle that one scenario 
                  and call onFinish when done.
                */}
                        <GameScreen
                            key={activeScenario.id} // Force remount to reset state
                            scenarios={[activeScenario]}
                            onFinish={handleScenarioComplete}
                            updateScore={updateScore}
                            addMistake={addMistake}
                        />

                        <div className="absolute top-4 right-4">
                            <Button
                                variant="ghost"
                                onClick={() => setActiveScenarioId(null)}
                                className="text-muted-foreground hover:text-white"
                            >
                                [ CLOSE ]
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Mini-map / Progress Counter HUD */}
            <div className="absolute bottom-6 right-6 p-4 rounded-lg border border-primary/20 bg-black/80 backdrop-blur text-primary font-mono text-sm pointer-events-none select-none">
                NODES SECURED: {completedIds.length} / {scenarios.length}
            </div>
        </div>
    );
};

export default AdventureMode;
