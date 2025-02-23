import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PuzzleBoard from "./components/PuzzleBoard";
import "./App.css";
import Puzzles from "./pages/Puzzles";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadAll } from "@tsparticles/all"; // if you are going to use `loadAll`, install the "@tsparticles/all" package too.
import options from "./utils/particles/fireworks";
import { useStateContext } from "./context/StateContext";
import { themeConfig } from "./data";
import { IKContext, IKImage } from "imagekitio-react";
import { motion } from "framer-motion";

const App: React.FC = () => {
    useEffect(() => {
        initParticlesEngine(async (engine) => {
            await loadAll(engine);
        }).then(() => {
            console.log("Motor de partículas inicializado");
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });

    }, []);

    const IMAGEKIT_URL = "https://ik.imagekit.io/whmaz07lo";

    const { init, theme } = useStateContext();

    return (
        <>
            {init &&
                ReactDOM.createPortal(
                    <Particles id="tsparticles" options={options} />,
                    document.getElementById("particles-container") as HTMLElement
                )}
            <Router basename="/">
                <motion.div
                    className="background"
                    initial={{ opacity: 0, scale: 1.2 }} // 🔹 Aparece con zoom más grande
                    animate={{ opacity: 1, scale: 1 }} // 🔹 Se acerca y aparece
                    exit={{ opacity: 0, scale: 1.1 }} // 🔹 Se acerca un poco más y se desvanece
                    transition={{ duration: 2, ease: "easeInOut" }}
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        zIndex: -1,
                    }}
                >
                    <IKContext publicKey="public_tSlmzVaaNOyClK/ZLiFxRdk4uoA=" urlEndpoint={IMAGEKIT_URL}>
                        <IKImage
                            path={themeConfig[theme].background}
                            lqip={{ active: true, quality: 20 }}
                            loading="lazy"
                            transformation={[{ width: "1920", height: "1080", quality: "90" }]}
                            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }}
                            className=""
                        />
                    </IKContext>
                </motion.div>

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