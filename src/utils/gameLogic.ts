export type GameMode = 'math' | 'english';
export type Difficulty = 'easy' | 'medium' | 'hard' | 'insane';
export type Theme = 'park' | 'space' | 'arctic';
export type PowerUpType = 'freeze' | 'shield' | 'double_pull';
export type Side = 'blue' | 'red';

export interface PowerUp {
    id: string;
    type: PowerUpType;
}

export interface Problem {
    question: string;
    answer: string;
    options?: string[]; // For English mode
}

const WORDS = {
    easy: [
        'CAT', 'DOG', 'SUN', 'RED', 'BLUE', 'TREE', 'BOOK', 'FISH', 'BALL', 'CAKE',
        'FROG', 'BIRD', 'MILK', 'COLD', 'FAST', 'SLOW', 'JUMP', 'CHAT', 'STAR', 'MOON',
        'DUCK', 'LION', 'BEAR', 'SHIP', 'BOAT', 'FIRE', 'WIND', 'RAIN', 'SNOW', 'GLAD'
    ],
    medium: [
        'APPLE', 'BANANA', 'CHERRY', 'GRAPE', 'LEMON', 'MANGO', 'ORANGE', 'PEACH', 'ZEBRA', 'PANDA',
        'GUITAR', 'PLANT', 'WINDOW', 'BOTTLE', 'FLOWER', 'BRIDGE', 'CASTLE', 'ROCKET', 'FOREST', 'DESERT',
        'TURTLE', 'RABBIT', 'COFFEE', 'WHEEL', 'HAMMER', 'JOURNAL', 'MARKET', 'OFFICE', 'POCKET', 'SCHOOL'
    ],
    hard: [
        'ELEPHANT', 'GIRAFFE', 'MOUNTAIN', 'COMPUTER', 'DIAMOND', 'DINOSAUR', 'RAINBOW', 'SQUIRREL', 'PLATYPUS', 'ASTRONAUT',
        'EXPLORE', 'FREEDOM', 'GALAXY', 'HARMONY', 'INSPIRE', 'JOURNEY', 'KINGDOM', 'LANTERN', 'MYSTERY', 'NEPTUNE',
        'OPTIMISM', 'PYRAMID', 'QUANTUM', 'RECOVERY', 'SOLITUDE', 'TRIUMPH', 'UNIVERSE', 'VICTORY', 'WHISPER', 'XENON'
    ],
    insane: [
        'ARCHITECTURE', 'ENTREPRENEUR', 'PHILANTHROPY', 'EXTRAORDINARY', 'REVOLUTIONARY', 'METAMORPHOSIS', 'ENVIRONMENTAL', 'COMMUNICATION', 'SYCHRONIZATION', 'CONSCIOUSNESS',
        'ASTROPHYSICS', 'BIOCHEMISTRY', 'CRYPTOGRAPHY', 'CYBERSECURITY', 'EPIDEMIOLOGY', 'FLUORESCENCE', 'GENETICS', 'HIEROGLYPHICS', 'IMMUNOLOGY', 'JURISPRUDENCE',
        'KALEIDOSCOPE', 'LINGUISTICS', 'MICROBIOLOGY', 'NEUROSCIENCE', 'OCEANOGRAPHY', 'PALEONTOLOGY', 'QUANTIFICATION', 'RADIOLOGY', 'SOCIOLOGY', 'THERMODYNAMICS'
    ]
};

export const generateMathProblem = (difficulty: Difficulty): Problem => {
    const opsByDiff = {
        easy: ['+', '-'],
        medium: ['+', '-', '*', '/'],
        hard: ['+', '-', '*', '/', '%'],
        insane: ['+', '-', '*', '/', '%']
    };

    const possibleOps = opsByDiff[difficulty];
    const op = possibleOps[Math.floor(Math.random() * possibleOps.length)];

    let a, b, answer;
    const maxNumber = difficulty === 'easy' ? 10 : difficulty === 'medium' ? 30 : difficulty === 'hard' ? 100 : 999;

    switch (op) {
        case '+':
            a = Math.floor(Math.random() * maxNumber) + 1;
            b = Math.floor(Math.random() * maxNumber) + 1;
            answer = a + b;
            break;
        case '-':
            a = Math.floor(Math.random() * maxNumber) + 1;
            b = Math.floor(Math.random() * a);
            answer = a - b;
            break;
        case '*':
            const multMax = difficulty === 'easy' ? 5 : difficulty === 'medium' ? 12 : difficulty === 'hard' ? 20 : 50;
            a = Math.floor(Math.random() * multMax) + 1;
            b = Math.floor(Math.random() * (difficulty === 'insane' ? 20 : 10)) + 1;
            answer = a * b;
            break;
        case '/':
            const divQuotMax = difficulty === 'medium' ? 10 : difficulty === 'hard' ? 15 : 30;
            const divDivisorMax = difficulty === 'insane' ? 20 : 10;
            b = Math.floor(Math.random() * (divDivisorMax - 2)) + 2;
            answer = Math.floor(Math.random() * divQuotMax) + 1;
            a = b * answer;
            break;
        case '%':
            b = Math.floor(Math.random() * 8) + 3;
            a = Math.floor(Math.random() * (difficulty === 'insane' ? 200 : 50)) + b;
            answer = a % b;
            break;
        default:
            a = 0; b = 0; answer = 0;
    }

    return {
        question: `${a} ${op} ${b} = ?`,
        answer: answer.toString(),
    };
};

export const generateEnglishProblem = (difficulty: Difficulty, exclude: string[] = []): Problem => {
    let wordList = WORDS[difficulty];

    // Filter out excluded words
    const availableWords = wordList.filter(w => !exclude.includes(w));

    // If all words are used, reset but keep simple randomization
    const listToPickFrom = availableWords.length > 0 ? availableWords : wordList;
    const word = listToPickFrom[Math.floor(Math.random() * listToPickFrom.length)];

    const maskIndex = Math.floor(Math.random() * word.length);
    const answer = word[maskIndex];
    const question = word.substring(0, maskIndex) + '_' + word.substring(maskIndex + 1);

    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const options = new Set<string>();
    options.add(answer);

    while (options.size < 4) {
        options.add(alphabet[Math.floor(Math.random() * alphabet.length)]);
    }

    return {
        question,
        answer,
        options: Array.from(options).sort(() => Math.random() - 0.5),
    };
};

export const generateProblem = (mode: GameMode, difficulty: Difficulty, exclude: string[] = []): Problem => {
    return mode === 'math' ? generateMathProblem(difficulty) : generateEnglishProblem(difficulty, exclude);
};
