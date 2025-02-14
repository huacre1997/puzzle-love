import React, { createContext, useContext, useState } from "react";
import { imageDetailsData } from "../data";
import { Puzzle } from "../types";


interface ContextProps {
    selectedPuzzle: Puzzle | null;
    setSelectedPuzzle: (puzzle: Puzzle | null) => void;
    puzzles: Array<Puzzle>,
    updatePuzzles: (id: string, state: Puzzle) => void;
}

const StateContext = createContext<ContextProps | undefined>(undefined);

export const StateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [selectedPuzzle, setSelectedPuzzle] = useState<Puzzle | null>(null);

    const [puzzles, setPuzzles] = useState<Array<Puzzle>>(imageDetailsData);

    const updatePuzzles = (id: string, newState: Puzzle) => {
        setPuzzles(prev => prev.map(p => p.id === id ? { ...p, ...newState } : p));

    };
    return (
        <StateContext.Provider value={{ selectedPuzzle, setSelectedPuzzle, puzzles, updatePuzzles }}>
            {children}
        </StateContext.Provider>
    );
};

export const useStateContext = () => {
    const context = useContext(StateContext);
    if (!context) {
        throw new Error("useStateContext debe usarse dentro de un StateProvider");
    }
    return context;
};
