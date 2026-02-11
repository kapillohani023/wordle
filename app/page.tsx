import { auth, signOut } from "@/app/auth";
import { RootContent } from "@/components/RootContent";
import { createGame, getUncompletedGameForUser, getUserGameStats, isAllowedGuess, updateGame } from "@/lib/data";
import { appendSubmittedAttempt, GameView, isValidAttempt, MAX_ATTEMPTS, normalizeAttempt, normalizeWord } from "@/lib/game";
import { SubmitAttemptResult } from "@/lib/types";
import { redirect } from "next/navigation";

function toGameView(game: { id: string; guesses: string[]; isCompleted: boolean; answer: { word: string } }): GameView {
  return {
    id: game.id,
    guesses: game.guesses.map((guess) => normalizeWord(guess)),
    isCompleted: game.isCompleted,
    answer: normalizeWord(game.answer.word),
  };
}

export default async function Home() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    redirect("/signin");
  }

  const activeGame = await getUncompletedGameForUser(userId);
  const game = activeGame ?? (await createGame({ userId }));
  const initialStats = await getUserGameStats(userId);

  async function submitAttemptAction(gameId: string, attempt: string): Promise<SubmitAttemptResult> {
    "use server";

    const liveSession = await auth();
    const liveUserId = liveSession?.user?.id;

    if (!liveUserId) {
      throw new Error("Not authenticated");
    }

    const existingGame = await getUncompletedGameForUser(liveUserId);
    const liveStats = await getUserGameStats(liveUserId);
    if (!existingGame || existingGame.id !== gameId) {
      return {
        game: toGameView(existingGame ?? game),
        stats: liveStats,
        accepted: false,
        statusMessage: "Game not found",
      };
    }

    if (!isValidAttempt(attempt)) {
      return {
        game: toGameView(existingGame),
        stats: liveStats,
        accepted: false,
        statusMessage: "Attempt must be exactly 5 letters",
      };
    }

    const submittedAttempts = existingGame.guesses;
    if (existingGame.isCompleted || submittedAttempts.length >= MAX_ATTEMPTS) {
      return {
        game: toGameView(existingGame),
        stats: liveStats,
        accepted: false,
      };
    }

    const normalized = normalizeAttempt(attempt);
    const allowed = await isAllowedGuess(normalized);

    if (!allowed) {
      return {
        game: toGameView(existingGame),
        stats: liveStats,
        accepted: false,
        statusMessage: "Word is not in the allowed list",
        shake: true,
      };
    }

    const updatedGuesses = appendSubmittedAttempt(existingGame.guesses, normalized);
    const isWin = normalized === normalizeWord(existingGame.answer.word);
    const isOutOfAttempts = submittedAttempts.length + 1 >= MAX_ATTEMPTS;

    const updatedGame = await updateGame({
      gameId: existingGame.id,
      guesses: updatedGuesses,
      attempts: updatedGuesses.length,
      isWon: isWin,
      isCompleted: isWin || isOutOfAttempts,
    });

    if (updatedGame.isCompleted) {
      const answerMessage = `${normalizeWord(updatedGame.answer.word)}`;
      try {
        const nextGame = await createGame({ userId: liveUserId });
        const updatedStats = await getUserGameStats(liveUserId);
        return {
          game: toGameView(nextGame),
          stats: updatedStats,
          accepted: true,
          statusMessage: `${answerMessage}`,
        };
      } catch (createError) {
        const updatedStats = await getUserGameStats(liveUserId);
        const createErrorMessage =
          createError instanceof Error ? createError.message : "Failed to create new game";
        return {
          game: toGameView(updatedGame),
          stats: updatedStats,
          accepted: true,
          statusMessage: `${answerMessage}. ${createErrorMessage}`,
        };
      }
    }

    const updatedStats = await getUserGameStats(liveUserId);

    return {
      game: toGameView(updatedGame),
      stats: updatedStats,
      accepted: true,
      statusMessage: "",
    };
  }

  async function signOutAction() {
    "use server";

    await signOut({ redirectTo: "/signin" });
  }

  return (
    <RootContent
      initialGame={toGameView(game)}
      initialStats={initialStats}
      submitAttemptAction={submitAttemptAction}
      signOutAction={signOutAction}
    />
  );
}
