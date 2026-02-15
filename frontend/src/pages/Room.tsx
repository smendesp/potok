import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faPaperPlane,
    faCopy,
    faArrowLeft,
    faLock,
    faUser,
} from '@fortawesome/free-solid-svg-icons';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getWebSocketUrl, MAX_MESSAGE_LENGTH } from '@/config/env';
import { generateId } from '@/lib/utils';
import { PotoKLogo } from '@/components/PotoKLogo';

type Message = {
    id: string;
    text: string;
    isMe: boolean;
    timestamp: number;
};

function formatMessageDate(timestamp: number) {
    const d = new Date(timestamp);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    if (diffDays === 1) return 'Ontem';
    if (diffDays < 7) return `${diffDays} dias atrás`;
    return d.toLocaleDateString([], { day: '2-digit', month: 'short' });
}

export function Room() {
    const { roomId } = useParams();
    const navigate = useNavigate();
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [status, setStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');
    const wsRef = useRef<WebSocket | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (!roomId) return;

        const ws = new WebSocket(getWebSocketUrl(roomId));
        wsRef.current = ws;

        ws.onopen = () => setStatus('connected');
        ws.onmessage = (event) => {
            setMessages((prev) => [
                ...prev,
                { id: generateId(), text: event.data, isMe: false, timestamp: Date.now() },
            ]);
        };
        ws.onclose = () => setStatus('disconnected');

        return () => {
            ws.close();
        };
    }, [roomId]);

    const sendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!input.trim() || status !== 'connected') return;
        const text = input.trim().slice(0, MAX_MESSAGE_LENGTH);
        wsRef.current?.send(text);
        setMessages((prev) => [
            ...prev,
            { id: generateId(), text, isMe: true, timestamp: Date.now() },
        ]);
        setInput('');
    };

    const copyLink = () => navigator.clipboard.writeText(window.location.href);
    const leaveRoom = () => navigate('/');

    return (
        <div className="flex h-screen flex-col bg-background text-foreground">
            {/* Barra superior — voltar | logo | ações */}
            <header className="flex shrink-0 items-center justify-between border-b border-border bg-card px-4 py-3">
                <div className="flex items-center gap-3">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={leaveRoom}
                        className="h-9 w-9 shrink-0 rounded-full text-muted-foreground hover:text-foreground"
                    >
                        <FontAwesomeIcon icon={faArrowLeft} className="h-4 w-4" />
                    </Button>
                    <PotoKLogo height={28} className="shrink-0" />
                </div>

                <div className="flex items-center gap-1">
                    <ThemeToggle />
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={copyLink}
                        className="h-9 w-9 rounded-full text-muted-foreground hover:text-foreground"
                        title="Copiar link"
                    >
                        <FontAwesomeIcon icon={faCopy} className="h-4 w-4" />
                    </Button>
                </div>
            </header>

            {/* Painel de conversa — fundo claro, estilo referência */}
            <div className="flex flex-1 flex-col min-h-0 bg-chatPanel">
                <ScrollArea className="flex-1">
                    <div className="mx-auto max-w-3xl px-4 py-6">
                        {messages.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-20 text-center">
                                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-chatBubbleIn text-chatBubbleIn-foreground/70">
                                    <FontAwesomeIcon icon={faLock} className="h-8 w-8" />
                                </div>
                                <p className="mt-4 font-semibold text-foreground">Conversa criptografada</p>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    As mensagens desaparecem ao sair.
                                </p>
                            </div>
                        )}

                        <div className="flex flex-col gap-4">
                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={cn(
                                        'flex w-full animate-slide-in',
                                        msg.isMe ? 'flex-row-reverse' : 'flex-row'
                                    )}
                                >
                                    {!msg.isMe && (
                                        <div className="mr-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-chatBubbleIn text-chatBubbleIn-foreground">
                                            <FontAwesomeIcon icon={faUser} className="h-3.5 w-3.5" />
                                        </div>
                                    )}
                                    <div className={cn('flex max-w-[85%] flex-col sm:max-w-[75%]', msg.isMe && 'items-end')}>
                                        <div
                                            className={cn(
                                                'rounded-2xl px-4 py-2.5 text-sm leading-relaxed',
                                                msg.isMe
                                                    ? 'bg-chatBubbleOut text-chatBubbleOut-foreground rounded-br-md'
                                                    : 'bg-chatBubbleIn text-chatBubbleIn-foreground rounded-bl-md'
                                            )}
                                        >
                                            {msg.text}
                                        </div>
                                        <span className="mt-1 text-xs text-muted-foreground">
                                            {formatMessageDate(msg.timestamp)}
                                        </span>
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>
                    </div>
                </ScrollArea>

                {/* Barra de digitação — estilo referência: campo + ícone anexo + enviar */}
                <div className="shrink-0 border-t border-border bg-card px-4 py-3">
                    <form
                        action="javascript:void(0)"
                        onSubmit={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            sendMessage(e);
                            return false;
                        }}
                        className="mx-auto max-w-3xl"
                    >
                        <div className="flex items-center gap-2">
                            <p className="mt-1.5 text-right text-xs text-muted-foreground" aria-live="polite">
                                {input.length} / {MAX_MESSAGE_LENGTH}
                            </p>                            
                            <Input
                                value={input}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value.slice(0, MAX_MESSAGE_LENGTH))}
                                placeholder="Digite uma mensagem..."
                                disabled={status !== 'connected'}
                                maxLength={MAX_MESSAGE_LENGTH}
                                className="min-w-0 flex-1 rounded-2xl border-border bg-muted/50 py-6 placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-primary/30"
                            />
                            <Button
                                type="submit"
                                disabled={!input.trim() || status !== 'connected'}
                                size="icon"
                                className="h-10 w-10 shrink-0 rounded-full bg-chatBubbleOut text-chatBubbleOut-foreground hover:opacity-90"
                            >
                                <FontAwesomeIcon icon={faPaperPlane} className="h-4 w-4" />
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
