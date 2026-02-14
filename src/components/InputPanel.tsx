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
    team: 'blue' | 'red';
}

const InputPanel: React.FC<InputPanelProps> = ({ mode, options = [], onInput, onDelete, onSubmit, team }) => {
    if (mode === 'math') {
        const numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9']; // 1-9
        const teamHints = team === 'blue'
            ? ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'BS', 'Ent']
            : ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '[', ']'];

        return (
            <div className={styles.keypadGrid}>
                {numbers.map((num, i) => (
                    <motion.button
                        key={num}
                        className={styles.key}
                        onClick={() => { playClick(); onInput(num); }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ duration: 0.1 }}
                    >
                        {num}
                        <span className={styles.keyHint}>{teamHints[i]}</span>
                    </motion.button>
                ))}

                <motion.button
                    className={`${styles.key} ${styles.actionKey} ${styles.delete}`}
                    onClick={() => { playClick(); onDelete(); }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.1 }}
                >
                    <Delete size={24} />
                    <span className={styles.keyHint}>{teamHints[10]}</span>
                </motion.button>

                <motion.button
                    className={styles.key}
                    onClick={() => { playClick(); onInput('0'); }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.1 }}
                >
                    0
                    <span className={styles.keyHint}>{teamHints[9]}</span>
                </motion.button>

                <motion.button
                    className={`${styles.key} ${styles.actionKey} ${styles.submit}`}
                    onClick={() => { playClick(); onSubmit(); }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.1 }}
                >
                    <Check size={24} />
                    <span className={styles.keyHint}>{teamHints[11]}</span>
                </motion.button>
            </div>
        );
    }

    // English Mode (Option Grid)
    const englishHints = team === 'blue' ? ['1', '2', '3', '4'] : ['Q', 'W', 'E', 'R'];

    return (
        <div className={styles.optionGrid}>
            {options.map((option, index) => (
                <motion.button
                    key={index}
                    className={styles.optionBtn}
                    onClick={() => { playClick(); onInput(option); }}
                    whileTap={{ scale: 0.95 }}
                    style={{ position: 'relative' }}
                    transition={{ duration: 0.1 }}
                >
                    {option}
                    <span className={styles.keyHint} style={{ position: 'absolute', top: '5px', right: '10px' }}>
                        {englishHints[index]}
                    </span>
                </motion.button>
            ))}
        </div>
    );
};

export default InputPanel;
