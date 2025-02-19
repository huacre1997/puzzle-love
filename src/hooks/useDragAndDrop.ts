// useDragAndDrop.ts
import { useState } from "react";
import { DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import { Puzzle, PuzzlePiece } from "../types";
import { useConfetti } from "./useConfetti";

export const useDragAndDrop = (
  selectedPuzzle: Puzzle | null,
  setSelectedPuzzle: (puzzle: Puzzle) => void,
  updatePuzzles: (id: string, puzzle: Puzzle) => void,
  total: number, // Total number of slots in the puzzle
  setAlert: (message: string) => void // Function to set alert messages
) => {
  const [activeId, setActiveId] = useState<number | null>(null);
  const { shoot } = useConfetti();

  /**
   * Finds the location of a puzzle piece (either in the pool or on the board).
   * @param pieceId - The ID of the puzzle piece.
   * @returns An object with the container ID (either "pool" or a slot ID).
   */
  const findPieceLocation = (pieceId: number) => {
    if (selectedPuzzle?.pool.find((p) => p.id === pieceId)) {
      return { container: "pool" };
    }
    for (let i = 0; i < total; i++) {
      const key = `slot-${i}`;
      if (selectedPuzzle?.boardSlots[key]?.id === pieceId) {
        return { container: key };
      }
    }
    return { container: "pool" };
  };

  /**
   * Handles the end of a drag event.
   * Updates the puzzle state when a piece is dropped into a slot.
   */
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return; // If there's no drop target, do nothing.

    const pieceId = Number(active.id);
    const dropTargetId = over.id as string;

    // If the piece is dropped outside the board or pool, do nothing.
    if (dropTargetId === "pool" || !dropTargetId.startsWith("slot-")) return;

    // Find the piece being moved.
    let movingPiece: PuzzlePiece | undefined;
    const location = findPieceLocation(pieceId);
    if (location.container === "pool") {
      movingPiece = selectedPuzzle?.pool.find((p) => p.id === pieceId);
    } else {
      movingPiece = selectedPuzzle?.boardSlots[location.container] ?? undefined;
    }

    if (!movingPiece) return;

    // Find the piece in the target slot (if any).
    const targetPiece = selectedPuzzle?.boardSlots[dropTargetId];
    const newBoardSlots = { ...selectedPuzzle!.boardSlots };

    if (targetPiece) {
      // Swap the pieces if the target slot is occupied.
      newBoardSlots[dropTargetId] = {
        ...movingPiece,
        correctSlot:
          movingPiece.id === parseInt(dropTargetId.replace("slot-", "")),
      };
      const originalSlotId = location.container;
      if (originalSlotId !== "pool") {
        newBoardSlots[originalSlotId] = {
          ...targetPiece,
          correctSlot:
            targetPiece.id === parseInt(originalSlotId.replace("slot-", "")),
        };
      }
    } else {
      // Move the piece to the target slot if it's empty.
      newBoardSlots[dropTargetId] = {
        ...movingPiece,
        correctSlot:
          movingPiece.id === parseInt(dropTargetId.replace("slot-", "")),
      };
    }

    // Clear the original slot if the piece was moved from the board.
    if (
      location.container !== "pool" &&
      location.container !== dropTargetId &&
      newBoardSlots[location.container]?.id === newBoardSlots[dropTargetId].id
    ) {
      newBoardSlots[location.container] = null;
    }

    // Update the pool if the piece was moved from or to it.
    let updatedPool = selectedPuzzle!.pool.filter((p) => p.id !== pieceId);
    if (location.container === "pool" && targetPiece) {
      updatedPool = [...updatedPool, targetPiece];
    }

    // Update the global puzzle state.
    if (selectedPuzzle) {
      const updatedPuzzle: Puzzle = {
        ...selectedPuzzle,
        boardSlots: newBoardSlots,
        pool: updatedPool,
      };
      setSelectedPuzzle(updatedPuzzle);
      updatePuzzles(selectedPuzzle.id, updatedPuzzle);
    }

    // Check if the piece was placed in the correct slot.
    const slotElement = document.getElementById(dropTargetId);
    if (slotElement) {
      const rect = slotElement.getBoundingClientRect();
      const originX = rect.left + rect.width * 0.5;
      const originY = rect.top + rect.height * 0.5;
      const over_id = dropTargetId.replace("slot-", "");
      if (Number(over_id) === Number(pieceId)) {
        const randomMessages = [
          "¡Cada paso que das me hace amarte más! 💖",
          "¡Lo lograste, mi amor, y yo siempre estaré aquí para celebrarlo contigo! 🎉❤️",
          "¡Eres increíble, como un sueño del que nunca quiero despertar! 😍✨",
          "¡Sigue brillando, mi corazón late más fuerte por cada logro tuyo! 💓🌟",
          "¡Tu esfuerzo me inspira, sigamos construyendo nuestro futuro juntos! 🏡💑",
          "¡Eres imparable, y yo soy tu fan número uno! 🏆🥰",
          "¡Cada meta que alcanzas hace que nuestro amor brille aún más! 💕🌟",
          "¡Tú y tus logros son mi mayor orgullo! 💖👏",
          "¡Cada victoria tuya es un beso en mi corazón! 😘💞",
          "¡Nada me hace más feliz que verte triunfar, mi amor! 🎊💘",
          "¡Tú conquistas todo, incluido mi corazón! 💘🏆",
          "¡Sigue adelante, amor mío, juntos llegaremos lejos! 🚀❤️",
          "¡Tu determinación me enamora cada día más! 💪💖",
        ];
        const randomMessage =
          randomMessages[Math.floor(Math.random() * randomMessages.length)];
        setAlert(randomMessage);
        shoot(originX, originY);
      }
    }

    setActiveId(null); // Reset the active ID.
  };

  /**
   * Handles the start of a drag event.
   * Sets the active ID of the piece being dragged.
   */
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    if (!active) return;

    const pieceId = Number(active.id);
    setActiveId(pieceId);
  };

  return { activeId, handleDragEnd, handleDragStart };
};
