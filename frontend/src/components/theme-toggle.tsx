import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSun, faMoon, faCircleHalfStroke, faEye, faPalette } from "@fortawesome/free-solid-svg-icons"
import { useTheme, type Theme } from "./theme-provider"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function ThemeToggle() {
    const { setTheme, theme } = useTheme()

    const themes: { value: Theme; label: string; icon: React.ReactNode }[] = [
        { value: "light", label: "Claro", icon: <FontAwesomeIcon icon={faSun} className="h-4 w-4" /> },
        { value: "dark", label: "Escuro", icon: <FontAwesomeIcon icon={faMoon} className="h-4 w-4" /> },
        { value: "high-contrast", label: "Alto contraste", icon: <FontAwesomeIcon icon={faCircleHalfStroke} className="h-4 w-4" /> },
        { value: "sepia", label: "Sépia", icon: <FontAwesomeIcon icon={faEye} className="h-4 w-4" /> },
        { value: "blue", label: "Azul", icon: <FontAwesomeIcon icon={faPalette} className="h-4 w-4" /> },
    ]

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full h-9 w-9 text-muted-foreground hover:text-foreground">
                    <FontAwesomeIcon icon={faPalette} className="h-4 w-4" />
                    <span className="sr-only">Alterar tema</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[180px]">
                {themes.map((t) => (
                    <DropdownMenuItem
                        key={t.value}
                        onClick={() => setTheme(t.value)}
                        className={theme === t.value ? "text-primary font-medium bg-primary/5" : ""}
                    >
                        <span className="mr-3">{t.icon}</span>
                        <span>{t.label}</span>
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
