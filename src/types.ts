export interface PuzzlePiece {
  id: number;
  imageData: string;
}

export interface BoardSlots {
  [slotId: string]: PuzzlePiece | undefined;
}

export interface ImageDetail {
  id: string;
  src: string;
  title: string;
  completed: boolean;
  message: string;
}
export interface Puzzle {
  completed: boolean;
  pool: Array<PuzzlePiece>;
  boardSlots: Record<string, PuzzlePiece | null>; // Definido más específicamente
  id: string;
  src: string;
  message: string;
  title: string;
}
