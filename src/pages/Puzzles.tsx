import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useStateContext } from "../context/StateContext";
import { Puzzle } from "../types";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import { useMediaQuery } from "usehooks-ts";
import PuzzleItem from "../components/PuzzleItem";
import { ArrowPathIcon, CheckCircleIcon, ExclamationTriangleIcon, XCircleIcon } from "@heroicons/react/24/solid";
import Overlay from "../components/Overlay";
import { themeConfig } from "../data";

const Puzzles: React.FC = () => {
    const navigate = useNavigate();
    const { setSelectedPuzzle, puzzles, setInit, updatePuzzles } = useStateContext();
    const matches = useMediaQuery("(max-width: 768px)");
    const [visible, setVisible] = useState(false)
    const handleClick = (puzzle: Puzzle) => {
        navigate(`/puzzle/${puzzle.id}`, { state: puzzle });
        setSelectedPuzzle(puzzle);
    };
    const { theme } = useStateContext()
    const handleReset = () => {
        setVisible(true);
    };

    const onConfirm = () => {
        puzzles.map((e) => {
            updatePuzzles(e.id, { ...e, boardSlots: {}, completed: false, pool: [], clues: 5 })
        })
        window.localStorage.clear()
        window.localStorage.setItem("puzzles", JSON.stringify(puzzles))
        setVisible(false)
        setInit(false)
    };

    useEffect(() => {
        const puzzles_completed = puzzles.filter((puzzle) => !puzzle.completed);
        if (puzzles_completed.length === 0) {
            setInit(true);
        }
    }, []);

    const get_main_message = () => {
        const remainingPuzzles = puzzles.filter((puzzle) => !puzzle.completed).length;
        if (remainingPuzzles === 0) {
            return "🎉💖 ¡Felicidades, mi amor! Has completado todos los puzzles. Eres increíble. 😍🧩";
        }
        if (remainingPuzzles === puzzles.length) {
            return "📸💖 ¡Selecciona una imagen para comenzar tu puzzle! 🧩✨";
        }
        return `Sigue así, mi amor! Te quedan ${remainingPuzzles} puzzle${remainingPuzzles > 1 ? "s" : ""} por completar. 🧩💕`;
    };

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
    };



    return (

        <React.Fragment>
            <button
                onClick={handleReset} style={{
                    background: themeConfig[theme].gradient,
                }}
                className="fixed-button"
            >
                <ArrowPathIcon className="size-10" scale={2} />
            </button>
            <motion.div
                className="image-selector relative"
                initial={{ opacity: 1, y: 0 }}
                animate={{ opacity: 1, y: [-10, 0, -10] }}
                transition={{ duration: 1, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
            >
                <h1 className="main-title">❤️‍🔥Un puzzle, un amor, una historia para siempre ❤️‍🔥</h1>
                <motion.h2
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 1, repeat: Infinity, repeatType: "mirror" }}
                    className="sub-title"
                >
                    {get_main_message()}
                </motion.h2>

                {matches ? (
                    <div className="display-container">
                        <Slider {...settings}>
                            {puzzles.map((puzzle) => (
                                <PuzzleItem key={puzzle.id} puzzle={puzzle} onClick={handleClick} />
                            ))}
                        </Slider>
                    </div>
                ) : (
                    <div className="image-gallery">
                        {puzzles.map((puzzle) => (
                            <PuzzleItem key={puzzle.id} puzzle={puzzle} onClick={handleClick} />
                        ))}
                    </div>
                )}


            </motion.div>
            <Overlay isVisible={visible} onClose={() => setVisible(false)} hasCloseButton={false}>
                <motion.div
                    className="modal-content"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                >
                    <ExclamationTriangleIcon className="icon-warning" />
                    <h1 className="modal-title">¿Deseas reiniciar todos los puzzles?</h1>
                    <p className="modal-text">Esta acción no se puede deshacer.</p>

                    <div className="modal-buttons">
                        <motion.button
                            onClick={onConfirm}
                            className="btn-confirm"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            <CheckCircleIcon className="icon-btn" />
                            Sí
                        </motion.button>
                        <motion.button
                            onClick={() => setVisible(false)}
                            className="btn-cancel"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            <XCircleIcon className="icon-btn" />
                            No
                        </motion.button>
                    </div>
                </motion.div>
            </Overlay>
        </React.Fragment>
    );
};

export default Puzzles;
