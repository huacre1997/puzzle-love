import { motion } from "framer-motion";
import { CheckCircleIcon, LockClosedIcon } from "@heroicons/react/24/solid";
import { puzzleSize } from "../data";
import { Puzzle } from "../types";
import React from "react";

const PuzzleItem: React.FC<{
    puzzle: Puzzle;
    onClick: (puzzle: Puzzle) => void;
}> = ({ puzzle, onClick }) => {
    const totalPieces = puzzleSize.find((size) => size.id === puzzle.id)?.total || "N/A";

    return (
        <div
            className="puzzle-container"
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
            }}
        >
            <motion.div
                className={`image-option ${puzzle.completed ? "completed" : ""}`}
                onClick={() => onClick(puzzle)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
            >
                <div className="image-thumbnail-wrapper">
                    <img
                        src={puzzle.src}
                        alt={puzzle.title}
                        className={`image-thumbnail ${puzzle.completed ? "image-completed" : ""}`}
                    />
                </div>
                <p>
                    {puzzle.title}{" "}
                    <span style={{ fontSize: "14px", color: "#777" }}>
                        ({totalPieces} piezas)
                    </span>
                </p>
            </motion.div>

            <div className="check-icon">
                {puzzle.completed ? (
                    <CheckCircleIcon className="text-green-500 size-6 check-completed" />
                ) : (
                    <motion.div
                        animate={{ rotate: [0, -10, 10, -10, 0] }}
                        transition={{
                            repeat: Infinity,
                            duration: 1.5,
                            ease: "easeInOut",
                        }}
                    >
                        <LockClosedIcon className="text-red-500 size-6" />
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default PuzzleItem;
