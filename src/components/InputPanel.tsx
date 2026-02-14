import React from 'react';
import styles from './InputPanel.module.css';
import { Delete, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { playClick } from '../utils/sound';

interface InputPanelProps {
    mode: 'math' | 'english';
    options?: string[]; // For English mode
    onInput: (value: string) => void;
    onDelete: () => void;
    onSubmit: () => void;
}

const InputPanel: React.FC<InputPanelProps> = ({ mode, options = [], onInput, onDelete, onSubmit }) => {
    if (mode === 'math') {
        const numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];

        return (
            <div className={styles.keypadGrid}>
                {numbers.slice(0, 9).map((num) => (
                    <motion.button
                        key={num}
                        className={styles.key}
                        onClick={() => { playClick(); onInput(num); }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ duration: 0.1 }}
                    >
                        {num}
                    </motion.button>
                ))}

                <motion.button
                    className={`${styles.key} ${styles.actionKey} ${styles.delete}`}
                    onClick={() => { playClick(); onDelete(); }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.1 }}
                >
                    <Delete size={24} />
                </motion.button>

                <motion.button
                    className={styles.key}
                    onClick={() => { playClick(); onInput('0'); }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.1 }}
                >
                    0
                </motion.button>

                <motion.button
                    className={`${styles.key} ${styles.actionKey} ${styles.submit}`}
                    onClick={() => { playClick(); onSubmit(); }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.1 }}
                >
                    <Check size={24} />
                </motion.button>
            </div>
        );
    }

    // English Mode (Option Grid)
    return (
        <div className={styles.optionGrid}>
            {options.map((option, index) => (
                <motion.button
                    key={index}
                    className={styles.optionBtn}
                    onClick={() => { playClick(); onInput(option); }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.1 }}
                >
                    {option}
                </motion.button>
            ))}
        </div>
    );
};

export default InputPanel;
