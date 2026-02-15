import pytest
from fastapi.testclient import TestClient
from fastapi.websockets import WebSocket
from room_manager import RoomManager
import asyncio

# Mock WebSocket for testing
class MockWebSocket:
    def __init__(self):
        self.accepted = False
        self.closed = False
        self.sent_messages = []

    async def accept(self):
        self.accepted = True

    async def close(self, code=1000, reason=""):
        self.closed = True
        self.close_code = code
        self.close_reason = reason

    async def send_text(self, message: str):
        self.sent_messages.append(message)

    async def receive_text(self):
        return "test message"

@pytest.mark.asyncio
async def test_room_manager_flow():
    manager = RoomManager()
    room_id = "test-room"

    # User 1 connects
    ws1 = MockWebSocket()
    success1 = await manager.connect(room_id, ws1)
    assert success1 is True
    assert ws1.accepted is True
    assert room_id in manager.rooms
    assert len(manager.rooms[room_id]) == 1

    # User 2 connects
    ws2 = MockWebSocket()
    success2 = await manager.connect(room_id, ws2)
    assert success2 is True
    assert ws2.accepted is True
    assert len(manager.rooms[room_id]) == 2

    # User 3 attempts to connect (should fail)
    ws3 = MockWebSocket()
    success3 = await manager.connect(room_id, ws3)
    assert success3 is False
    assert ws3.accepted is True # Accepted first then closed
    assert ws3.closed is True
    assert ws3.close_code == 4003

    # Broadcast
    await manager.broadcast(room_id, "Hello", ws1)
    assert "Hello" in ws2.sent_messages
    assert "Hello" not in ws1.sent_messages

    # User 1 disconnects
    manager.disconnect(room_id, ws1)
    assert len(manager.rooms[room_id]) == 1

    # User 2 disconnects -> Room should be deleted
    manager.disconnect(room_id, ws2)
    assert room_id not in manager.rooms
