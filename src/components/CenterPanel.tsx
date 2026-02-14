import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flag, Timer, Home } from 'lucide-react';
import TugCharacter from './TugCharacter';
import { playClick } from '../utils/sound';
import { type Theme } from '../utils/gameLogic';
import styles from './CenterPanel.module.css';

interface CenterPanelProps {
    ropePosition: number; // -50 (Team 1 wins) to 50 (Team 2 wins), 0 is center
    timeLeft: number;
    theme: Theme;
    team1Score: number;
    team2Score: number;
    onHome: () => void;
    bluePower?: boolean;
    redPower?: boolean;
    blueFrozen?: boolean;
    redFrozen?: boolean;
    blueShield?: boolean;
    redShield?: boolean;
}

const CenterPanel: React.FC<CenterPanelProps> = ({
    ropePosition,
    timeLeft,
    theme,
    team1Score,
    team2Score,
    onHome,
    bluePower = false,
    redPower = false,
    blueFrozen = false,
    redFrozen = false,
    blueShield = false,
    redShield = false
}) => {
    const [points, setPoints] = useState<{ id: number; x: number; y: number; val: string }[]>([]);
    const nextId = React.useRef(0);

    // Watch scores to trigger floating points
    React.useEffect(() => {
        if (team1Score > 0) {
            addPoint('left');
        }
    }, [team1Score]);

    React.useEffect(() => {
        if (team2Score > 0) {
            addPoint('right');
        }
    }, [team2Score]);

    const addPoint = (side: 'left' | 'right') => {
        const id = nextId.current++;
        const x = side === 'left' ? 20 + Math.random() * 20 : 60 + Math.random() * 20;
        const y = 40 + Math.random() * 20;
        const isSuper = (side === 'left' && bluePower) || (side === 'right' && redPower);

        setPoints(prev => [...prev, { id, x, y, val: isSuper ? '+2' : '+1' }]);
        setTimeout(() => {
            setPoints(prev => prev.filter((p: any) => p.id !== id));
        }, 1000);
    };

    const containerClass = `${styles.container} ${styles[theme]}`;
    const visualPos = 50 + (ropePosition * 0.8);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const pullVariant = {
        pull: {
            rotate: [0, -5, 0],
            x: [0, -2, 0],
            transition: {
                duration: 0.8,
                repeat: Infinity,
                ease: "easeInOut" as const
            }
        }
    };

    const pullVariantRight = {
        pull: {
            rotate: [0, 5, 0],
            x: [0, 2, 0],
            transition: {
                duration: 0.8,
                repeat: Infinity,
                ease: "easeInOut" as const
            }
        }
    };

    return (
        <div className={containerClass}>
            <div className={styles.header}>
                <div className={`${styles.scoreBox} ${styles.blue}`}>
                    <span className={styles.teamLabel}>Team 1</span>
                    <span className={styles.score}>{team1Score}</span>
                </div>

                <div className={styles.timerContainer}>
                    <button className={styles.homeIconBtn} onClick={() => { playClick(); onHome(); }} title="Quit to Home">
                        <Home size={20} />
                    </button>
                    <div className={styles.timer}>
                        <Timer size={20} />
                        <span>{formatTime(timeLeft)}</span>
                    </div>
                </div>

                <div className={`${styles.scoreBox} ${styles.red}`}>
                    <span className={styles.teamLabel}>Team 2</span>
                    <span className={styles.score}>{team2Score}</span>
                </div>
            </div>

            <div className={styles.field}>
                <AnimatePresence>
                    {bluePower && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1.2 }}
                            exit={{ opacity: 0 }}
                            className={`${styles.powerLabel} ${styles.bluePower}`}
                        >
                            ⚡ SUPER PULL ⚡
                        </motion.div>
                    )}
                    {redPower && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1.2 }}
                            exit={{ opacity: 0 }}
                            className={`${styles.powerLabel} ${styles.redPower}`}
                        >
                            ⚡ SUPER PULL ⚡
                        </motion.div>
                    )}
                </AnimatePresence>

                <AnimatePresence>
                    {blueFrozen && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className={`${styles.effectOverlay} ${styles.blueFrozen}`}>🧊 FROZEN</motion.div>}
                    {redFrozen && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className={`${styles.effectOverlay} ${styles.redFrozen}`}>🧊 FROZEN</motion.div>}
                    {blueShield && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className={`${styles.effectOverlay} ${styles.blueShield}`}>🛡️ SHIELD</motion.div>}
                    {redShield && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className={`${styles.effectOverlay} ${styles.redShield}`}>🛡️ SHIELD</motion.div>}
                </AnimatePresence>

                <motion.div
                    className={`${styles.teamGroup} ${styles.groupLeft} ${bluePower ? styles.powerGlowBlue : ''}`}
                    animate={{ right: `${100 - visualPos}%` }}
                    transition={{ type: "spring", stiffness: 100, damping: 20 }}
                    style={{ transform: 'translateX(-50px)' }}
                >
                    {[...Array(3)].map((_, i) => (
                        <motion.div key={i} variants={pullVariant} animate="pull" style={{ margin: '0 -15px' }}>
                            <TugCharacter
                                team="blue"
                                className={styles.bluePuller}
                                theme={theme}
                            />
                        </motion.div>
                    ))}
                </motion.div>

                <div className={styles.ropeContainer}>
                    <div className={`${styles.ropeLine} ${Math.abs(ropePosition) >= 35 ? styles.tension : ''}`}></div>
                    <motion.div
                        className={styles.ropeKnot}
                        animate={{ left: `${visualPos}%` }}
                        transition={{ type: "spring", stiffness: 100, damping: 20 }}
                    >
                        <Flag size={32} fill="#ffcc00" color="#e67e22" />
                    </motion.div>
                </div>

                <motion.div
                    className={`${styles.teamGroup} ${styles.groupRight} ${redPower ? styles.powerGlowRed : ''}`}
                    animate={{ left: `${visualPos}%` }}
                    transition={{ type: "spring", stiffness: 100, damping: 20 }}
                    style={{ transform: 'translateX(50px)' }}
                >
                    {[...Array(3)].map((_, i) => (
                        <motion.div key={i} variants={pullVariantRight} animate="pull" style={{ margin: '0 -15px' }}>
                            <TugCharacter
                                team="red"
                                className={styles.redPuller}
                                theme={theme}
                            />
                        </motion.div>
                    ))}
                </motion.div>

                <div className={styles.centerMarker}></div>

                {/* Floating Points */}
                <AnimatePresence>
                    {points.map(p => (
                        <motion.div
                            key={p.id}
                            initial={{ opacity: 0, y: p.y, x: `${p.x}%` }}
                            animate={{ opacity: 1, y: p.y - 100 }}
                            exit={{ opacity: 0 }}
                            className={styles.floatingPoint}
                            style={{ left: `${p.x}%`, top: `${p.y}%` }}
                        >
                            {p.val}
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default CenterPanel;
