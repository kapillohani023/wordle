"use client";

import { TileStatus } from "@/lib/game";

type TileProps = {
  letter: string;
  status: TileStatus;
  readOnly?: boolean;
};

const colorByStatus: Record<TileStatus, string> = {
  empty: "border-gray-300 bg-white text-gray-900",
  pending: "border-gray-400 bg-white text-gray-900",
  correct: "border-green-500 bg-green-500 text-white",
  present: "border-yellow-500 bg-yellow-500 text-white",
  absent: "border-gray-500 bg-gray-500 text-white",
};

export function Tile({ letter, status, readOnly = false }: TileProps) {
  return (
    <div
      aria-readonly={readOnly}
      className={`flex h-14 w-14 items-center justify-center border-2 text-2xl font-bold uppercase transition-colors ${colorByStatus[status]}`}
    >
      {letter}
    </div>
  );
}
