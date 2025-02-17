import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

interface AlertProps {
    message: string;
    onClose?: () => void;
}

const Alert: React.FC<AlertProps> = ({ message }) => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (message) {
            setVisible(true);
            const timer = setTimeout(() => {
                setVisible(false);
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [message]);

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    key={message}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 50 }}
                    transition={{ duration: 0.5 }}
                    className="alert"
                >
                    <span>{message}</span>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Alert;
