import React, { useState } from 'react';
import styles from './SubjectSelection.module.css';
import { BookOpen, Calculator, Brain, Trees, Rocket, Snowflake, Palette, Users, User } from 'lucide-react';
import { playClick } from '../utils/sound';
import { type GameMode, type Difficulty, type Theme } from '../utils/gameLogic';
import { motion } from 'framer-motion';

interface SubjectSelectionProps {
    onSelect: (mode: GameMode, difficulty: Difficulty, theme: Theme, isSolo: boolean) => void;
}

const SubjectSelection: React.FC<SubjectSelectionProps> = ({ onSelect }) => {
    const [difficulty, setDifficulty] = useState<Difficulty>('medium');
    const [theme, setTheme] = useState<Theme>('park');
    const [isSolo, setIsSolo] = useState<boolean>(false);

    const handleSelect = (mode: GameMode) => {
        playClick();
        onSelect(mode, difficulty, theme, isSolo);
    };

    const themes: { id: Theme; icon: any; label: string }[] = [
        { id: 'park', icon: <Trees size={16} />, label: 'Park' },
        { id: 'space', icon: <Rocket size={16} />, label: 'Space' },
        { id: 'arctic', icon: <Snowflake size={16} />, label: 'Arctic' }
    ];

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Tug of War</h1>
            <h2 className={styles.subtitle}>Choose Your Challenge</h2>

            <div className={styles.selectionGroups}>
                <div className={styles.selectionColumn}>
                    <span className={styles.label}>
                        <Brain size={14} /> Difficulty
                    </span>
                    <div className={styles.toggleGroup}>
                        {(['easy', 'medium', 'hard', 'insane'] as Difficulty[]).map((d) => (
                            <button
                                key={d}
                                className={`${styles.toggleBtn} ${difficulty === d ? styles.active : ''}`}
                                onClick={() => { playClick(); setDifficulty(d); }}
                            >
                                {d}
                            </button>
                        ))}
                    </div>
                </div>

                <div className={styles.selectionColumn}>
                    <span className={styles.label}>
                        <Palette size={14} /> Scene
                    </span>
                    <div className={styles.toggleGroup}>
                        {themes.map((t) => (
                            <button
                                key={t.id}
                                className={`${styles.toggleBtn} ${theme === t.id ? styles.active : ''}`}
                                onClick={() => { playClick(); setTheme(t.id); }}
                            >
                                {t.icon} {t.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className={styles.selectionColumn}>
                    <span className={styles.label}>
                        <Users size={14} /> Players
                    </span>
                    <div className={styles.toggleGroup}>
                        <button
                            className={`${styles.toggleBtn} ${!isSolo ? styles.active : ''}`}
                            onClick={() => { playClick(); setIsSolo(false); }}
                        >
                            <Users size={14} /> Duo
                        </button>
                        <button
                            className={`${styles.toggleBtn} ${isSolo ? styles.active : ''}`}
                            onClick={() => { playClick(); setIsSolo(true); }}
                        >
                            <User size={14} /> Solo
                        </button>
                    </div>
                </div>
            </div>

            <div className={styles.cardContainer}>
                <motion.div
                    className={styles.card}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleSelect('math')}
                >
                    <div className={`${styles.cardIcon} ${styles.blueIcon}`}>
                        <Calculator size={48} />
                    </div>
                    <h3>Mathematics</h3>
                    <p>Addition, Subtraction, and more!</p>
                </motion.div>

                <motion.div
                    className={styles.card}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleSelect('english')}
                >
                    <div className={`${styles.cardIcon} ${styles.redIcon}`}>
                        <BookOpen size={48} />
                    </div>
                    <h3>English</h3>
                    <p>Vocabulary and Spelling fun!</p>
                </motion.div>
            </div>
        </div>
    );
};

export default SubjectSelection;
