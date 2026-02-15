import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faUserSecret, faClock, faShieldHalved } from '@fortawesome/free-solid-svg-icons';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { PotoKLogo } from '@/components/PotoKLogo';
import { getApiUrl } from '@/config/env';

export function Home() {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const createRoom = async () => {
        setLoading(true);
        try {
            const response = await fetch(getApiUrl('api/rooms'), {
                method: 'POST',
            });
            const data = await response.json();
            navigate(`/room/${data.room_id}`);
        } catch (error) {
            console.error('Failed to create room:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground antialiased">
            {/* Barra superior — logo + tema */}
            <header className="sticky top-0 z-20 flex items-center justify-between border-b border-border bg-card/95 px-4 py-3 backdrop-blur-sm sm:px-6">
                <div className="flex items-center gap-3">
                    <PotoKLogo height={28} className="shrink-0" />
                </div>
                <ThemeToggle />
            </header>

            {/* Background decorativo */}
            <div className="fixed inset-0 -z-10 overflow-hidden" aria-hidden>
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_100%_80%_at_50%_-20%,hsl(var(--primary)/0.15),transparent_50%)]" />
                <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border)/0.5)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.5)_1px,transparent_1px)] bg-[size:32px_32px] opacity-50" />
            </div>

            <main className="relative z-10 flex flex-col">
                {/* Hero */}
                <section className="flex flex-col items-center px-6 pt-14 pb-16 sm:pt-20 sm:pb-20">
                    <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-primary/20 shadow-lg shadow-primary/20 ring-2 ring-primary/30 sm:h-28 sm:w-28">
                        <FontAwesomeIcon icon={faLock} className="h-12 w-12 text-primary sm:h-14 sm:w-14" />
                    </div>
                    <h1 className="mt-8 text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl">
                        Chat sem rastros
                    </h1>
                    <p className="mt-3 max-w-lg text-center text-lg font-medium text-muted-foreground sm:text-xl">
                        Anônimo, efêmero e seguro. Sem histórico — só a conversa.
                    </p>
                    <Button
                        onClick={createRoom}
                        disabled={loading}
                        className="mt-10 h-14 rounded-2xl px-10 text-lg font-semibold shadow-lg shadow-primary/25 transition-all hover:scale-[1.02] hover:shadow-xl hover:shadow-primary/30 active:scale-[0.98]"
                        size="lg"
                    >
                        {loading ? 'Criando sala...' : 'Criar sala secreta'}
                    </Button>
                </section>

                {/* Features */}
                <section className="px-6 pb-20">
                    <div className="mx-auto grid max-w-5xl gap-8 sm:grid-cols-3">
                        <article className="flex flex-col items-center rounded-2xl border border-border bg-card p-8 text-center shadow-xl shadow-black/10 transition-all hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/5 dark:shadow-black/30">
                            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/15 text-primary">
                                <FontAwesomeIcon icon={faUserSecret} className="h-7 w-7" />
                            </span>
                            <h2 className="mt-4 text-xl font-bold text-foreground">Anônimo</h2>
                            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                                Nada de cadastro. Apenas você e quem você convidar.
                            </p>
                        </article>
                        <article className="flex flex-col items-center rounded-2xl border border-border bg-card p-8 text-center shadow-xl shadow-black/10 transition-all hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/5 dark:shadow-black/30">
                            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/15 text-primary">
                                <FontAwesomeIcon icon={faClock} className="h-7 w-7" />
                            </span>
                            <h2 className="mt-4 text-xl font-bold text-foreground">Efêmero</h2>
                            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                                Mensagens não são salvas. Ao sair, a conversa some.
                            </p>
                        </article>
                        <article className="flex flex-col items-center rounded-2xl border border-border bg-card p-8 text-center shadow-xl shadow-black/10 transition-all hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/5 dark:shadow-black/30">
                            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/15 text-primary">
                                <FontAwesomeIcon icon={faShieldHalved} className="h-7 w-7" />
                            </span>
                            <h2 className="mt-4 text-xl font-bold text-foreground">Seguro</h2>
                            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                                Conexão privada. Máximo de 2 pessoas por sala.
                            </p>
                        </article>
                    </div>
                </section>

                <footer className="border-t border-border bg-card/80 py-6 text-center backdrop-blur-sm">
                    <p className="text-sm font-medium text-muted-foreground">
                        Potok — mensagens instantâneas, sem rastro.
                    </p>
                </footer>
            </main>
        </div>
    );
}
