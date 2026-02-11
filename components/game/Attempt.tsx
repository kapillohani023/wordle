"use client";

import { evaluateAttempt, TileStatus, WORD_LENGTH } from "@/lib/game";
import { Tile } from "@/components/game/Tile";

type AttemptProps = {
  guess: string;
  answer: string;
  submitted: boolean;
  shake?: boolean;
};

export function Attempt({ guess, answer, submitted, shake = false }: AttemptProps) {
  const normalized = guess.slice(0, WORD_LENGTH);
  const letters = normalized.padEnd(WORD_LENGTH, " ").split("");
  const statuses: TileStatus[] = submitted
    ? evaluateAttempt(normalized, answer)
    : letters.map((letter) => (letter.trim() ? "pending" : "empty"));

  return (
    <div className={`flex justify-center gap-2 ${shake ? "animate-shake" : ""}`}>
      {letters.map((letter, index) => (
        <Tile
          key={`${index}-${letter}`}
          letter={letter.trim()}
          status={statuses[index]}
          readOnly={submitted}
        />
      ))}
    </div>
  );
}
