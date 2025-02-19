// PuzzleGrid.tsx
import React from "react";
import { motion } from "framer-motion";
import Slot from "./Slot";
import PuzzlePiece from "./PuzzlePiece";
import { Puzzle } from "../types";

interface PuzzleGridProps {
    cols: number;
    rows: number;
    selectedPuzzle: Puzzle | null;
}

const PuzzleGrid: React.FC<PuzzleGridProps> = ({ cols, rows, selectedPuzzle }) => {
    return (
        <div className="board-grid" style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, gridTemplateRows: `repeat(${rows}, 1fr)` }}>
            {Array.from({ length: cols * rows }, (_, i) => {
                const slotId: string = `slot-${i}`;
                return (
                    <motion.div key={slotId} initial="hidden" animate="visible" transition={{ duration: 0.5, delay: i * 0.02 }} variants={{ hidden: { opacity: 0, scale: 0.5 }, visible: { opacity: 1, scale: 1 } }}>
                        <Slot id={slotId} piece={selectedPuzzle?.boardSlots?.[slotId] ?? undefined}>
                            {selectedPuzzle?.boardSlots?.[slotId] && (
                                <PuzzlePiece key={selectedPuzzle.boardSlots[slotId]!.id} piece={selectedPuzzle.boardSlots[slotId]!} id={String(selectedPuzzle.boardSlots[slotId]!.id)} style={{ width: "100%", height: "100%" }} />
                            )}
                        </Slot>
                    </motion.div>
                );
            })}
        </div>
    );
};

export default PuzzleGrid;