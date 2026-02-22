# Backend Dockerfile
FROM python:3.13-slim-bookworm AS builder

WORKDIR /app

# Install uv
COPY --from=ghcr.io/astral-sh/uv:latest /uv /bin/uv

# Compile bytecode
ENV UV_COMPILE_BYTECODE=1
ENV UV_PYTHON_DOWNLOADS=never
ENV UV_PYTHON=python3.13

# Copy dependency files
COPY pyproject.toml uv.lock ./

# Create virtual environment
RUN uv venv .venv

# Install dependencies into a virtual environment
RUN uv sync --frozen --no-install-project

FROM python:3.13-slim-bookworm

WORKDIR /app

# Copy application code
COPY . .

# Copy virtual environment from builder
COPY --from=builder /app/.venv /app/.venv

# Set environment variables
ENV PATH="/app/.venv/bin:$PATH"
ENV PYTHONUNBUFFERED=1
ENV WORKERS=${WORKERS}

# Run the application
CMD /app/.venv/bin/python -m uvicorn main:app --host 0.0.0.0 --port 8000 --workers $WORKERS