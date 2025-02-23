// components/Slot.tsx
import React from "react";
import { useDroppable } from "@dnd-kit/core";
import { PuzzlePiece } from "../types";
import { themeConfig } from "../data";
import { useStateContext } from "../context/StateContext";

const Slot: React.FC<{ id: string; children?: React.ReactNode, piece: PuzzlePiece | undefined }> = ({ id, children, piece }) => {
    const { setNodeRef } = useDroppable({ id });
    const { theme } = useStateContext();
    return (
        <div ref={setNodeRef} style={{
            border: piece?.correctSlot ? `2px dashed ${themeConfig[theme].color}` : "",
        }} className={`board-slot transition-colors duration-200 `}
            id={id}>
            {children}
        </div>
    );
};

export default Slot;
