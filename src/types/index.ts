// types/index.ts
export interface PuzzlePiece {
  id: number;
  imageData: string;
}

export interface BoardSlots {
  [slotId: string]: PuzzlePiece | undefined;
}
