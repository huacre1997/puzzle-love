// components/Pool.tsx
import React from "react";
import { useDroppable } from "@dnd-kit/core";
import PuzzlePiece from "./PuzzlePiece";
import { PuzzlePiece as PuzzlePieceType } from "../types";

const Pool: React.FC<{ pool: PuzzlePieceType[] | undefined }> = ({ pool }) => {
    const { setNodeRef } = useDroppable({ id: "pool" });

    return (
        <div className="pool-container" ref={setNodeRef}>
            <div className="piece-stack">
                {pool?.map((piece) => (
                    <PuzzlePiece
                        key={`pool-${piece.id}`}
                        piece={piece}
                        id={String(piece.id)}
                        style={{ width: "100px", height: "100px", margin: "5px" }}
                    />
                ))}
            </div>
        </div>
    );
};

export default Pool;
