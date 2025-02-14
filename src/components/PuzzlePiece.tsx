// components/PuzzlePiece.tsx
import React from "react";
import { useDraggable } from "@dnd-kit/core";
import { motion } from "framer-motion";
import { PuzzlePiece as PuzzlePieceType } from "../types";


interface PuzzlePieceProps {
    piece: PuzzlePieceType | undefined;
    id: string;
    style?: React.CSSProperties;
}

const PuzzlePiece: React.FC<PuzzlePieceProps> = ({ piece, id, style }) => {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id,
    });

    const styleWithTransform = {
        ...style,
        transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
        backgroundImage: piece ? `url(${piece.imageData})` : undefined,
        backgroundSize: "cover",
        borderRadius: "8px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
        cursor: "grab",
        touchAction: "none",
        opacity: isDragging ? 0 : 1,
    };

    return (
        <motion.div
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            style={styleWithTransform}
            variants={{
                hidden: { scale: 0.5 },
                visible: { scale: 1 },
            }}

        />
    );
};

export default PuzzlePiece;
