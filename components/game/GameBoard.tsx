"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Attempt } from "@/components/game/Attempt";
import { evaluateAttempt, GameView, MAX_ATTEMPTS, TileStatus, WORD_LENGTH } from "@/lib/game";

type GameBoardProps = {
  game: GameView;
  isSubmitting: boolean;
  shakeSignal: number;
  onSubmitAttempt: (attempt: string) => Promise<boolean>;
};

const keyboardRows = ["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"];

const keyClassByStatus: Record<TileStatus | "unused", string> = {
  unused: "border-gray-300 bg-gray-400 text-white",
  empty: "border-gray-300 bg-gray-400 text-white",
  pending: "border-gray-300 bg-gray-400 text-white",
  correct: "border-green-500 bg-green-500 text-white",
  present: "border-yellow-500 bg-yellow-500 text-white",
  absent: "border-gray-500 bg-gray-700 text-white",
};

const statusPriority: Record<TileStatus, number> = {
  empty: 0,
  pending: 0,
  absent: 1,
  present: 2,
  correct: 3,
};

export function GameBoard({ game, isSubmitting, shakeSignal, onSubmitAttempt }: GameBoardProps) {
  const [input, setInput] = useState("");
  const submittedAttempts = useMemo(() => game.guesses, [game.guesses]);
  const activeRow = submittedAttempts.length;
  const letterStatuses = useMemo(() => {
    const statuses: Record<string, TileStatus> = {};

    for (const guess of submittedAttempts) {
      const result = evaluateAttempt(guess, game.answer);
      for (let i = 0; i < WORD_LENGTH; i += 1) {
        const letter = guess[i];
        const nextStatus = result[i];
        const currentStatus = statuses[letter];
        if (!currentStatus || statusPriority[nextStatus] > statusPriority[currentStatus]) {
          statuses[letter] = nextStatus;
        }
      }
    }

    return statuses;
  }, [submittedAttempts, game.answer]);

  function getKeyClass(letter: string): string {
    const status = letterStatuses[letter] ?? "unused";
    return keyClassByStatus[status];
  }

  const handleKeyInput = useCallback((key: string) => {
    if (game.isCompleted || isSubmitting) {
      return;
    }

    if (key === "BACKSPACE") {
      setInput((current) => current.slice(0, -1));
      return;
    }

    if (key === "ENTER") {
      if (input.length === WORD_LENGTH) {
        void (async () => {
          const accepted = await onSubmitAttempt(input);
          if (accepted) {
            setInput("");
          }
        })();
      }
      return;
    }

    if (/^[A-Z]$/.test(key)) {
      setInput((current) => {
        if (current.length >= WORD_LENGTH) {
          return current;
        }
        return `${current}${key}`;
      });
    }
  }, [game.isCompleted, input, isSubmitting, onSubmitAttempt]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (game.isCompleted || isSubmitting) {
        return;
      }

      const key = event.key;

      if (key === "Backspace") {
        event.preventDefault();
        handleKeyInput("BACKSPACE");
        return;
      }

      if (key === "Enter") {
        event.preventDefault();
        handleKeyInput("ENTER");
        return;
      }

      if (/^[a-zA-Z]$/.test(key)) {
        event.preventDefault();
        handleKeyInput(key.toUpperCase());
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [game.isCompleted, isSubmitting, handleKeyInput]);

  return (
    <section className="mx-auto flex h-full min-h-0 w-full flex-col">
      <div className="flex flex-1 flex-col justify-center space-y-2">
        {Array.from({ length: MAX_ATTEMPTS }).map((_, rowIndex) => {
          const submitted = rowIndex < submittedAttempts.length;
          const guess = submitted ? submittedAttempts[rowIndex] : rowIndex === activeRow ? input : "";
          return (
            <Attempt
              key={`attempt-${rowIndex}-${rowIndex === activeRow ? shakeSignal : 0}`}
              guess={guess}
              answer={game.answer}
              submitted={submitted}
              shake={rowIndex === activeRow && shakeSignal > 0}
            />
          );
        })}
      </div>

      <div className="space-y-2 p-1">
        {keyboardRows.slice(0, 2).map((row) => (
          <div key={row} className="flex justify-center gap-1 sm:gap-1.5">
            {row.split("").map((letter) => (
              <button
                key={letter}
                type="button"
                onClick={() => handleKeyInput(letter)}
                className={`h-10 w-7 rounded border px-1 text-base font-bold transition-colors sm:h-12 sm:w-9 sm:px-2 sm:text-lg ${getKeyClass(letter)}`}
              >
                {letter}
              </button>
            ))}
          </div>
        ))}

        <div className="flex justify-center gap-1 sm:gap-1.5">
          <button
            type="button"
            onClick={() => handleKeyInput("ENTER")}
            className="h-10 rounded border border-gray-300 bg-gray-400 px-2 text-xs font-semibold text-white transition-colors hover:bg-gray-500 sm:h-12 sm:px-3 sm:text-sm"
          >
            ENTER
          </button>
          {keyboardRows[2].split("").map((letter) => (
            <button
              key={letter}
              type="button"
              onClick={() => handleKeyInput(letter)}
              className={`h-10 w-10 rounded border px-1 text-base font-bold transition-colors sm:h-12 sm:w-9 sm:px-2 sm:text-lg ${getKeyClass(letter)}`}
            >
              {letter}
            </button>
          ))}
          <button
            type="button"
            onClick={() => handleKeyInput("BACKSPACE")}
            className="h-10 rounded border border-gray-300 bg-gray-400 px-2 text-xs font-semibold text-white transition-colors hover:bg-gray-500 sm:h-12 sm:px-3 sm:text-sm"
          >
            BACK
          </button>
        </div>
      </div>
    </section>
  );
}
