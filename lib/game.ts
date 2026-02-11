export const WORD_LENGTH = 5;
export const MAX_ATTEMPTS = 6;

export type GameView = {
  id: string;
  guesses: string[];
  isCompleted: boolean;
  answer: string;
};

export function normalizeWord(value: string): string {
  return value.trim().toUpperCase();
}

export function normalizeAttempt(attempt: string): string {
  const normalizedAttempt = normalizeWord(attempt);
  if (normalizedAttempt.length !== WORD_LENGTH) {
    throw new Error("Attempt must be 5 letters");
  }

  return normalizedAttempt;
}

export function appendSubmittedAttempt(guesses: string[], attempt: string): string[] {
  return [...guesses, normalizeAttempt(attempt)];
}

export function isValidAttempt(input: string): boolean {
  return /^[a-zA-Z]{5}$/.test(input);
}

export type TileStatus = "empty" | "pending" | "correct" | "present" | "absent";

export function evaluateAttempt(attempt: string, answer: string): TileStatus[] {
  const guess = normalizeWord(attempt);
  const solution = normalizeWord(answer);
  const statuses: TileStatus[] = Array(WORD_LENGTH).fill("absent");
  const remaining = solution.split("");

  for (let i = 0; i < WORD_LENGTH; i += 1) {
    if (guess[i] === solution[i]) {
      statuses[i] = "correct";
      remaining[i] = "";
    }
  }

  for (let i = 0; i < WORD_LENGTH; i += 1) {
    if (statuses[i] === "correct") {
      continue;
    }

    const index = remaining.indexOf(guess[i]);
    if (index >= 0) {
      statuses[i] = "present";
      remaining[index] = "";
    } else {
      statuses[i] = "absent";
    }
  }

  return statuses;
}
