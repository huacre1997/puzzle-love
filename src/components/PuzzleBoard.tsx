import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { DndContext, DragEndEvent, DragStartEvent, rectIntersection, DragOverlay } from "@dnd-kit/core";
import { motion, AnimatePresence } from "framer-motion";
import { generatePuzzlePieces } from "../utils/generatePuzzlePieces";
import PuzzlePiece from "./PuzzlePiece";
import Slot from "./Slot";
import Pool from "./Pool";
import { PuzzlePiece as PuzzlePieceType, BoardSlots } from "../types";
import { useMediaQuery } from "usehooks-ts";




const launchConfetti = () => {
    const colors = ["#FF69B4", "#FFC0CB", "#FF1493", "#ffffff"]; // Colores románticos

    (function frame() {
        confetti({
            particleCount: 2,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: colors,
        });

        confetti({
            particleCount: 2,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: colors,
        });

        // Elimina esta línea para que el confeti no se detenga
        requestAnimationFrame(frame);
    })();
};

const PuzzleBoard: React.FC = () => {
    const location = useLocation();
    const { src, cols, rows, total } = location.state || {}; // Obtener los detalles de la imagen desde el estado de la ubicación

    const [pool, setPool] = useState<PuzzlePieceType[]>([]);
    const [boardSlots, setBoardSlots] = useState<BoardSlots>({});
    const [completed, setCompleted] = useState(false);
    const [activeId, setActiveId] = useState<number | null>(null);
    const matches = useMediaQuery("(max-width: 768px)");
    const navigate = useNavigate();

    // Image loading logic

    const findPieceLocation = (pieceId: number) => {
        if (pool.find((p) => p.id === pieceId)) return { container: "pool" };
        for (let i = 0; i < total; i++) {
            const key = `slot-${i}`;
            if (boardSlots[key]?.id === pieceId) return { container: key };
        }
        return { container: "pool" };
    };
    const defaults = {
        spread: 360,
        ticks: 100,
        gravity: 1,
        decay: 0.94,
        startVelocity: 20,
        shapes: ["heart"],
        colors: ["FFC0CB", "FF69B4", "FF1493", "C71585"],
    };


    const shoot = (x: number, y: number) => {
        confetti({
            ...defaults,
            particleCount: 50,
            scalar: 2,
            origin: { x: x / window.innerWidth, y: y / window.innerHeight }, // Convertir a fracción de la pantalla
        });

        confetti({
            ...defaults,
            particleCount: 25,
            scalar: 3,
            origin: { x: x / window.innerWidth, y: y / window.innerHeight },
        });

        confetti({
            ...defaults,
            particleCount: 10,
            scalar: 4,
            origin: { x: x / window.innerWidth, y: y / window.innerHeight },
        });
    };
    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over) return;  // Si no hay un destino, no hacer nada.

        const pieceId = Number(active.id);
        const dropTargetId = over.id as string;

        // Si la pieza se suelta fuera del tablero o pool, no hacer nada
        if (dropTargetId === "pool" || !dropTargetId.startsWith("slot-")) return;

        // Obtener la pieza que estamos moviendo
        let movingPiece: PuzzlePieceType | undefined;
        const location = findPieceLocation(pieceId);
        if (location.container === "pool") {
            movingPiece = pool.find((p) => p.id === pieceId);
        } else {
            movingPiece = boardSlots[location.container];
        }

        if (!movingPiece) return;

        // Obtener la pieza en el slot de destino
        const targetPiece = boardSlots[dropTargetId];

        setBoardSlots((prev) => {
            const newSlots = { ...prev };

            if (targetPiece) {
                newSlots[dropTargetId] = movingPiece;
                const originalSlotId = location.container;
                if (originalSlotId !== "pool") {
                    newSlots[originalSlotId] = targetPiece;
                }
            } else {
                newSlots[dropTargetId] = movingPiece;
            }

            if (location.container !== "pool" && location.container !== dropTargetId && newSlots[location.container] == newSlots[dropTargetId]) {
                newSlots[location.container] = undefined;
            }

            return newSlots;
        });

        // Si la pieza venía de la pool, la eliminamos de allí
        if (location.container === "pool") {
            setPool((prev) => prev.filter((p) => p.id !== pieceId));
        }
        if (location.container === "pool" && targetPiece) {
            setPool((prev) => [...prev, targetPiece]);
        }

        // Obtener el elemento del slot donde la pieza fue colocada y ejecutar el confeti
        const slotElement = document.getElementById(dropTargetId);
        if (slotElement) {
            const rect = slotElement.getBoundingClientRect();

            const originX = rect.left + (rect.width * 0.5);  // Centro horizontal
            const originY = rect.top + (rect.height * 0.5);  // Centro vertical
            shoot(originX, originY);
        }

        setActiveId(null);
    };



    const handleDragStart = (event: DragStartEvent) => {
        const pieceId = Number(event.active.id);
        setActiveId(pieceId);
        console.log(activeId);
    };


    useEffect(() => {

        const img = new Image();
        img.src = src;
        img.onload = () => {
            const pieces = generatePuzzlePieces(img, cols, rows);
            setPool(pieces.sort(() => Math.random() - 0.5)); // Barajamos las piezas
        };
        img.onerror = (error) => {
            console.error('Error al cargar la imagen:', error);
        };
    }, [src, cols, rows]);
    useEffect(() => {
        if (pool.length === 0 && Object.keys(boardSlots).length === total) {
            const isCorrect = Object.keys(boardSlots).every((key, index) => {
                // Obtener el id de cada ranura
                const slotId = boardSlots[key]?.id;
                const numA = parseInt(key.split('-')[1]);

                // Mostrar la información de cada comparación
                console.log(`Comparando slot-${key}: ${slotId} con índice ${index}`);

                // Comprobar si el id de la ranura coincide con el índice
                return slotId === numA;
            })
            if (isCorrect && !completed) { // Solo lanzamos el confeti si no estaba ya completado
                setCompleted(true);
                launchConfetti();
            }
        }
    }, [pool, boardSlots, completed, total]);


    return (
        <DndContext onDragStart={handleDragStart} collisionDetection={rectIntersection} onDragEnd={handleDragEnd}>
            {matches ? <div className="main-title">
                <h1>Arma  el rompecabezas mi amorcito</h1>
            </div> : <></>}
            <div className="puzzle-wrapper">
                <div className="game-container">
                    <div className="pool-container">
                        <h3 className="original-title">Piezas</h3>
                        <Pool pool={pool} setPool={setPool} />
                    </div>
                    {matches ? <></> : <div className="main-box">
                        <div className="main-title"><div className="sized">
                            <h1>Arma  el rompecabezas mi amorcito</h1>
                        </div>
                            <img src="/destello.png" alt="" className="destello" />
                        </div>
                    </div>}
                    <div className="original-image-container">
                        <h3 className="original-title">Imagen Original</h3>
                        <img src={src} alt="Imagen original" className="original-image" />
                        <div style={{ display: "flex", justifyContent: "center", margin: "1em" }}><button className="back-button" onClick={() => navigate("/")}>⬅ Volver</button></div>

                    </div>

                    <div className="board-container">
                        <div
                            className="board-grid"
                            style={{
                                display: "grid",
                                gridTemplateColumns: `repeat(${cols}, 1fr)`,
                                gridTemplateRows: `repeat(${rows}, 1fr)`,
                                width: "100%",
                                maxWidth: "500px",
                            }}
                        >
                            {Array.from({ length: cols * rows }, (_, i) => {
                                const slotId = `slot-${i}`;
                                return (
                                    <Slot key={slotId} id={slotId}>
                                        {boardSlots[slotId] && (
                                            <PuzzlePiece
                                                key={boardSlots[slotId]!.id}
                                                piece={boardSlots[slotId]!}
                                                id={String(boardSlots[slotId]!.id)}
                                                style={{ width: "100%", height: "100%" }}
                                            />
                                        )}
                                    </Slot>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <DragOverlay
                    dropAnimation={{
                        duration: 1,
                        easing: "cubic-bezier(0.18, 0.67, 0.6, 1.22)",
                    }}
                >
                    {(() => {
                        const piece =
                            pool.find((p) => p.id === activeId) ||
                            Object.values(boardSlots).find((p) => p?.id === activeId);
                        return piece ? (
                            <motion.div
                                style={{
                                    cursor: "grabbing",
                                    zIndex: 9999,
                                    width: "100px",
                                    height: "100px",
                                    backgroundImage: `url(${piece.imageData})`,
                                    backgroundSize: "cover",
                                    borderRadius: "8px",
                                    boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                                }}
                                animate={{ scale: 1.2, zIndex: 99999 }}
                                transition={{ duration: 0.2, ease: "easeOut" }}
                            />
                        ) : null;
                    })()}
                </DragOverlay>

                <AnimatePresence>
                    {completed && (
                        <motion.div
                            className="overlay"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <h1>¡Amor, lo armaste!</h1>
                            <p>Eres mi media mitad. ¡Te amo con todo mi corazón!</p>
                        </motion.div>
                    )}
                </AnimatePresence>

            </div>

        </DndContext>
    );
};

export default PuzzleBoard;
