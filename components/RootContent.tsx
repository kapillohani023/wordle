"use client";

import { useEffect, useState, useTransition } from "react";
import { GameBoard } from "@/components/game/GameBoard";
import { GameView } from "@/lib/game";
import { GameStats, SubmitAttemptResult } from "@/lib/types";

type RootContentProps = {
  initialGame: GameView;
  initialStats: GameStats;
  submitAttemptAction: (gameId: string, attempt: string) => Promise<SubmitAttemptResult>;
};

export function RootContent({ initialGame, initialStats, submitAttemptAction }: RootContentProps) {
  const [currentGame, setCurrentGame] = useState<GameView>(initialGame);
  const [currentStats, setCurrentStats] = useState<GameStats>(initialStats);
  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);
  const [shakeSignal, setShakeSignal] = useState(0);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!snackbarMessage) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setSnackbarMessage(null);
    }, 3000);

    return () => window.clearTimeout(timeoutId);
  }, [snackbarMessage]);

  async function onSubmitAttempt(attempt: string): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      startTransition(async () => {
        try {
          const wasCompleted = currentGame.isCompleted;
          const result = await submitAttemptAction(currentGame.id, attempt);
          setCurrentGame(result.game);
          setCurrentStats(result.stats);
          if (result.statusMessage) {
            setSnackbarMessage(result.statusMessage);
          } else if (!wasCompleted && result.game.isCompleted) {
            setSnackbarMessage(`${result.game.answer}`);
          }
          if (result.shake) {
            setShakeSignal((prev) => prev + 1);
          }
          resolve(result.accepted);
        } catch (submitError) {
          const message =
            submitError instanceof Error ? submitError.message : "Failed to submit attempt";
          setSnackbarMessage(message);
          resolve(false);
        }
      });
    });
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col px-4 py-8 sm:px-6">
      {snackbarMessage ? (
        <div className="pointer-events-none fixed inset-x-0 top-4 z-50 flex justify-center">
          <p className="rounded-md border border-white/60 bg-black/80 px-4 py-2 text-sm font-medium text-white shadow-lg">
            {snackbarMessage}
          </p>
        </div>
      ) : null}
      <div className="flex flex-1 flex-col">
        <section className="mx-auto mb-6 w-full max-w-sm rounded-md font-bold border-gray-300 bg-gray-400 text-whitepx-4 py-3 shadow-lg">
          <div className="grid grid-cols-4 gap-2 text-center">
            <div>
              <p className="text-4xl leading-none text-white">{currentStats.played}</p>
              <p className="mt-1 text-sm text-white">Played</p>
            </div>
            <div>
              <p className="text-4xl leading-none text-white">{currentStats.winPercentage}</p>
              <p className="mt-1 text-sm text-white">Win %</p>
            </div>
            <div>
              <p className="text-4xl leading-none text-white">{currentStats.averageAttempts}</p>
              <p className="mt-1 text-sm text-white">Avg.</p>
            </div>
            <div>
              <p className="text-4xl leading-none text-white">{currentStats.maxStreak}</p>
              <p className="mt-1 text-sm text-white">Max Streak</p>
            </div>
          </div>
        </section>
        <GameBoard
          game={currentGame}
          isSubmitting={isPending}
          shakeSignal={shakeSignal}
          onSubmitAttempt={onSubmitAttempt}
        />
      </div>
    </main>
  );
}
