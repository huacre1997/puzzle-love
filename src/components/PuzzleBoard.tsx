import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { DndContext, DragEndEvent, DragStartEvent, rectIntersection, DragOverlay } from "@dnd-kit/core";
import { motion, AnimatePresence } from "framer-motion";
import { generatePuzzlePieces } from "../utils/generatePuzzlePieces";
import PuzzlePiece from "./PuzzlePiece";
import Slot from "./Slot";
import Pool from "./Pool";
import { PuzzlePiece as PuzzlePieceType } from "../types";
import { useMediaQuery } from "usehooks-ts";
import { shoot } from "../utils/particles/confetti";
import { useStateContext } from "../context/StateContext";
import { puzzleSize } from "../data";
import { Puzzle } from "../types";

const PuzzleBoard: React.FC = () => {
    const { imageId } = useParams(); // Obtén el parámetro 'id' de la URL

    const [activeId, setActiveId] = useState<number | null>(null);
    const matches = useMediaQuery("(max-width: 768px)");
    const navigate = useNavigate();
    const confettiFrameRef = useRef<number | null>(null); // Referencia para la animación del confeti
    const { selectedPuzzle, updatePuzzles, setSelectedPuzzle } = useStateContext();
    const { rows, cols, total } = puzzleSize.find((puzzle) => puzzle.id === selectedPuzzle!.id)!;
    const [completed, setCompleted] = useState(false)
    const launchConfetti = (launch: boolean) => {
        const colors = ["#FF69B4", "#FFC0CB", "#FF1493", "#ffffff"]; // Colores románticos

        if (launch) {
            // Solo lanzamos el confeti si se debe iniciar
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
                confettiFrameRef.current = requestAnimationFrame(frame);
            })();
        } else {
            if (confettiFrameRef.current !== null) {
                cancelAnimationFrame(confettiFrameRef.current);
            }
            confettiFrameRef.current = null;
        }
    };

    const goBack = () => {
        navigate("/");
        launchConfetti(false);
        setCompleted(false);
    };


    const findPieceLocation = (pieceId: number) => {
        if (selectedPuzzle?.pool.find((p) => p.id === pieceId)) return { container: "pool" };
        for (let i = 0; i < total; i++) {
            const key = `slot-${i}`;
            if (selectedPuzzle?.boardSlots[key]?.id === pieceId) return { container: key };
        }
        return { container: "pool" };
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
            movingPiece = selectedPuzzle?.pool.find((p) => p.id === pieceId);
        } else {
            movingPiece = selectedPuzzle?.boardSlots[location.container] ?? undefined;
        }

        if (!movingPiece) return;

        // Obtener la pieza en el slot de destino
        const targetPiece = selectedPuzzle?.boardSlots[dropTargetId];
        const newBoardSlots = { ...selectedPuzzle!.boardSlots };

        if (targetPiece) {
            newBoardSlots[dropTargetId] = movingPiece;
            const originalSlotId = location.container;
            if (originalSlotId !== "pool") {
                newBoardSlots[originalSlotId] = targetPiece;
            }
        } else {
            newBoardSlots[dropTargetId] = movingPiece;
        }

        if (location.container !== "pool" && location.container !== dropTargetId && newBoardSlots[location.container] === newBoardSlots[dropTargetId]) {
            newBoardSlots[location.container] = null;
        }

        // Si la pieza estaba en el pool y se movió a un slot, debemos actualizar el pool.
        let updatedPool = selectedPuzzle!.pool.filter((p) => p.id !== pieceId); // Eliminar la pieza del pool si estaba allí

        if (location.container === "pool" && targetPiece) {
            updatedPool = [...updatedPool, targetPiece]; // Añadir la pieza de destino si estaba en el pool
        }

        // Actualizamos el contexto global
        if (selectedPuzzle) {
            const updatedPuzzle: Puzzle = {
                ...selectedPuzzle,
                boardSlots: newBoardSlots,
                pool: updatedPool,  // Actualizamos el pool también
            };
            setSelectedPuzzle(updatedPuzzle); // Actualizamos el estado local
            updatePuzzles(selectedPuzzle.id, updatedPuzzle);  // Actualizamos el estado global
        }

        // Obtener el elemento del slot donde la pieza fue colocada y ejecutar el confeti
        const slotElement = document.getElementById(dropTargetId);
        if (slotElement) {
            const rect = slotElement.getBoundingClientRect();

            const originX = rect.left + (rect.width * 0.5);  // Centro horizontal
            const originY = rect.top + (rect.height * 0.5);  // Centro vertical
            shoot(originX, originY);  // Lanzar confeti
        }

        setActiveId(null);  // Reseteamos el ID activo
    };


    const handleDragStart = (event: DragStartEvent) => {
        const pieceId = Number(event.active.id);
        setActiveId(pieceId);
        console.log(activeId);
    };
    useEffect(() => {
        console.log("imageId:", imageId); // Verifica que imageId esté disponible
        if (imageId) {
            const puzzle = puzzleSize.find((puzzle) => puzzle.id === parseInt(imageId));
            if (puzzle) {
                setSelectedPuzzle(puzzle); // Actualiza el puzzle seleccionado
            }
        }
    }, [imageId, setSelectedPuzzle, navigate]);
    useEffect(() => {
        if (imageId) {
            const puzzle = puzzleSize.find((puzzle) => puzzle.id === parseInt(imageId)); // Encuentra el puzzle con ese id
            if (puzzle) {
                setSelectedPuzzle(puzzle); // Actualiza el puzzle seleccionado
            }
        }
    }, [imageId, setSelectedPuzzle, navigate]); // Asegúrate de que se actualice cuando cambie el id

    useEffect(() => {

        const img = new Image();
        img.src = selectedPuzzle!.src;
        img.onload = () => {
            const pieces = generatePuzzlePieces(img, cols, rows);
            const random_pieces = (pieces.sort(() => Math.random() - 0.5));
            if (Object.keys(selectedPuzzle!.boardSlots).length === 0) {
                setSelectedPuzzle({ ...selectedPuzzle!, pool: random_pieces });
                updatePuzzles(selectedPuzzle!.id, { ...selectedPuzzle!, pool: random_pieces });
            }

        };
        img.onerror = (error) => {
            console.error('Error al cargar la imagen:', error);
        };

    }, []);
    useEffect(() => {
        if (selectedPuzzle?.completed) {
            setCompleted(true);
        }
        if (selectedPuzzle?.pool.length === 0 && Object.keys(selectedPuzzle?.boardSlots).length === total) {
            const isCorrect = Object.keys(selectedPuzzle?.boardSlots).every((key) => {
                const slotId = selectedPuzzle?.boardSlots[key]?.id;
                const numA = parseInt(key.split('-')[1]);
                return slotId === numA;
            });

            if (isCorrect && !selectedPuzzle?.completed) {
                if (selectedPuzzle) {
                    launchConfetti(true);
                    updatePuzzles(selectedPuzzle?.id, { ...selectedPuzzle, completed: true });
                    setCompleted(true);
                }
            }
        }

        return () => {
            launchConfetti(false); // Detener confeti cuando el usuario salga de la pantalla
        };
    }, [selectedPuzzle, setCompleted]);


    return (
        <DndContext onDragStart={handleDragStart} collisionDetection={rectIntersection} onDragEnd={handleDragEnd}>
            {matches ? <div className="main-title">
                <h1>Arma  el rompecabezas mi amorcito</h1>
            </div> : <></>}
            <div className="puzzle-wrapper">
                <div className="game-container">
                    <motion.div initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, ease: "easeInOut" }} className="pool-container">
                        <h3 className="original-title">Piezas</h3>
                        <Pool pool={selectedPuzzle?.pool} />
                    </motion.div>
                    {!matches && (
                        <motion.div
                            className="main-box"
                            initial={{ opacity: 0, y: 0 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, ease: "easeInOut" }}
                        >
                            <div className="main-title">
                                <div className="sized">
                                    <h1>Arma el rompecabezas mi amorcito</h1>
                                </div>
                                <img
                                    src="/destello.png"
                                    alt=""
                                    className="destello"
                                />
                            </div>
                        </motion.div>
                    )}
                    <motion.div initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, ease: "easeInOut" }}
                        className="original-image-container">
                        <h3 className="original-title">Imagen Original</h3>
                        <img src={selectedPuzzle?.src} alt="Imagen original" className="original-image" />
                        {matches ? <></> : <> <div style={{ display: "flex", justifyContent: "center", margin: "1em" }}>
                            <button className="back-button" onClick={() => navigate("/")}>⬅ Volver</button>
                        </div></>}

                    </motion.div>

                    <div className="board-container">
                        <div
                            className="board-grid"
                            style={{
                                display: "grid",
                                gridTemplateColumns: `repeat(${cols}, 1fr)`,
                                gridTemplateRows: `repeat(${rows}, 1fr)`,
                                width: "80%",
                            }}
                        >
                            {Array.from({ length: cols * rows }, (_, i) => {
                                const slotId: string = `slot-${i}`;
                                return (
                                    <motion.div initial="hidden"
                                        key={slotId}
                                        animate="visible"
                                        transition={{
                                            duration: 1,
                                            delay: i * 0.1, // Stagger the animation for each piece
                                        }}
                                        variants={{
                                            hidden: { opacity: 0, scale: 0.5 },
                                            visible: { opacity: 1, scale: 1 },
                                        }}>

                                        <Slot key={slotId} id={slotId}>
                                            {selectedPuzzle?.boardSlots[slotId] && (
                                                <PuzzlePiece
                                                    key={selectedPuzzle.boardSlots[slotId]!.id}
                                                    piece={selectedPuzzle.boardSlots[slotId]!}
                                                    id={String(selectedPuzzle.boardSlots[slotId]!.id)}
                                                    style={{ width: "100%", height: "100%" }}
                                                />
                                            )}
                                        </Slot>
                                    </motion.div>

                                );
                            })}
                        </div>
                    </div>
                    {matches ? <motion.div className="btn-dev" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }} style={{ display: "flex", justifyContent: "center", margin: "1em" }}>
                        <button className="back-button" onClick={() => navigate("/")}>⬅ Volver</button>
                    </motion.div> : <> </>}
                </div>

                <DragOverlay
                    dropAnimation={{
                        duration: 1,
                        easing: "cubic-bezier(0.18, 0.67, 0.6, 1.22)",
                    }}
                >
                    {(() => {
                        if (selectedPuzzle) {
                            const piece =
                                selectedPuzzle.pool.find((p) => p.id === activeId) ||
                                Object.values(selectedPuzzle.boardSlots).find((p) => String(p?.id) === String(activeId));
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
                        }
                    })()}
                </DragOverlay>

                <AnimatePresence>
                    {completed && (
                        <motion.div
                            className="overlay"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 1 }}
                        >
                            {/* Imagen del corazón con animación de latido infinito */}
                            <motion.img
                                src="/heart.png" // Asegúrate de que la imagen esté en la ruta correcta
                                alt="Corazón latiendo"
                                style={{ width: "80px", height: "80px", margin: "0 auto" }}
                                initial={{ scale: 1 }}
                                animate={{ scale: [1, 1.2, 1] }} // Efecto de latido
                                transition={{ repeat: Infinity, duration: 0.6, ease: "easeInOut" }}
                            />

                            <motion.h1
                                initial={{ y: -20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 2 }}
                            >
                                ¡Amor, lo armaste!
                            </motion.h1>

                            <p>{selectedPuzzle?.message}</p>

                            {/* Botón para regresar a la pantalla principal */}
                            <motion.button
                                onClick={goBack}
                                style={{
                                    backgroundColor: "#d49b38", // Un color rosa llamativo
                                    border: "none",
                                    padding: "10px 20px",
                                    borderRadius: "25px",
                                    fontSize: "16px",
                                    cursor: "pointer",
                                    marginTop: "20px",
                                }}
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 1 }}
                                whileHover={{ scale: 1.1 }}
                            >
                                Regresar a la pantalla principal
                            </motion.button>
                        </motion.div>
                    )}
                </AnimatePresence>


            </div>

        </DndContext>
    );
};

export default PuzzleBoard;

