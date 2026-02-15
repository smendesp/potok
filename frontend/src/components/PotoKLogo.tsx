/**
 * Logomarca PotoK — logo horizontal (logo_h.svg da pasta inspirações).
 */
import logoHUrl from '@/assets/logo_h.svg'

interface PotoKLogoProps {
    className?: string;
    /** Altura em px; a largura escala proporcionalmente */
    height?: number;
}

export function PotoKLogo({ className = '', height = 28 }: PotoKLogoProps) {
    return (
        <img
            src={logoHUrl}
            alt="PotoK"
            className={className}
            style={{ height }}
            width="auto"
            aria-hidden={false}
        />
    )
}
