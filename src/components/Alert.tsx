import { motion, AnimatePresence } from 'framer-motion';

interface AlertProps {
    message: string;
}

const Alert: React.FC<AlertProps> = ({ message }) => {
    return (
        <AnimatePresence>
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
        </AnimatePresence>
    );
};

export default Alert;
