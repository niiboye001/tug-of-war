// Simple sound synthesizer using Web Audio API
// No external assets required

const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
const audioCtx = new AudioContext();

const playTone = (freq: number, type: OscillatorType, duration: number, volume: number = 0.1) => {
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(freq, audioCtx.currentTime);

    gainNode.gain.setValueAtTime(volume, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.start();
    oscillator.stop(audioCtx.currentTime + duration);
};

export const playCorrect = () => {
    // High pitch "ding"
    playTone(880, 'sine', 0.1, 0.2); // A5
    setTimeout(() => playTone(1760, 'sine', 0.3, 0.2), 100); // A6
};

export const playWrong = () => {
    // Low pitch "buzz"
    playTone(150, 'sawtooth', 0.3, 0.2);
    setTimeout(() => playTone(100, 'sawtooth', 0.3, 0.2), 100);
};

export const playClick = () => {
    // Short "tick"
    playTone(400, 'triangle', 0.05, 0.05);
};

export const playWin = () => {
    // Fanfare: C E G C
    const notes = [523.25, 659.25, 783.99, 1046.50];
    let time = 0;
    notes.forEach((note) => {
        setTimeout(() => playTone(note, 'square', 0.2, 0.1), time);
        time += 150;
    });
    // Final long note
    setTimeout(() => playTone(1046.50, 'square', 1.0, 0.1), time);
};

export const playCrowdCheer = () => {
    // Noise-based cheer
    const bufferSize = audioCtx.sampleRate * 1.5;
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.2;
    }
    const noise = audioCtx.createBufferSource();
    noise.buffer = buffer;
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1000, audioCtx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(400, audioCtx.currentTime + 1.5);
    const gain = audioCtx.createGain();
    gain.gain.setValueAtTime(0, audioCtx.currentTime);
    gain.gain.linearRampToValueAtTime(0.15, audioCtx.currentTime + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 1.5);
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(audioCtx.destination);
    noise.start();
};

class ProceduralMusic {
    private isPlaying: boolean = false;
    private interval: any = null;
    private bpm: number = 110;
    private step: number = 0;

    start() {
        if (this.isPlaying) return;
        this.isPlaying = true;
        this.step = 0;
        this.schedule();
    }

    setBPM(newBPM: number) {
        this.bpm = newBPM;
        if (this.isPlaying) {
            clearTimeout(this.interval);
            this.schedule();
        }
    }

    stop() {
        this.isPlaying = false;
        clearTimeout(this.interval);
    }

    private schedule() {
        if (!this.isPlaying) return;
        this.playBeat(this.step % 8);
        this.step++;
        const nextTime = (60 / this.bpm) * 1000 * 0.5; // Eighth notes
        this.interval = setTimeout(() => this.schedule(), nextTime);
    }

    private playBeat(step: number) {
        // Simple bass/drum kick
        if (step % 4 === 0) {
            playTone(60, 'sine', 0.1, 0.05); // Kick
        }
        // Sub-bass melody
        const bassLine = [55, 55, 65, 55, 73, 55, 65, 82]; // A1, C2, D2, E2...
        if (step % 2 === 0) {
            playTone(bassLine[step], 'triangle', 0.2, 0.03);
        }
        // High "tink" on upbeat
        if (step % 8 === 4) {
            playTone(1200, 'sine', 0.05, 0.01);
        }
    }
}

export const bgm = new ProceduralMusic();
