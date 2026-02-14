import React, { useState, useEffect } from 'react';
import styles from './TeamPanel.module.css';
import InputPanel from './InputPanel';
import { generateProblem, type GameMode, type Problem, type Difficulty, type PowerUp } from '../utils/gameLogic';
import { motion, AnimatePresence } from 'framer-motion';
import { playCorrect, playWrong, playClick } from '../utils/sound';
import { Star, Snowflake, Shield, Zap } from 'lucide-react';

interface TeamPanelProps {
    team: 'blue' | 'red';
    gameMode: GameMode;
    difficulty: Difficulty;
    onCorrectAnswer: () => void;
    onStreak?: (streak: number) => void;
    isActive: boolean;
    isSolo?: boolean;
    powerUps?: PowerUp[];
    onActivatePowerUp?: (powerUp: PowerUp) => void;
}

const TeamPanel: React.FC<TeamPanelProps> = ({
    team, gameMode, difficulty, onCorrectAnswer, onStreak, isActive, isSolo = false,
    powerUps = [], onActivatePowerUp
}) => {
    const [problem, setProblem] = useState<Problem>({ question: '', answer: '' });
    const [userInput, setUserInput] = useState('');
    const [feedback, setFeedback] = useState<'none' | 'correct' | 'wrong'>('none');
    const [streak, setStreak] = useState(0);
    const [usedWords, setUsedWords] = useState<string[]>([]);

    useEffect(() => {
        if (isActive) {
            const newUsedWords: string[] = [];
            const newProblem = generateProblem(gameMode, difficulty, newUsedWords);
            setProblem(newProblem);

            if (gameMode !== 'math') {
                const identifier = gameMode === 'english'
                    ? newProblem.question.replace('_', newProblem.answer)
                    : newProblem.question;
                setUsedWords([identifier]);
            }

            setUserInput('');
            setFeedback('none');
        }
    }, [gameMode, difficulty, isActive]);

    useEffect(() => {
        if (!isActive || isSolo) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            const key = e.key.toLowerCase();

            if (team === 'blue') {
                // Team 1 Mapping: 1-0, Backspace, Enter
                if (gameMode === 'math') {
                    if (/^[0-9]$/.test(key)) {
                        handleInput(key);
                    } else if (key === 'backspace') {
                        handleDelete();
                    } else if (key === 'enter') {
                        handleSubmit();
                    }
                } else {
                    // English options: 1, 2, 3, 4
                    if (['1', '2', '3', '4'].includes(key)) {
                        const idx = parseInt(key) - 1;
                        if (problem.options && problem.options[idx]) {
                            handleInput(problem.options[idx]);
                        }
                    }
                }
            } else {
                // Team 2 Mapping: Q-P row for 1-0, [, ]
                if (gameMode === 'math') {
                    const redKeys: { [key: string]: string } = {
                        'q': '1', 'w': '2', 'e': '3', 'r': '4', 't': '5',
                        'y': '6', 'u': '7', 'i': '8', 'o': '9', 'p': '0'
                    };
                    if (redKeys[key]) {
                        handleInput(redKeys[key]);
                    } else if (key === '[') {
                        handleDelete();
                    } else if (key === ']') {
                        handleSubmit();
                    }
                } else {
                    // English options: Q, W, E, R
                    const redOptionKeys: { [key: string]: number } = { 'q': 0, 'w': 1, 'e': 2, 'r': 3 };
                    if (redOptionKeys[key] !== undefined) {
                        const idx = redOptionKeys[key];
                        if (problem.options && problem.options[idx]) {
                            handleInput(problem.options[idx]);
                        }
                    }
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isActive, isSolo, team, gameMode, problem]);

    const handleInput = (val: string) => {
        if (feedback !== 'none') return;

        if (gameMode !== 'math') {
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

    const handleDelete = () => {
        setUserInput(prev => prev.slice(0, -1));
    };

    const handleCorrect = () => {
        playCorrect();
        const newStreak = streak + 1;
        setStreak(newStreak);
        onStreak?.(newStreak);

        setFeedback('correct');
        onCorrectAnswer();
        setTimeout(() => {
            const newProblem = generateProblem(gameMode, difficulty, usedWords);
            setProblem(newProblem);

            if (gameMode !== 'math') {
                const identifier = gameMode === 'english'
                    ? newProblem.question.replace('_', newProblem.answer)
                    : newProblem.question;
                setUsedWords(prev => [...prev, identifier]);
            }

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
            const newProblem = generateProblem(gameMode, difficulty, usedWords);
            setProblem(newProblem);

            if (gameMode !== 'math') {
                const identifier = gameMode === 'english'
                    ? newProblem.question.replace('_', newProblem.answer)
                    : newProblem.question;
                setUsedWords(prev => [...prev, identifier]);
            }

            setUserInput('');
            setFeedback('none');
        }, 500);
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

    const getPowerUpIcon = (type: string) => {
        switch (type) {
            case 'freeze': return <Snowflake size={16} />;
            case 'shield': return <Shield size={16} />;
            case 'double_pull': return <Zap size={16} />;
            default: return null;
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
                        className={`${styles.question} ${problem.question.length > 10 ? styles.longText : ''}`}
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
                {!isActive && (
                    <div className={styles.frozenOverlay}>🧊 FROZEN!</div>
                )}
            </div>

            <div className={styles.powerupInventory}>
                <AnimatePresence>
                    {powerUps.map((p) => (
                        <motion.button
                            key={p.id}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className={`${styles.powerUpBtn} ${styles[p.type]}`}
                            onClick={() => { playClick(); onActivatePowerUp?.(p); }}
                            title={`Activate ${p.type.replace('_', ' ')}`}
                        >
                            {getPowerUpIcon(p.type)}
                        </motion.button>
                    ))}
                </AnimatePresence>
            </div>

            <div className={styles.inputArea}>
                {!isSolo ? (
                    <InputPanel
                        mode={gameMode}
                        options={problem.options}
                        onInput={handleInput}
                        onDelete={handleDelete}
                        onSubmit={handleSubmit}
                        team={team}
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
