import React from "react";
import { motion, AnimatePresence } from "framer-motion";
interface OverlayProps {
    isVisible: boolean;
    onClose: () => void;
    children: React.ReactNode;
    hasCloseButton: boolean;
}
const Overlay = ({ isVisible, onClose, children, hasCloseButton }: OverlayProps) => {
    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    className="overlay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 1.2 }}
                    transition={{ duration: 0.5 }}
                >
                    <motion.div className="overlay-content" initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, ease: "easeInOut" }}>
                        {children}
                    </motion.div>
                    {hasCloseButton && <motion.button
                        onClick={onClose}
                        className="back-button"
                        initial={{ y: 30, opacity: 0, scale: 0.9 }}
                        animate={{ y: 0, opacity: 1, scale: 1 }}
                        transition={{
                            duration: 0.6,
                            ease: "easeOut",
                            type: "spring",
                            stiffness: 120,
                        }}
                        whileHover={{
                            scale: 1.12,
                            boxShadow: "0px 6px 15px rgba(255, 152, 0, 0.4)",
                        }}
                        whileTap={{
                            scale: 0.95,
                            boxShadow: "0px 2px 6px rgba(255, 152, 0, 0.3)",
                        }}
                    >
                        Cerrar
                    </motion.button>}
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Overlay;
