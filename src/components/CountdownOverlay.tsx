import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './CountdownOverlay.module.css';

interface CountdownOverlayProps {
    count: number | string;
}

const CountdownOverlay: React.FC<CountdownOverlayProps> = ({ count }) => {
    return (
        <div className={styles.overlay}>
            <AnimatePresence mode="wait">
                <motion.div
                    key={count}
                    initial={{ scale: 0.5, opacity: 0, rotate: -10 }}
                    animate={{ scale: 1.2, opacity: 1, rotate: 0 }}
                    exit={{ scale: 2, opacity: 0, rotate: 10 }}
                    transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 20,
                        duration: 0.5
                    }}
                    className={`${styles.number} ${count === 'GO!' ? styles.goText : ''}`}
                >
                    {count}
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default CountdownOverlay;
