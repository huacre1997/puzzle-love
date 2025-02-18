import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion"; // Importamos Framer Motion
import { useStateContext } from "../context/StateContext";
import { Puzzle } from "../types";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import React, { useEffect } from "react";
import Slider from "react-slick";
import { useMediaQuery } from "usehooks-ts";
import PuzzleItem from "../components/PuzzleItem";
const Puzzles: React.FC = () => {
    const navigate = useNavigate();
    const { setSelectedPuzzle, puzzles, setInit } = useStateContext();
    const matches = useMediaQuery("(max-width: 768px)");

    const handleClick = (puzzle: Puzzle) => {
        navigate(`/puzzle/${puzzle.id}`, { state: puzzle });
        setSelectedPuzzle(puzzle);
    };
    useEffect(() => {
        const puzzles_completed = puzzles.filter((puzzle) => !puzzle.completed);
        console.log(puzzles_completed.length)
        if (puzzles_completed.length == 0) {
            setInit(true);
        }

    }, [])

    const get_main_message = () => {
        const remainingPuzzles = puzzles.filter((puzzle) => !puzzle.completed).length;
        console.log(remainingPuzzles)
        if (remainingPuzzles === 0) {
            return "🎉💖 ¡Felicidades, mi amor! Has completado todos los puzzles. Eres increíble. 😍🧩";
        }
        if (remainingPuzzles === puzzles.length) {
            return "📸💖 ¡Selecciona una imagen para comenzar tu puzzle! 🧩✨";
        }
        if (remainingPuzzles > 0 && remainingPuzzles < puzzles.length) {
            return `Sigue así, mi amor! Te quedan ${remainingPuzzles} puzzle${remainingPuzzles > 1 ? "s" : ""} por completar. 🧩💕`;
        }

    };
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
    };

    return (
        <motion.div
            className="image-selector"
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
    );
};
export default Puzzles;