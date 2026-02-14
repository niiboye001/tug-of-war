export type GameMode = 'math' | 'english' | 'geography' | 'science';
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
    options?: string[]; // For modes with choices
}

const WORDS = {
    // ... (existing words)
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

const GEOGRAPHY_DATA = {
    easy: [
        { q: 'What is the capital of France?', a: 'Paris' },
        { q: 'What is the capital of UK?', a: 'London' },
        { q: 'Which continent is Egypt in?', a: 'Africa' },
        { q: 'Which continent is Japan in?', a: 'Asia' },
        { q: 'What is the capital of Italy?', a: 'Rome' },
        { q: 'Largest ocean in the world?', a: 'Pacific' },
        { q: 'Longest river in the world?', a: 'Nile' },
        { q: 'Hottest continent on Earth?', a: 'Africa' },
        { q: 'What is the capital of Spain?', a: 'Madrid' },
        { q: 'Coldest place on Earth?', a: 'Antarctica' }
    ],
    medium: [
        { q: 'Capital of Canada?', a: 'Ottawa' },
        { q: 'Capital of Australia?', a: 'Canberra' },
        { q: 'Which country has the most people?', a: 'India' },
        { q: 'Capital of Germany?', a: 'Berlin' },
        { q: 'Highest mountain in the world?', a: 'Everest' },
        { q: 'Capital of Brazil?', a: 'Brasilia' },
        { q: 'Which river flows through Brazil?', a: 'Amazon' },
        { q: 'Capital of Netherlands?', a: 'Amsterdam' },
        { q: 'Which country is also a continent?', a: 'Australia' },
        { q: 'Capital of Russia?', a: 'Moscow' }
    ],
    hard: [
        { q: 'Capital of Nigeria?', a: 'Abuja' },
        { q: 'Capital of Turkey?', a: 'Ankara' },
        { q: 'Which country is called the Land of Fire and Ice?', a: 'Iceland' },
        { q: 'Capital of South Korea?', a: 'Seoul' },
        { q: 'Which sea is between Europe and Africa?', a: 'Mediterranean' },
        { q: 'Capital of Argentina?', a: 'Buenos Aires' },
        { q: 'Smallest country in the world?', a: 'Vatican City' },
        { q: 'Capital of Switzerland?', a: 'Bern' },
        { q: 'Which desert covers most of North Africa?', a: 'Sahara' },
        { q: 'Capital of Thailand?', a: 'Bangkok' }
    ],
    insane: [
        { q: 'Capital of Kazakhstan?', a: 'Astana' },
        { q: 'Capital of Mongolia?', a: 'Ulaanbaatar' },
        { q: 'Deepest point in the ocean?', a: 'Mariana Trench' },
        { q: 'Capital of Bhutan?', a: 'Thimphu' },
        { q: 'Which country has the most volcanoes?', a: 'Indonesia' },
        { q: 'Capital of Madagascar?', a: 'Antananarivo' },
        { q: 'Which country is the youngest in the world?', a: 'South Sudan' },
        { q: 'Capital of Azerbaijan?', a: 'Baku' },
        { q: 'Largest country by land area in Africa?', a: 'Algeria' },
        { q: 'Capital of Suriname?', a: 'Paramaribo' }
    ]
};

const SCIENCE_DATA = {
    easy: [
        { q: 'What is the symbol for Water?', a: 'H2O' },
        { q: 'Which planet is called the Red Planet?', a: 'Mars' },
        { q: 'What gas do humans breathe in?', a: 'Oxygen' },
        { q: 'How many legs does a spider have?', a: '8' },
        { q: 'What part of the plant grows underground?', a: 'Root' },
        { q: 'Symbol for Gold?', a: 'Au' },
        { q: 'Closest star to Earth?', a: 'Sun' },
        { q: 'What frozen water is called?', a: 'Ice' },
        { q: 'Symbol for Iron?', a: 'Fe' },
        { q: 'Natural satellite of Earth?', a: 'Moon' }
    ],
    medium: [
        { q: 'Which force pulls objects to Earth?', a: 'Gravity' },
        { q: 'What is the center of an atom called?', a: 'Nucleus' },
        { q: 'Gas plants breathe in?', a: 'Carbon Dioxide' },
        { q: 'Planet famous for its rings?', a: 'Saturn' },
        { q: 'Smallest unit of life?', a: 'Cell' },
        { q: 'Symbol for Silver?', a: 'Ag' },
        { q: 'Process plants use to make food?', a: 'Photosynthesis' },
        { q: 'Hottest planet in our solar system?', a: 'Venus' },
        { q: 'What are clouds made of?', a: 'Water' },
        { q: 'Speed of sound travels through?', a: 'Air' }
    ],
    hard: [
        { q: 'Symbol for Lead?', a: 'Pb' },
        { q: 'What is the speed of light approx?', a: '300,000 km/s' },
        { q: 'Who proposed General Relativity?', a: 'Einstein' },
        { q: 'What type of rock is formed by lava?', a: 'Igneous' },
        { q: 'Symbol for Mercury?', a: 'Hg' },
        { q: 'What is the powerhouse of the cell?', a: 'Mitochondria' },
        { q: 'Most abundant gas in Earth atmosphere?', a: 'Nitrogen' },
        { q: 'Symbol for Potassium?', a: 'K' },
        { q: 'Acid found in car batteries?', a: 'Sulfuric' },
        { q: 'Symbol for Sodium?', a: 'Na' }
    ],
    insane: [
        { q: 'Symbol for Tungsten?', a: 'W' },
        { q: 'First element on the periodic table?', a: 'Hydrogen' },
        { q: 'What is the rarest element on Earth?', a: 'Astatine' },
        { q: 'What is the escape velocity of Earth?', a: '11.2 km/s' },
        { q: 'Symbol for Antimony?', a: 'Sb' },
        { q: 'Who discovered Penicillin?', a: 'Fleming' },
        { q: 'Symbol for Tin?', a: 'Sn' },
        { q: 'What scale measures earthquake intensity?', a: 'Richter' },
        { q: 'The only metal that is liquid at room temp?', a: 'Mercury' },
        { q: 'Symbol for Platinum?', a: 'Pt' }
    ]
};

export const generateMathProblem = (difficulty: Difficulty): Problem => {
    // ... (existing logic)
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
    // ... (existing logic)
    let wordList = WORDS[difficulty];
    const availableWords = wordList.filter(w => !exclude.includes(w));
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

export const generateQuizProblem = (mode: 'geography' | 'science', difficulty: Difficulty, exclude: string[] = []): Problem => {
    const data = mode === 'geography' ? GEOGRAPHY_DATA[difficulty] : SCIENCE_DATA[difficulty];
    const availableData = data.filter(d => !exclude.includes(d.q));
    const listToPickFrom = availableData.length > 0 ? availableData : data;
    const item = listToPickFrom[Math.floor(Math.random() * listToPickFrom.length)];

    const options = new Set<string>();
    options.add(item.a);

    // Get random distractors from the same mode/difficulty
    const distractors = data.map(d => d.a).filter(a => a !== item.a);
    while (options.size < 4 && distractors.length > 0) {
        const randIdx = Math.floor(Math.random() * distractors.length);
        options.add(distractors[randIdx]);
        distractors.splice(randIdx, 1);
    }

    return {
        question: item.q,
        answer: item.a,
        options: Array.from(options).sort(() => Math.random() - 0.5),
    };
};

export const generateProblem = (mode: GameMode, difficulty: Difficulty, exclude: string[] = []): Problem => {
    if (mode === 'math') return generateMathProblem(difficulty);
    if (mode === 'english') return generateEnglishProblem(difficulty, exclude);
    return generateQuizProblem(mode as 'geography' | 'science', difficulty, exclude);
};
