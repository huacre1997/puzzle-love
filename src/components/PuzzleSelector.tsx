import React from "react";
import { useNavigate } from "react-router-dom";

const puzzleImages = [
    { id: "puzzle1", src: "/images/puzzle1.jpg" },
    { id: "puzzle2", src: "/images/puzzle2.jpg" },
    { id: "puzzle3", src: "/images/puzzle3.jpg" },
    { id: "puzzle4", src: "/images/puzzle4.jpg" },
];

const PuzzleSelector: React.FC = () => {
    const navigate = useNavigate();

    const handleSelect = (id: string) => {
        navigate(`/puzzle/${id}`);
    };

    return (
        <div className="puzzle-selector">
            <h2>Selecciona tu rompecabezas</h2>
            <div className="puzzle-gallery">
                {puzzleImages.map(({ id, src }) => (
                    <div key={id} className="puzzle-option" onClick={() => handleSelect(id)}>
                        <img src={src} alt={`Puzzle ${id}`} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PuzzleSelector;
