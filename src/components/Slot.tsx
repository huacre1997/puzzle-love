// components/Slot.tsx
import React from "react";
import { useDroppable } from "@dnd-kit/core";

const Slot: React.FC<{ id: string; children?: React.ReactNode }> = ({ id, children }) => {
    const { setNodeRef } = useDroppable({ id });
    return (
        <div ref={setNodeRef} className="board-slot" id={id}>
            {children}
        </div>
    );
};

export default Slot;
