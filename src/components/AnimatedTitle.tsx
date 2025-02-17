import { motion } from "framer-motion";

const title = "Arma el rompecabezas mi amorcito";

const AnimatedTitle = () => {
    return (
        <div className="main-title-puzzle">
            {title.split("").map((char, index) => (
                <motion.span
                    key={index}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{
                        delay: index * 0.02, // Retraso progresivo por letra
                        duration: 0.5, // Duración fija de 1 segundo
                        ease: "easeOut"
                    }}
                    style={{ display: "inline-block" }}
                >
                    {char === " " ? "\u00A0" : char}
                </motion.span>
            ))}
        </div>
    );
};

export default AnimatedTitle;
