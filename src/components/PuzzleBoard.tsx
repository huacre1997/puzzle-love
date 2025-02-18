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
import AnimatedTitle from "./AnimatedTitle";
import Alert from "./Alert";
import CheckToHeart from "./CheckToHeart";

const PuzzleBoard: React.FC = () => {
    const { imageId } = useParams(); // Obtener el ID desde la URL

    const [activeId, setActiveId] = useState<number | null>(null);
    const matches = useMediaQuery("(max-width: 768px)");
    const navigate = useNavigate();
    const confettiFrameRef = useRef<number | null>(null); // Referencia para la animación del confeti
    const { selectedPuzzle, updatePuzzles, setSelectedPuzzle, puzzles } = useStateContext();
    const { rows, cols, total } = puzzleSize.find((puzzle) => puzzle.id === imageId)!;
    const [completed, setCompleted] = useState(false)
    const [alert, setAlert] = useState<string>("");

    // Función para agregar alertas

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
            const over_id = dropTargetId.replace("slot-", "");
            if (Number(over_id) == Number(pieceId)) {
                const randomMessages = [
                    "¡Cada paso que das me hace amarte más! 💖",
                    "¡Lo lograste, mi amor, y yo siempre estaré aquí para celebrarlo contigo! 🎉❤️",
                    "¡Eres increíble, como un sueño del que nunca quiero despertar! 😍✨",
                    "¡Sigue brillando, mi corazón late más fuerte por cada logro tuyo! 💓🌟",
                    "¡Tu esfuerzo me inspira, sigamos construyendo nuestro futuro juntos! 🏡💑",
                    "¡Eres imparable, y yo soy tu fan número uno! 🏆🥰",
                    "¡Cada meta que alcanzas hace que nuestro amor brille aún más! 💕🌟",
                    "¡Tú y tus logros son mi mayor orgullo! 💖👏",
                    "¡Cada victoria tuya es un beso en mi corazón! 😘💞",
                    "¡Nada me hace más feliz que verte triunfar, mi amor! 🎊💘",
                    "¡Tú conquistas todo, incluido mi corazón! 💘🏆",
                    "¡Sigue adelante, amor mío, juntos llegaremos lejos! 🚀❤️",
                    "¡Tu determinación me enamora cada día más! 💪💖"
                ];

                // Seleccionar un mensaje aleatorio
                const randomMessage = randomMessages[Math.floor(Math.random() * randomMessages.length)];

                // Mostrar la alerta
                setAlert(randomMessage);
                shoot(originX, originY);  // Lanzar confeti
            }
        }

        setActiveId(null);  // Reseteamos el ID activo
    };
    const getClue = () => {
        if (!selectedPuzzle || selectedPuzzle.clues === 0) return;
        let updatedPuzzle: Puzzle;

        const randomPiece = [...selectedPuzzle.pool].sort(() => Math.random() - 0.5).shift();
        if (randomPiece === undefined) {
            const keys = Object.keys(selectedPuzzle.boardSlots);
            let randomKey: string;
            let movingPiece: PuzzlePieceType | null;
            let dropTargetId: string;

            do {
                randomKey = keys[Math.floor(Math.random() * keys.length)];
                movingPiece = selectedPuzzle.boardSlots[randomKey];
                dropTargetId = `slot-${movingPiece?.id}`;
            } while (dropTargetId === randomKey);

            if (!movingPiece) return;

            const newBoardSlots = { ...selectedPuzzle.boardSlots };
            const targetPiece = newBoardSlots[dropTargetId];

            newBoardSlots[dropTargetId] = movingPiece;
            newBoardSlots[randomKey] = targetPiece;

            updatedPuzzle = { ...selectedPuzzle, boardSlots: newBoardSlots, clues: selectedPuzzle.clues - 1 };
        } else {
            // Movemos la pieza del pool al tablero
            const dropTargetId = `slot-${randomPiece.id}`;
            const updatedPool = selectedPuzzle.pool.filter((p) => p.id !== randomPiece.id);
            const newBoardSlots = { ...selectedPuzzle.boardSlots };

            if (newBoardSlots[dropTargetId]) {
                updatedPool.push(newBoardSlots[dropTargetId]); // Devolvemos la pieza previa al pool
            }
            newBoardSlots[dropTargetId] = randomPiece;

            updatedPuzzle = { ...selectedPuzzle, boardSlots: newBoardSlots, pool: updatedPool, clues: selectedPuzzle.clues - 1 };
        }
        setSelectedPuzzle(updatedPuzzle);
        updatePuzzles(selectedPuzzle.id, updatedPuzzle);
    }

    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event;
        if (!active) return;  // Si no hay un destino, no hacer nada.

        const pieceId = Number(event.active.id);
        const selectedPiece = selectedPuzzle?.boardSlots[`slot-${pieceId}`];
        setActiveId(pieceId);
        if (pieceId == selectedPiece?.id) {
            return;
        }

    };

    useEffect(() => {
        if (!imageId) {
            navigate("/");
            return;
        }

        const puzzle = puzzles.find(p => p.id === imageId);
        if (!puzzle) {
            navigate("/");
            return;
        }

        setSelectedPuzzle(puzzle);
    }, [imageId, puzzles, navigate, setSelectedPuzzle]);
    useEffect(() => {
        if (!selectedPuzzle) return; // Evitar que se ejecute si es null

        const img = new Image();
        img.src = selectedPuzzle.src;
        img.onload = () => {
            const pieces = generatePuzzlePieces(img, cols, rows);
            const random_pieces = pieces.sort(() => Math.random() - 0.5);

            if (Object.keys(selectedPuzzle.boardSlots).length === 0) {
                const updatedPuzzle = { ...selectedPuzzle, pool: random_pieces };
                setSelectedPuzzle(updatedPuzzle);
                updatePuzzles(selectedPuzzle.id, updatedPuzzle);
            }
        };
        img.onerror = (error) => {
            console.error("Error al cargar la imagen:", error);
        };
    }, []); // Se ejecuta solo cuando selectedPuzzle ya tiene un valor

    useEffect(() => {
        if (selectedPuzzle?.completed) {
            setCompleted(true);
            launchConfetti(true)
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
            {matches && <h1 className="main-title">Arma el rompecabezas mi amorcito</h1>}
            <div className="puzzle-wrapper">
                <div className="game-container">
                    {matches && <motion.button className="button-clue" onClick={getClue} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}><img src="../clues.png" /><p>Pista</p><p>({selectedPuzzle?.clues} restantes)</p></motion.button>
                    }
                    {!matches && (
                        <motion.div
                            className="main-box"
                            initial={{ opacity: 0, y: 0 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, ease: "easeInOut" }}
                        >
                            <div className="main-title-puzzle">
                                <div className="sized">
                                    <AnimatedTitle />
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
                        <motion.div initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 1, ease: "easeInOut" }} className="pool-container">
                            <h3 className="original-title">Piezas</h3>
                            <Pool pool={selectedPuzzle?.pool} />
                        </motion.div>
                        {!matches && (
                            <motion.button
                                className="button-clue"
                                onClick={getClue}
                                whileTap={{ scale: 0.9, transition: { duration: 0 } }}
                                whileHover={{ scale: 1.1, transition: { duration: 0 } }} // Hover instantáneo
                            >
                                <img src="../clues.png" />
                                <p>Pista</p>
                                <p>({selectedPuzzle?.clues} restantes)</p>
                            </motion.button>
                        )}
                        {matches ? <></> : <> <div style={{ display: "flex", justifyContent: "center", margin: "1em" }}>
                            <motion.button whileTap={{ scale: 0.9, transition: { duration: 0 } }}
                                whileHover={{ scale: 1.1, transition: { duration: 0.2 } }} className="back-button" onClick={() => navigate("/")}>⬅ Volver</motion.button>
                        </div></>}

                    </motion.div>

                    <div className="board-container">
                        <div
                            className="board-grid"
                            style={{
                                display: "grid",
                                gridTemplateColumns: `repeat(${cols}, 1fr)`,
                                gridTemplateRows: `repeat(${rows}, 1fr)`,
                            }}
                        >
                            {Array.from({ length: cols * rows }, (_, i) => {
                                const slotId: string = `slot-${i}`;
                                return (
                                    <motion.div initial="hidden"
                                        key={slotId}
                                        animate="visible"
                                        transition={{
                                            duration: 0.5, // Duración más corta
                                            delay: i * 0.02, // Delay ajustado
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
                                    animate={{ scale: matches ? 0.75 : 1.2, zIndex: 99999 }}
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
                            transition={{ duration: 0.5 }}
                        >
                            <motion.div className="overlay-image" initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }} // Efecto de latido
                                transition={{ duration: 1, ease: "easeInOut" }}>
                                <img className="" src={selectedPuzzle?.src} alt={selectedPuzzle?.title}
                                />
                            </motion.div>

                            {/* Imagen del corazón con animación de latido infinito */}
                            <motion.img
                                src="/heart.png" // Asegúrate de que la imagen esté en la ruta correcta
                                alt="Corazón latiendo"
                                style={{ width: "50px", height: "50px", margin: "0 auto" }}
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

                            <motion.div initial={{ y: -20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 2 }} className="overlay-sub">
                                <p>{selectedPuzzle?.message}</p>

                            </motion.div>
                            <motion.button
                                onClick={goBack}
                                className="back-button"
                                initial={{ y: 30, opacity: 0, scale: 0.9 }}
                                animate={{ y: 0, opacity: 1, scale: 1 }}
                                transition={{
                                    duration: 0.6,
                                    ease: "easeOut",
                                    type: "spring",
                                    stiffness: 120,
                                }}
                                whileHover={{
                                    scale: 1.12,
                                    boxShadow: "0px 6px 15px rgba(255, 152, 0, 0.4)", // Efecto de elevación
                                }}
                                whileTap={{
                                    scale: 0.95,
                                    boxShadow: "0px 2px 6px rgba(255, 152, 0, 0.3)", // Simula presión
                                }}
                            >
                                Regresar
                            </motion.button>

                        </motion.div>
                    )}
                </AnimatePresence>


            </div>
            <div style={{ position: 'fixed', top: '0', width: '100%', padding: '20px', display: 'flex', justifyContent: 'center' }}>
                {alert && <Alert message={alert} />}

            </div>
        </DndContext >
    );
};

export default PuzzleBoard;

