import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { normalizeWord } from "@/lib/game";

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
