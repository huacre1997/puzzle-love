import { motion } from "framer-motion";
import { LockClosedIcon } from "@heroicons/react/24/solid";
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
                position: "relative",
            }}
        >
            <motion.div
                className={`image-option ${puzzle.completed ? "completed" : ""}`}
                onClick={() => onClick(puzzle)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                style={{ position: "relative" }}
            >
                <div className="image-thumbnail-wrapper" style={{ position: "relative" }}>
                    <img
                        src={puzzle.src}
                        alt={puzzle.title}
                        className={`image-thumbnail ${puzzle.completed ? "image-completed" : ""}`}
                    />
                    <div
                        className="check-icon"
                        style={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            zIndex: 2,
                        }}
                    >
                        {puzzle.completed ? (
                            <></>
                        ) : (
                            <motion.div
                                animate={{ rotate: [0, -10, 10, -10, 0] }}
                                transition={{
                                    repeat: Infinity,
                                    duration: 1.5,
                                    ease: "easeInOut",
                                }}
                            >
                                <LockClosedIcon className="text-red-500 size-10" />
                            </motion.div>
                        )}
                    </div>
                </div>
                <p>
                    {puzzle.title}{" "}
                    <span style={{ fontSize: "14px", color: "#777" }}>
                        ({totalPieces} piezas)
                    </span>
                </p>
            </motion.div>
        </div>
    );
};

export default PuzzleItem;
