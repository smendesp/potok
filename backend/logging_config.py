"""
Configuração centralizada de logging do backend.
Garante que as linhas de log (ex.: ws action=connect, broadcast, disconnect)
aparecem com formato consistente e nível configurável.
"""
import logging
import sys
import os


def setup_logging() -> None:
    """Configura o logging da aplicação. Chamar no arranque (ex.: main.py)."""
    level_name = os.environ.get("LOG_LEVEL", "INFO").upper()
    level = getattr(logging, level_name, logging.INFO)

    # Formato: timestamp ISO | nível | logger | mensagem
    formatter = logging.Formatter(
        fmt="%(asctime)s | %(levelname)-8s | %(name)s | %(message)s",
        datefmt="%Y-%m-%dT%H:%M:%S",
    )

    handler = logging.StreamHandler(sys.stdout)
    handler.setFormatter(formatter)

    root = logging.getLogger()
    root.setLevel(level)
    # Evitar duplicar handlers se setup_logging for chamado mais de uma vez
    if not root.handlers:
        root.addHandler(handler)

    # Reduzir ruído de libs (uvicorn usa o root logger com nível já definido)
    logging.getLogger("uvicorn.access").setLevel(logging.WARNING)
