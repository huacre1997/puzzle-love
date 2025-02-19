// components/Slot.tsx
import React from "react";
import { useDroppable } from "@dnd-kit/core";
import { PuzzlePiece } from "../types";

const Slot: React.FC<{ id: string; children?: React.ReactNode, piece: PuzzlePiece | undefined }> = ({ id, children, piece }) => {
    const { setNodeRef } = useDroppable({ id });
    return (
        <div ref={setNodeRef} className={`board-slot transition-colors duration-200 ${piece?.correctSlot ? "active" : ""}`}
            id={id}>
            {children}
        </div>
    );
};

export default Slot;
