import os

MAX_MESSAGE_LENGTH = int(os.environ.get("MAX_MESSAGE_LENGTH", "255"))

# InfluxDB 3 Core (opcional: se não definido, não grava no InfluxDB)
INFLUX_URL = os.environ.get("INFLUX_URL", "").rstrip("/")
INFLUX_DATABASE = os.environ.get("INFLUX_DATABASE", "potok")
INFLUX_TABLE = os.environ.get("INFLUX_TABLE", "ws_events")
INFLUX_TOKEN = os.environ.get("INFLUX_TOKEN", "")
