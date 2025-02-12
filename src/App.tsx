import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PuzzleBoard from "./components/PuzzleBoard";
import "./App.css";
import Puzzles from "./pages/Puzzles";

const App: React.FC = () => {
    return (
        <Router>
            <div className="app-container">
                <Routes>
                    <Route path="/" element={<Puzzles />} />
                    <Route path="/puzzle/:imageId" element={<PuzzleBoard />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;