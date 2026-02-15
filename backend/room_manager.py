import asyncio
from fastapi import WebSocket
from typing import Dict, List, Optional
from datetime import datetime, timezone
import logging

from constants import MAX_MESSAGE_LENGTH
from influx_writer import write_event

logger = logging.getLogger(__name__)

def _client_id(websocket: WebSocket) -> str:
    """Identificador da origem/destino a partir do WebSocket (não inclui conteúdo da mensagem)."""
    client = getattr(websocket, "client", None) or (websocket.scope.get("client") if websocket.scope else None)
    if client:
        return f"{client[0]}:{client[1]}"
    return "unknown"


class RoomManager:
    def __init__(self):
        # Maps room_id to a list of active WebSockets
        self.rooms: Dict[str, List[WebSocket]] = {}

    async def connect(self, room_id: str, websocket: WebSocket) -> bool:
        """
        Connects a user to a room.
        Returns True if connection is successful, False if room is full.
        If room doesn't exist, it's created.
        """
        await websocket.accept()
        origin = _client_id(websocket)
        when = datetime.now(timezone.utc).isoformat()

        if room_id not in self.rooms:
            self.rooms[room_id] = []

        destination = f"room:{room_id}"
        # Check capacity
        if len(self.rooms[room_id]) >= 2:
            logger.info("ws action=connect_rejected origin=%s destination=room:%s when=%s", origin, room_id, when)
            asyncio.create_task(write_event(origin, destination, room_id, when, value="Connection rejected"))
            await websocket.close(code=4003, reason="Room is full")
            return False

        self.rooms[room_id].append(websocket)
        logger.info("ws action=connect origin=%s destination=room:%s when=%s", origin, room_id, when)
        asyncio.create_task(write_event(origin, destination, room_id, when, value="Connected"))
        return True

    def disconnect(self, room_id: str, websocket: WebSocket):
        """
        Disconnects a user. If room becomes empty, it is deleted (ephemeral).
        """
        when = datetime.now(timezone.utc).isoformat()
        origin = _client_id(websocket)
        destination = f"room:{room_id}"
        if room_id in self.rooms:
            if websocket in self.rooms[room_id]:
                logger.info("ws action=disconnect origin=%s destination=room:%s when=%s", origin, room_id, when)
                try:
                    asyncio.get_running_loop().create_task(write_event(origin, destination, room_id, when, value="Disconnected"))
                except RuntimeError:
                    pass
                self.rooms[room_id].remove(websocket)

            # If room is empty, delete it
            if not self.rooms[room_id]:
                del self.rooms[room_id]

    async def broadcast(self, room_id: str, message: str, sender: WebSocket):
        """
        Broadcasts a message to all other users in the room.
        """
        when = datetime.now(timezone.utc).isoformat()
        origin = _client_id(sender)
        destination = f"room:{room_id}"
        msg_value = message[:MAX_MESSAGE_LENGTH] if len(message) > MAX_MESSAGE_LENGTH else message
        if room_id in self.rooms:
            recipients = [c for c in self.rooms[room_id] if c != sender]
            logger.info(
                "ws action=broadcast origin=%s destination=room:%s recipients=%s when=%s message=%s",
                origin, room_id, len(recipients), when, msg_value,
            )
            asyncio.create_task(write_event(origin, destination, room_id, when, value=msg_value))
            for connection in recipients:
                await connection.send_text(message)
