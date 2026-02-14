import React from 'react';
import styles from './GameLayout.module.css';

interface GameLayoutProps {
    leftPanel: React.ReactNode;
    centerPanel: React.ReactNode;
    rightPanel: React.ReactNode;
    isShaking?: boolean;
}

const GameLayout: React.FC<GameLayoutProps> = ({ leftPanel, centerPanel, rightPanel, isShaking = false }) => {
    return (
        <div className={`${styles.container} ${isShaking ? styles.shake : ''}`}>
            <div className={`${styles.panel} ${styles.leftPanel}`}>
                {leftPanel}
            </div>
            <div className={styles.centerPanel}>
                {centerPanel}
            </div>
            <div className={`${styles.panel} ${styles.rightPanel}`}>
                {rightPanel}
            </div>
        </div>
    );
};

export default GameLayout;
