import React, { createContext, Dispatch, SetStateAction, useContext, useEffect, useState } from "react";
import { imageDetailsData, Theme } from "../data";
import { Puzzle } from "../types";
import { appConfig } from "../config";


interface ContextProps {
    selectedPuzzle: Puzzle | null;
    setSelectedPuzzle: (puzzle: Puzzle | null) => void;
    init: boolean;
    setInit: Dispatch<SetStateAction<boolean>>;
    puzzles: Array<Puzzle>,
    updatePuzzles: (id: string, state: Puzzle) => void;
    theme: Theme;
    setTheme: Dispatch<SetStateAction<Theme>>
}

const StateContext = createContext<ContextProps | undefined>(undefined);

export const StateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [selectedPuzzle, setSelectedPuzzle] = useState<Puzzle | null>(null);
    const [init, setInit] = useState(false);
    const [theme, setTheme] = useState(appConfig.theme);

    const [puzzles, setPuzzles] = useState<Array<Puzzle>>(() => {
        // Intentar recuperar de localStorage, si no existe, usar `imageDetailsData`
        const savedPuzzles = localStorage.getItem("puzzles");
        return savedPuzzles ? JSON.parse(savedPuzzles) : imageDetailsData;
    });

    useEffect(() => {
        // Guardar en localStorage cada vez que puzzles cambie
        localStorage.setItem("puzzles", JSON.stringify(puzzles));
    }, [puzzles]);
    const updatePuzzles = (id: string, newState: Puzzle) => {

        setPuzzles(prev => prev.map(p => p.id === id ? { ...p, ...newState } : p));

    };
    return (
        <StateContext.Provider value={{
            selectedPuzzle, setSelectedPuzzle, puzzles, updatePuzzles, init, setInit, theme, setTheme
        }}>
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
