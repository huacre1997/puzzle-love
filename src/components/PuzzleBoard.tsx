import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { DndContext, rectIntersection, DragOverlay } from "@dnd-kit/core";
import { motion } from "framer-motion";
import { generatePuzzlePieces } from "../utils/generatePuzzlePieces";
import Pool from "./Pool";
import { PuzzlePiece as PuzzlePieceType } from "../types";
import { useMediaQuery } from "usehooks-ts";
import { useStateContext } from "../context/StateContext";
import { puzzleSize, themeConfig } from "../data";
import { Puzzle } from "../types";
import AnimatedTitle from "./AnimatedTitle";
import Alert from "./Alert";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";
import { useDragAndDrop } from "../hooks/useDragAndDrop";
import { usePuzzleInitialization } from "../hooks/usePuzzleInitiation";
import { useConfetti } from "../hooks/useConfetti";
import PuzzleGrid from "./PuzzleGrid";
import Overlay from "./Overlay";

const PuzzleBoard: React.FC = () => {
    const { imageId } = useParams(); // Obtener el ID desde la URL

    const matches = useMediaQuery("(max-width: 768px)");
    const navigate = useNavigate();
    const { selectedPuzzle, updatePuzzles, setSelectedPuzzle, puzzles, theme } = useStateContext();
    const { rows, cols, total } = puzzleSize.find((puzzle) => puzzle.id === imageId)!;
    const [completed, setCompleted] = useState(false)
    const [alert, setAlert] = useState<string>("");
    const { launchConfetti, shoot } = useConfetti();
    const { activeId, handleDragEnd, handleDragStart } = useDragAndDrop(selectedPuzzle, setSelectedPuzzle, updatePuzzles, total, setAlert);
    usePuzzleInitialization(selectedPuzzle, setSelectedPuzzle, updatePuzzles, cols, rows);


    const getClue = () => {
        if (!selectedPuzzle || selectedPuzzle.clues === 0) return;
        let updatedPuzzle: Puzzle;
        let dropTargetId: string;

        const randomPiece = [...selectedPuzzle.pool].sort(() => Math.random() - 0.5).shift();
        if (randomPiece === undefined) {
            const keys = Object.keys(selectedPuzzle.boardSlots);
            let randomKey: string;
            let movingPiece: PuzzlePieceType | null;

            do {
                randomKey = keys[Math.floor(Math.random() * keys.length)];
                movingPiece = selectedPuzzle.boardSlots[randomKey];
                dropTargetId = `slot-${movingPiece?.id}`;
            } while (dropTargetId === randomKey);

            if (!movingPiece) return;

            const newBoardSlots = { ...selectedPuzzle.boardSlots };
            const targetPiece = newBoardSlots[dropTargetId];

            newBoardSlots[dropTargetId] = { ...movingPiece, correctSlot: movingPiece.id === parseInt(dropTargetId.replace('slot-', '')) };
            if (targetPiece && targetPiece.id !== undefined) {
                newBoardSlots[randomKey] = {
                    ...targetPiece,
                    correctSlot: targetPiece.id === parseInt(randomKey.replace('slot-', ''))
                };
            }

            updatedPuzzle = { ...selectedPuzzle, boardSlots: newBoardSlots, clues: selectedPuzzle.clues - 1 };

        } else {
            // Movemos la pieza del pool al tablero
            dropTargetId = `slot-${randomPiece.id}`;
            const updatedPool = selectedPuzzle.pool.filter((p) => p.id !== randomPiece.id);
            const newBoardSlots = { ...selectedPuzzle.boardSlots };

            if (newBoardSlots[dropTargetId]) {
                if (newBoardSlots[dropTargetId]) {
                    updatedPool.push(newBoardSlots[dropTargetId]!); // Devolvemos la pieza previa al pool
                }
            }
            newBoardSlots[dropTargetId] = { ...randomPiece, correctSlot: true };;
            updatedPuzzle = { ...selectedPuzzle, boardSlots: newBoardSlots, pool: updatedPool, clues: selectedPuzzle.clues - 1 };
        }

        setSelectedPuzzle(updatedPuzzle);
        updatePuzzles(selectedPuzzle.id, updatedPuzzle);
        const slotElement = document.getElementById(dropTargetId);

        const rect = slotElement!.getBoundingClientRect();

        const originX = rect.left + (rect.width * 0.5);  // Centro horizontal
        const originY = rect.top + (rect.height * 0.5);  // Centro vertical
        shoot(originX, originY);  // Lanzar confeti
    }

    const goBack = () => {
        navigate("/");
        launchConfetti(false);
        setCompleted(false);
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
        <DndContext onDragStart={handleDragStart} collisionDetection={rectIntersection} onDragEnd={handleDragEnd} modifiers={[restrictToWindowEdges]}>
            {matches && <h1 className="main-title">Arma el rompecabezas mi amorcito</h1>}
            <div className="puzzle-wrapper">
                <div className="game-container">
                    {matches && <motion.button
                        className="button-clue"
                        onClick={getClue}
                        whileTap={{ scale: 0.9, transition: { duration: 0 } }}
                        whileHover={{ scale: 1.2, transition: { duration: 0 } }}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        style={{
                            background: themeConfig[theme].gradient,
                        }}
                    >
                        <motion.img
                            src="../clues.png"
                            animate={{ rotate: [0, 20, -20, 0] }}
                            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                        />
                        <motion.p
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}

                        >Pista</motion.p>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                        >({selectedPuzzle?.clues} restantes)</motion.p>
                    </motion.button>
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
                                whileHover={{ scale: 1.2, transition: { duration: 0 } }}
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, ease: "easeOut" }}
                                style={{
                                    background: themeConfig[theme].gradient,
                                }}
                            >
                                <motion.img
                                    src="../clues.png"
                                    animate={{ rotate: [0, 20, -20, 0] }}
                                    transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                                />
                                <motion.p
                                    initial={{ scale: 0.8 }}
                                    animate={{ scale: 1 }}
                                    transition={{ duration: 0.3, ease: "easeInOut" }}
                                >Pista</motion.p>
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.2, duration: 0.5 }}
                                >({selectedPuzzle?.clues} restantes)</motion.p>
                            </motion.button>

                        )}
                        {matches ? <></> : <> <div style={{ display: "flex", justifyContent: "center", margin: "1em" }}>
                            <motion.button whileTap={{ scale: 0.9, transition: { duration: 0 } }} style={{
                                background: themeConfig[theme].gradient,
                            }}
                                whileHover={{ scale: 1.1, transition: { duration: 0.2 } }} className="back-button" onClick={() => navigate("/")}>⬅ Volver</motion.button>
                        </div></>}

                    </motion.div>

                    <div className="board-container">
                        <PuzzleGrid cols={cols} rows={rows} selectedPuzzle={selectedPuzzle} />


                    </div>
                    {matches ? <motion.div className="btn-dev" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }} style={{ display: "flex", justifyContent: "center", margin: "1em" }}>
                        <button
                            style={{
                                background: themeConfig[theme].gradient,
                            }}
                            className="back-button" onClick={() => navigate("/")}>⬅ Volver</button>
                    </motion.div> : <> </>}

                </div>

                <DragOverlay
                    modifiers={[restrictToWindowEdges]}

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

                <Overlay isVisible={completed} onClose={goBack} hasCloseButton={false}>
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
                        style={{ color: themeConfig[theme].color }}
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
                        style={{
                            background: themeConfig[theme].gradient
                        }}
                        transition={{
                            duration: 0.6,
                            ease: "easeOut",
                            type: "spring",
                            stiffness: 120,
                        }}
                        whileHover={{
                            scale: 1.12,
                            boxShadow: `0px 6px 15px ${themeConfig[theme].boxShadow}`, // Simula presión
                        }}
                        whileTap={{
                            scale: 0.95,
                            boxShadow: `0px 2px 6px ${themeConfig[theme].boxShadow}`, // Simula presión
                        }}
                    >

                        Regresar
                    </motion.button>

                </Overlay>

            </div>
            <div style={{ position: 'fixed', top: '0', width: '100%', padding: '20px', display: 'flex', justifyContent: 'center' }}>
                {alert && <Alert message={alert} />}

            </div>
        </DndContext >
    );
};

export default PuzzleBoard;

