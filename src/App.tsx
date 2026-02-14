import { useState, useEffect } from 'react';
import GameLayout from './components/GameLayout';
import TeamPanel from './components/TeamPanel';
import CenterPanel from './components/CenterPanel';
import SubjectSelection from './components/SubjectSelection';
import WinnerScreen from './components/WinnerScreen';
import type { GameMode, Difficulty, Theme } from './utils/gameLogic';
import { motion, AnimatePresence } from 'framer-motion';
import { bgm, playCrowdCheer } from './utils/sound';

type GameState = 'selection' | 'playing' | 'ended';

function App() {
  const [gameState, setGameState] = useState<GameState>('selection');
  const [gameMode, setGameMode] = useState<GameMode | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [theme, setTheme] = useState<Theme>('park');
  const [isSolo, setIsSolo] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [team1Score, setTeam1Score] = useState(0);
  const [team2Score, setTeam2Score] = useState(0);
  const [ropePosition, setRopePosition] = useState(0); // -50 to 50
  const [winner, setWinner] = useState<'Team 1' | 'Team 2' | 'Draw'>('Draw');
  const [blueStreak, setBlueStreak] = useState(0);
  const [redStreak, setRedStreak] = useState(0);
  const [isShaking, setIsShaking] = useState(false);
  const [isNewStreakRecord, setIsNewStreakRecord] = useState(false);
  const [isNewTimeRecord, setIsNewTimeRecord] = useState(false);

  // Game Timer
  useEffect(() => {
    let interval: number;
    if (gameState === 'playing' && timeLeft > 0) {
      bgm.start();
      bgm.setBPM(timeLeft <= 15 ? 150 : 110);
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else {
      bgm.stop();
      if (timeLeft === 0 && gameState === 'playing') {
        endGame();
      }
    }
    return () => clearInterval(interval);
  }, [gameState, timeLeft]);

  // AI Opponent Logic
  useEffect(() => {
    let interval: number;
    if (gameState === 'playing' && isSolo) {
      const delays: Record<Difficulty, number> = { easy: 8000, medium: 5000, hard: 3500, insane: 2200 };
      const delay = delays[difficulty];

      interval = setInterval(() => {
        // 90% chance to answer correctly
        if (Math.random() > 0.1) {
          handleAIAnswer();
        } else {
          setRedStreak(0); // AI also loses streak on "failure"
        }
      }, delay);
    }
    return () => clearInterval(interval);
  }, [gameState, isSolo, difficulty]);

  // Check for win condition based on rope position
  useEffect(() => {
    if (gameState === 'playing') {
      if (ropePosition <= -50) {
        setWinner('Team 1');
        setGameState('ended');
      } else if (ropePosition >= 50) {
        setWinner('Team 2');
        setGameState('ended');
      }
    }
  }, [ropePosition, gameState]);

  const startGame = (mode: GameMode, diff: Difficulty, thm: Theme, solo: boolean) => {
    setGameMode(mode);
    setDifficulty(diff);
    setTheme(thm);
    setIsSolo(solo);
    setGameState('playing');
    resetGame();
    resetGameStates();
  };

  const resetGame = () => {
    setTimeLeft(60);
    setTeam1Score(0);
    setTeam2Score(0);
    setRopePosition(0);
    setWinner('Draw');
    setBlueStreak(0);
    setRedStreak(0);
  };

  const endGame = () => {
    setGameState('ended');
    const finalWinner = team1Score > team2Score ? 'Team 1' : (team2Score > team1Score ? 'Team 2' : 'Draw');
    setWinner(finalWinner);

    // Progression System: Check for records
    const bestStreakKey = `tug_bestStreak_${difficulty}`;
    const bestTimeKey = `tug_bestTime_${difficulty}`;

    const savedBestStreak = parseInt(localStorage.getItem(bestStreakKey) || '0');
    const savedBestTime = parseInt(localStorage.getItem(bestTimeKey) || '999');

    if (blueStreak > savedBestStreak) {
      localStorage.setItem(bestStreakKey, blueStreak.toString());
      setIsNewStreakRecord(true);
    }

    if (finalWinner === 'Team 1' && (60 - timeLeft) < savedBestTime) {
      localStorage.setItem(bestTimeKey, (60 - timeLeft).toString());
      setIsNewTimeRecord(true);
    }
  };

  const resetGameStates = () => {
    setIsNewStreakRecord(false);
    setIsNewTimeRecord(false);
  };

  const handleCorrectAnswer = (team: 'blue' | 'red') => {
    // Note: streak state might be slightly behind if called directly 
    // but effectively it works because handleCorrectAnswer is called AFTER setStreak in the panel
    const currentStreak = team === 'blue' ? blueStreak : redStreak;
    const multiplier = currentStreak >= 3 ? 2 : 1;
    const pullStrength = 5 * multiplier;

    if (team === 'blue') {
      setTeam1Score((prev) => prev + 1);
      setRopePosition((prev) => Math.max(-50, prev - pullStrength));
    } else {
      setTeam2Score((prev) => prev + 1);
      setRopePosition((prev) => Math.min(50, prev + pullStrength));
    }

    if (currentStreak >= 2) { // 3rd answer triggers cheer/shake
      playCrowdCheer();
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
    }
  };

  const handleAIAnswer = () => {
    setRedStreak(prev => prev + 1);
    handleCorrectAnswer('red');
  };

  const handleRestart = () => {
    if (gameMode) startGame(gameMode, difficulty, theme, isSolo);
  };

  const handleHome = () => {
    setGameState('selection');
    setGameMode(null);
  };

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.3 }
  };

  return (
    <div style={{ overflow: 'hidden', width: '100vw', height: '100vh', background: '#f8fafc' }}>
      <AnimatePresence mode="wait">
        {gameState === 'selection' ? (
          <motion.div key="selection" {...pageVariants} style={{ width: '100%', height: '100%' }}>
            <SubjectSelection onSelect={startGame} />
          </motion.div>
        ) : (
          <motion.div key="game" {...pageVariants} style={{ width: '100%', height: '100%', position: 'relative' }}>
            {gameMode && (
              <GameLayout
                isShaking={isShaking}
                leftPanel={
                  <TeamPanel
                    team="blue"
                    gameMode={gameMode}
                    difficulty={difficulty}
                    onCorrectAnswer={() => handleCorrectAnswer('blue')}
                    onStreak={(s: number) => setBlueStreak(s)}
                    isActive={gameState === 'playing'}
                  />
                }
                centerPanel={
                  <CenterPanel
                    ropePosition={ropePosition}
                    timeLeft={timeLeft}
                    theme={theme}
                    team1Score={team1Score}
                    team2Score={team2Score}
                    onHome={handleHome}
                    bluePower={blueStreak >= 3}
                    redPower={redStreak >= 3}
                  />
                }
                rightPanel={
                  <TeamPanel
                    team="red"
                    gameMode={gameMode}
                    difficulty={difficulty}
                    onCorrectAnswer={() => handleCorrectAnswer('red')}
                    onStreak={(s: number) => setRedStreak(s)}
                    isActive={gameState === 'playing' && !isSolo}
                    isSolo={isSolo}
                  />
                }
              />
            )}

            {gameState === 'ended' && (
              <WinnerScreen
                winner={winner}
                score={winner === 'Team 1' ? team1Score : winner === 'Team 2' ? team2Score : Math.max(team1Score, team2Score)}
                timeTaken={60 - timeLeft}
                onRestart={handleRestart}
                onHome={handleHome}
                isNewStreakRecord={isNewStreakRecord}
                isNewTimeRecord={isNewTimeRecord}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
