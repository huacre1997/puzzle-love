import { motion } from "framer-motion";
import { CheckCircleIcon } from "@heroicons/react/16/solid";
import { puzzleSize } from "../data";
import { Puzzle } from "../types";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import React from "react";

// Componente reutilizable para cada Puzzle
const PuzzleItem: React.FC<{ puzzle: Puzzle; onClick: (puzzle: Puzzle) => void }> = ({ puzzle, onClick }) => {
    const totalPieces = puzzleSize.find((size) => size.id === puzzle.id)?.total || 'N/A';

    return (
        <div className="puzzle-container" style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
            <motion.div
                className={`image-option ${puzzle.completed ? "completed" : ""}`}
                onClick={() => onClick(puzzle)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
            >
                <div className="image-thumbnail-wrapper">
                    <img src={puzzle.src} alt={puzzle.title} className={`image-thumbnail ${puzzle.completed ? "image-completed" : ""}`} />
                </div>
                <p>{puzzle.title} <span style={{ fontSize: '14px', color: '#777' }}> ({totalPieces} piezas)</span></p>
            </motion.div>
            <div className="check-icon">
                <CheckCircleIcon className={`text-green-500 size-6 ${puzzle.completed ? "check-completed" : ""}`} fontSize={1.4} />
            </div>

        </div>
    );
};
export default PuzzleItem;