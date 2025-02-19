// usePuzzleInitialization.ts
import { useEffect } from "react";
import { Puzzle } from "../types";
import { generatePuzzlePieces } from "../utils/generatePuzzlePieces";

export const usePuzzleInitialization = (
  selectedPuzzle: Puzzle | null,
  setSelectedPuzzle: (puzzle: Puzzle) => void,
  updatePuzzles: (id: string, puzzle: Puzzle) => void,
  cols: number,
  rows: number
) => {
  useEffect(() => {
    if (!selectedPuzzle) return;

    const img = new Image();
    img.src = selectedPuzzle.src;
    img.onload = () => {
      const pieces = generatePuzzlePieces(img, cols, rows);
      const random_pieces = pieces.sort(() => Math.random() - 0.5);

      if (Object.keys(selectedPuzzle.boardSlots).length === 0) {
        const updatedPuzzle = { ...selectedPuzzle, pool: random_pieces };
        setSelectedPuzzle(updatedPuzzle);
        updatePuzzles(selectedPuzzle.id, updatedPuzzle);
      }
    };
    img.onerror = (error) => {
      console.error("Error al cargar la imagen:", error);
    };
  }, []);
};
