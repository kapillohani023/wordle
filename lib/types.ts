import { GameView } from "@/lib/game";

export type GameStats = {
  played: number;
  winPercentage: number;
  averageAttempts: number;
  maxStreak: number;
};

export type SubmitAttemptResult = {
  game: GameView;
  stats: GameStats;
  accepted: boolean;
  statusMessage?: string;
  shake?: boolean;
};
