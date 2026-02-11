import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { normalizeWord } from "@/lib/game";
import { GameStats } from "@/lib/types";

export async function getUncompletedGameForUser(userId: string) {
  return prisma.game.findFirst({
    where: {
      userId,
      isCompleted: false,
    },
    include: {
      answer: true,
      user: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

type CreateGameInput = {
  userId: string;
};

export async function createGame({
  userId
}: CreateGameInput) {
  const where = {
    games: {
      none: {
        userId,
      },
    },
  } satisfies Prisma.AnswerWhereInput;

  const remainingAnswerCount = await prisma.answer.count({ where });

  if (remainingAnswerCount === 0) {
    throw new Error("No answers available to play");
  }

  const randomOffset = Math.floor(Math.random() * remainingAnswerCount);

  const newAnswer = await prisma.answer.findFirst({
    where,
    orderBy: {
      id: "asc",
    },
    skip: randomOffset,
  });

  if (!newAnswer) {
    throw new Error("No answers available to play");
  }

  return prisma.game.create({
    data: {
      userId,
      answerId: newAnswer.id,
      guesses: [],
      isCompleted: false,
    },
    include: {
      answer: true,
      user: true,
    },
  });
}

type UpdateGameInput = {
  gameId: string;
  guesses?: string[];
  attempts?: number;
  isWon?: boolean;
  isCompleted?: boolean;
};

export async function updateGame({ gameId, guesses, attempts, isWon, isCompleted }: UpdateGameInput) {
  const data: Prisma.GameUpdateInput = {};

  if (guesses !== undefined) {
    data.guesses = guesses;
  }

  if (attempts !== undefined) {
    data.attempts = attempts;
  }

  if (isWon !== undefined) {
    data.isWon = isWon;
  }

  if (isCompleted !== undefined) {
    data.isCompleted = isCompleted;
  }

  if (Object.keys(data).length === 0) {
    throw new Error("No fields provided to update");
  }

  return prisma.game.update({
    where: { id: gameId },
    data,
    include: {
      answer: true,
      user: true,
    },
  });
}

export async function isAllowedGuess(guess: string): Promise<boolean> {
  const normalizedGuess = normalizeWord(guess);
  const allowed = await prisma.allowedGuess.findUnique({
    where: { word: normalizedGuess },
    select: { word: true },
  });

  return Boolean(allowed);
}

export async function getUserGameStats(userId: string): Promise<GameStats> {
  const completedGames = await prisma.game.findMany({
    where: {
      userId,
      isCompleted: true,
    },
    select: {
      isWon: true,
      attempts: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  const played = completedGames.length;
  if (played === 0) {
    return {
      played: 0,
      winPercentage: 0,
      averageAttempts: 0,
      maxStreak: 0,
    };
  }

  let wins = 0;
  let currentStreak = 0;
  let maxStreak = 0;
  let totalWinningAttempts = 0;

  for (const game of completedGames) {
    if (game.isWon) {
      wins += 1;
      currentStreak += 1;
      totalWinningAttempts += game.attempts;
      if (currentStreak > maxStreak) {
        maxStreak = currentStreak;
      }
    } else {
      currentStreak = 0;
    }
  }

  return {
    played,
    winPercentage: Math.round((wins / played) * 100),
    averageAttempts: wins > 0 ? Number((totalWinningAttempts / wins).toFixed(1)) : 0,
    maxStreak,
  };
}
