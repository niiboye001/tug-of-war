import React, { useEffect } from 'react';
import styles from './WinnerScreen.module.css';
import { Trophy, RefreshCw, CheckCircle, Clock, Home } from 'lucide-react';
import confetti from 'canvas-confetti';
import { playWin } from '../utils/sound';

interface WinnerScreenProps {
    winner: 'Team 1' | 'Team 2' | 'Draw';
    score: number;
    timeTaken: number;
    onRestart: () => void;
    onHome: () => void;
    isNewStreakRecord?: boolean;
    isNewTimeRecord?: boolean;
}

const WinnerScreen: React.FC<WinnerScreenProps> = ({
    winner, score, timeTaken, onRestart, onHome,
    isNewStreakRecord = false, isNewTimeRecord = false
}) => {
    useEffect(() => {
        // Play sound
        playWin();

        // Fire confetti
        const duration = 3000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 2000 };

        const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

        const interval: any = setInterval(function () {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            // since particles fall down, start a bit higher than random
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
        }, 250);

        return () => clearInterval(interval);
    }, []);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <Trophy size={140} className={styles.trophy} />

                <h1 className={styles.teamName}>
                    {winner === 'Draw' ? "Draw" : winner}
                </h1>
                <h2 className={styles.subtitle}>Winner!</h2>

                <div className={styles.statsRow}>
                    <div className={styles.statItem}>
                        <div className={styles.iconCircle}>
                            <CheckCircle size={24} color="#4CAF50" />
                        </div>
                        <span className={styles.statValue}>{score}</span>
                        <span className={styles.statLabel}>correct answers</span>
                        {isNewStreakRecord && <span className={styles.recordBadge}>NEW STREAK RECORD!</span>}
                    </div>

                    <div className={styles.divider}></div>

                    <div className={styles.statItem}>
                        <div className={styles.iconCircle}>
                            <Clock size={24} color="#FF9800" />
                        </div>
                        <span className={styles.statValue}>{formatTime(timeTaken)}</span>
                        <span className={styles.statLabel}>time</span>
                        {isNewTimeRecord && <span className={styles.recordBadge}>FASTEST WIN!</span>}
                    </div>
                </div>

                <div className={styles.buttonGroup}>
                    <button className={styles.playAgainBtn} onClick={onRestart}>
                        <RefreshCw size={24} />
                        PLAY AGAIN
                    </button>

                    {/* Home button is not prominent in screenshot but keeping it accessible */}
                    <button className={styles.homeBtn} onClick={onHome}>
                        <Home size={24} />
                        HOME
                    </button>
                </div>
            </div>
        </div>
    );
};

export default WinnerScreen;
