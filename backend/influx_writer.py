"""
Grava eventos WebSocket no InfluxDB 3 Core (mesmos pontos do log).
Usa a biblioteca oficial influxdb3-python:
https://docs.influxdata.com/influxdb3/cloud-serverless/reference/client-libraries/v3/python/

Tags: origin, destination, room_id. Timestamp: when. Campo: value (mensagem).

Nota: passar host como URL completa (ex.: http://influxdb:8181) para a lib
extrair hostname e porta corretamente; caso contrário urlparse interpreta
"influxdb:8181" mal e gera URI gRPC inválida (ex.: grpc+tcp://influxdb:8181:443).
"""
import asyncio
import logging

from influxdb_client_3 import InfluxDBClient3, Point

from constants import INFLUX_URL, INFLUX_DATABASE, INFLUX_TABLE, INFLUX_TOKEN

logger = logging.getLogger(__name__)


def _write_sync(origin: str, destination: str, room_id: str, when: str, value: str) -> None:
    """Escreve um ponto no InfluxDB com a lib oficial (síncrono, roda em thread)."""
    if not INFLUX_URL or not INFLUX_TOKEN:
        return
    # URL completa para o host: a lib usa urlparse(host); "http://influxdb:8181" resulta em
    # hostname=influxdb, port=8181. Sem scheme, "influxdb:8181" é mal interpretado e vira :443.
    #host = INFLUX_URL if "://" in INFLUX_URL else f"http://{INFLUX_URL}"
    try:
        with InfluxDBClient3(
            host=INFLUX_URL,
            token=INFLUX_TOKEN,
            database=INFLUX_DATABASE,
        ) as client:
            point = (
                Point(INFLUX_TABLE)
                .tag("origin", origin)
                .tag("destination", destination)
                .tag("room_id", room_id)
                .field("value", value or "")
                .time(when)
            )
            client.write(point, write_precision="ns")
    except Exception as e:
        logger.warning("influx write failed: %s", e)


async def write_event(origin: str, destination: str, room_id: str, when: str, value: str = "") -> None:
    """
    Grava um evento no InfluxDB (mesmos dados do log).
    Não bloqueia: executa a escrita em thread. Ignora se INFLUX_URL/INFLUX_TOKEN não estiverem definidos.
    """
    if not INFLUX_URL or not INFLUX_TOKEN:
        return
    await asyncio.to_thread(_write_sync, origin, destination, room_id, when, value)
