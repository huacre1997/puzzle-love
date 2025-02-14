import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion"; // Importamos Framer Motion
import { CheckCircleIcon } from "@heroicons/react/16/solid";
import { puzzleSize } from "../data";
import { useStateContext } from "../context/StateContext";
import { Puzzle } from "../types";

const Puzzles: React.FC = () => {
    const navigate = useNavigate();
    const { setSelectedPuzzle } = useStateContext();
    const handleClick = (puzzle: Puzzle) => {
        navigate(`/puzzle/${puzzle.id}`, { state: puzzle });
        setSelectedPuzzle(puzzle);

    };
    const { puzzles } = useStateContext();


    return (
        <motion.div
            className="image-selector"
            initial={{ opacity: 1, y: 0 }}
            animate={{ opacity: 1, y: [-10, 0, -10] }} // Animación de salto
            transition={{ duration: 1, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }} // Repetición infinita con suavidad
        >
            <h1>
                ❤️‍🔥Un puzzle, un amor, una historia para siempre ❤️‍🔥
            </h1>
            <motion.h2
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ duration: 1, repeat: Infinity, repeatType: "mirror" }}
                style={{ fontSize: '25px' }}
            >
                Selecciona una imagen 🧩
            </motion.h2>

            <div className="image-gallery">
                {puzzles.map((puzzle) => (
                    <div key={puzzle.id} style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
                        <motion.div

                            className={`image-option ${puzzle.completed ? "completed" : ""}`}
                            onClick={() => handleClick(puzzle)}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            <div className="image-thumbnail-wrapper">
                                <img src={puzzle.src} alt={puzzle.title} className={`image-thumbnail ${puzzle.completed ? "image-completed" : ""}`} />

                            </div>
                            <p>{puzzle.title} <span style={{ fontSize: '14px', color: '#777' }}> ({puzzleSize.find((puzzle) => puzzle.id === puzzle.id)?.total || 'N/A'} piezas)</span></p>

                        </motion.div>
                        <div className="check-icon">
                            <CheckCircleIcon className={`text-green-500 size-6 ${puzzle.completed ? "check-completed" : ""}`} fontSize={1.4} />
                        </div>
                    </div>
                ))}
            </div>
        </motion.div>
    );
};

export default Puzzles;