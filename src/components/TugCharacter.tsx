import { type Theme } from '../utils/gameLogic';

interface TugCharacterProps {
    team: 'blue' | 'red';
    className?: string;
    theme?: Theme;
}

const TugCharacter: React.FC<TugCharacterProps> = ({ team, className, theme = 'park' }) => {
    // Colors
    const skinTone = "#F5D0A9";
    const shirtColor = team === 'blue' ? "#3498db" : "#e74c3c";
    const pantsColor = "#34495e";
    const hatColor = "#2c3e50"; // Dark base for doppa
    const hatPattern = "#ecf0f1"; // White pattern
    const shoeColor = "#2c3e50";

    const isFlipped = team === 'red';

    return (
        <svg
            viewBox="0 0 100 150"
            width="100" // Default width if className doesn't override
            height="150"
            className={className}
            style={{
                transform: isFlipped ? 'scaleX(-1)' : 'none',
                overflow: 'visible',
                filter: 'drop-shadow(2px 2px 2px rgba(0,0,0,0.2))'
            }}
        >
            {/* Back Leg (Bracing) */}
            <path
                d="M45,90 L20,135 L10,140"
                fill="none"
                stroke={pantsColor}
                strokeWidth="16"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            {/* Front Leg (Planting) */}
            <path
                d="M55,90 L75,135 L85,140"
                fill="none"
                stroke={pantsColor}
                strokeWidth="16"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            {/* Shoes */}
            <path d="M10,140 L25,140 L25,145 L10,145 Z" fill={shoeColor} />
            <path d="M75,140 L95,140 L95,145 L75,145 Z" fill={shoeColor} />

            {/* Torso (Leaning Back) */}
            <path
                d="M50,90 L35,40"
                stroke={shirtColor}
                strokeWidth="22"
                strokeLinecap="round"
            />

            {/* Head/Neck */}
            <circle cx="35" cy="30" r="16" fill={skinTone} />

            {/* Theme Variations */}
            {theme === 'space' && (
                <g>
                    {/* Helmet Glass */}
                    <circle cx="35" cy="30" r="18" fill="rgba(135, 206, 235, 0.3)" stroke="white" strokeWidth="1" />
                    <path d="M42,20 Q48,25 45,35" stroke="white" strokeWidth="1" strokeLinecap="round" opacity="0.5" />
                </g>
            )}

            {theme === 'arctic' && (
                <g>
                    {/* Fluffy Fur Hood (Parka) */}
                    <path
                        d="M18,30 Q15,10 35,8 Q55,10 52,30"
                        stroke="#f1f5f9"
                        strokeWidth="8"
                        fill="none"
                        strokeDasharray="2,1"
                    />
                </g>
            )}

            {/* Face details (Side profile) */}
            <circle cx="44" cy="27" r="1.5" fill="black" /> {/* Eye */}
            <path d="M42,38 Q46,39 45,41" stroke="black" strokeWidth="1" fill="none" /> {/* Mouth */}

            {/* Skullcap (Doppa) - Only for Park */}
            {theme === 'park' && (
                <path
                    d="M21,22 L49,22 L46,12 L24,12 Z"
                    fill={hatColor}
                />
            )}
            {/* Doppa Pattern */}
            {theme === 'park' && (
                <>
                    <circle cx="28" cy="17" r="1.5" fill={hatPattern} />
                    <circle cx="35" cy="17" r="1.5" fill={hatPattern} />
                    <circle cx="42" cy="17" r="1.5" fill={hatPattern} />
                </>
            )}

            {/* Arms (Reaching forward) */}
            {/* Back Arm */}
            <path
                d="M32,45 L75,75"
                stroke={shirtColor}
                strokeWidth="12"
                strokeLinecap="round"
            />
            {/* Front Arm */}
            <path
                d="M42,45 L68,75"
                stroke={shirtColor}
                strokeWidth="12"
                strokeLinecap="round"
            />

            {/* Hands */}
            {/* Back Hand (gripping further forward) */}
            <circle cx="75" cy="75" r="10" fill={skinTone} />
            {/* Front Hand (gripping closer) */}
            <circle cx="68" cy="75" r="10" fill={skinTone} />

        </svg>
    );
};

export default TugCharacter;
