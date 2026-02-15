/**
 * Logomarca PotoK — usa as cores do tema (index.css).
 * "Poto" em foreground, "K" em destaque primary.
 */
interface PotoKLogoProps {
    className?: string;
    /** Altura do texto em px; escala proporcional */
    height?: number;
}

export function PotoKLogo({ className = '', height = 28 }: PotoKLogoProps) {
    return (
        <svg
            className={className}
            height={height}
            viewBox="0 0 100 28"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-label="PotoK"
        >
            {/* Poto — cor foreground (--foreground) */}
            <text
                x="0"
                y="21"
                fontFamily="'Plus Jakarta Sans', system-ui, sans-serif"
                fontSize="20"
                fontWeight="700"
                fill="hsl(var(--foreground))"
                letterSpacing="-0.02em"
            >
                Poto
            </text>
            {/* K — cor primary, maiúsculo */}
            <text
                x="50"
                y="21"
                fontFamily="'Plus Jakarta Sans', system-ui, sans-serif"
                fontSize="20"
                fontWeight="700"
                fill="hsl(var(--primary))"
                letterSpacing="-0.02em"
            >
                K
            </text>
        </svg>
    );
}
