import { GameView } from "@/lib/game";

export type SubmitAttemptResult = {
  game: GameView;
  accepted: boolean;
  statusMessage?: string;
  shake?: boolean;
};
