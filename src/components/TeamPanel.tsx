import React, { useState, useEffect } from 'react';
import styles from './TeamPanel.module.css';
import InputPanel from './InputPanel';
import { generateProblem, type GameMode, type Problem, type Difficulty } from '../utils/gameLogic';
import { motion, AnimatePresence } from 'framer-motion';
import { playCorrect, playWrong } from '../utils/sound';
import { Star } from 'lucide-react';

interface TeamPanelProps {
    team: 'blue' | 'red';
    gameMode: GameMode;
    difficulty: Difficulty;
    onCorrectAnswer: () => void;
    onStreak?: (streak: number) => void;
    isActive: boolean;
    isSolo?: boolean;
}

const TeamPanel: React.FC<TeamPanelProps> = ({ team, gameMode, difficulty, onCorrectAnswer, onStreak, isActive, isSolo = false }) => {
    const [problem, setProblem] = useState<Problem>({ question: '', answer: '' });
    const [userInput, setUserInput] = useState('');
    const [feedback, setFeedback] = useState<'none' | 'correct' | 'wrong'>('none');
    const [streak, setStreak] = useState(0);

    useEffect(() => {
        if (isActive) {
            setProblem(generateProblem(gameMode, difficulty));
            setUserInput('');
            setFeedback('none');
        }
    }, [gameMode, difficulty, isActive]);

    const handleInput = (val: string) => {
        if (feedback !== 'none') return;

        if (gameMode === 'english') {
            if (val === problem.answer) {
                handleCorrect();
            } else {
                handleWrong();
            }
        } else {
            setUserInput(prev => (prev + val).slice(0, 3));
        }
    };

    const handleSubmit = () => {
        if (userInput === problem.answer) {
            handleCorrect();
        } else {
            handleWrong();
        }
    };

    const handleCorrect = () => {
        playCorrect();
        const newStreak = streak + 1;
        setStreak(newStreak);
        onStreak?.(newStreak);

        setFeedback('correct');
        onCorrectAnswer();
        setTimeout(() => {
            setProblem(generateProblem(gameMode, difficulty));
            setUserInput('');
            setFeedback('none');
        }, 500);
    };

    const handleWrong = () => {
        playWrong();
        setStreak(0);
        onStreak?.(0);

        setFeedback('wrong');
        setTimeout(() => {
            setProblem(generateProblem(gameMode, difficulty));
            setUserInput('');
            setFeedback('none');
        }, 500);
    };

    const handleDelete = () => {
        setUserInput(prev => prev.slice(0, -1));
    };

    const containerVariants = {
        none: { scale: 1, x: 0 },
        correct: {
            scale: [1, 1.05, 1],
            boxShadow: "0px 0px 20px rgba(76, 175, 80, 0.5)",
            transition: { duration: 0.3 }
        },
        wrong: {
            x: [-10, 10, -10, 10, 0],
            transition: { duration: 0.4 }
        }
    };

    return (
        <motion.div
            className={`${styles.container} ${team === 'blue' ? styles.blue : styles.red}`}
            animate={feedback}
            variants={containerVariants}
        >
            <div className={styles.header}>
                <h2 className={styles.teamName}>Team {team === 'blue' ? '1' : '2'}</h2>
                {streak >= 2 && (
                    <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className={styles.streakBadge}
                    >
                        <Star size={14} fill="#f1c40f" color="#f39c12" />
                        <span>{streak} COMBO</span>
                    </motion.div>
                )}
            </div>

            <div className={`${styles.problemBox} ${styles[feedback]}`}>
                <AnimatePresence mode='wait'>
                    <motion.div
                        key={isSolo ? 'ai-status' : problem.question}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                        className={styles.question}
                    >
                        {isSolo ? (
                            <div className={styles.aiStatus}>
                                <span>COMPUTER</span>
                                <small style={{ fontSize: '0.4em', display: 'block', opacity: 0.7 }}>AI OPPONENT</small>
                            </div>
                        ) : problem.question}
                    </motion.div>
                </AnimatePresence>
                {!isSolo && gameMode === 'math' && (
                    <div className={styles.inputPreview}>{userInput}</div>
                )}
            </div>

            <div className={styles.inputArea}>
                {!isSolo ? (
                    <InputPanel
                        mode={gameMode}
                        options={problem.options}
                        onInput={handleInput}
                        onDelete={handleDelete}
                        onSubmit={handleSubmit}
                    />
                ) : (
                    <div style={{ textAlign: 'center', opacity: 0.5, padding: '2rem' }}>
                        Keypad disabled for AI
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default TeamPanel;
