import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PuzzleBoard from "./components/PuzzleBoard";
import "./App.css";
import Puzzles from "./pages/Puzzles";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadAll } from "@tsparticles/all"; // if you are going to use `loadAll`, install the "@tsparticles/all" package too.
import options from "./utils/particles/fireworks";
import { useStateContext } from "./context/StateContext";
// import { loadFull } from "tsparticles"; // if you are going to use `loadFull`, install the "tsparticles" package too.
// import { loadBasic } from "@tsparticles/basic"; // if you are going to use `loadBasic`, install the "@tsparticles/basic" package too.
const App: React.FC = () => {
    useEffect(() => {
        initParticlesEngine(async (engine) => {
            await loadAll(engine);
        }).then(() => {
            console.log("Motor de partículas inicializado");
        });
    }, []);
    const particlesLoaded = (container) => {
        console.log(container);
    };
    const { init } = useStateContext();

    return (
        <>
            {init &&
                ReactDOM.createPortal(
                    <Particles id="tsparticles" particlesLoaded={particlesLoaded} options={options} />,
                    document.getElementById("particles-container") as HTMLElement
                )}
            <Router>

                <div className="app-container">


                    <Routes>
                        <Route path="/" element={<Puzzles />} />
                        <Route path="/puzzle/:imageId" element={<PuzzleBoard />} />
                    </Routes>
                </div>
            </Router></>

    );
};

export default App;