// components/Pool.tsx
import React from "react";
import { useDroppable } from "@dnd-kit/core";
import PuzzlePiece from "./PuzzlePiece";
import { PuzzlePiece as PuzzlePieceType } from "../types";
import { themeConfig } from "../data";
import { useStateContext } from "../context/StateContext";

const Pool: React.FC<{ pool: PuzzlePieceType[] | undefined }> = ({ pool }) => {
    const { setNodeRef } = useDroppable({ id: "pool" });
    const { theme } = useStateContext();

    return (
        <div className="pool-container" ref={setNodeRef}>
            <div className="piece-stack" style={{ border: `2px solid ${themeConfig[theme].color}` }}>
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
