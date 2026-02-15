from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from snowflake import SnowflakeGenerator
import uvicorn
import os

from logging_config import setup_logging
from constants import MAX_MESSAGE_LENGTH

setup_logging()

app = FastAPI(title="PotoK API", description="Anonymous ephemeral chat API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Snowflake generator instance
# You might want to configure the instance_id based on env vars
gen = SnowflakeGenerator(instance=1)

@app.get("/")
async def root():
    return {"message": "Welcome to Potok API"}

@app.get("/api/health")
async def health_check():
    return {"status": "ok"}

@app.post("/api/rooms")
async def create_room():
    room_id = next(gen)
    return {"room_id": str(room_id)}

from room_manager import RoomManager

# ... (Previous code remains)

manager = RoomManager()


@app.websocket("/ws/{room_id}")
async def websocket_endpoint(websocket: WebSocket, room_id: str):
    success = await manager.connect(room_id, websocket)
    if not success:
        return # Connection closed in manager

    try:
        while True:
            data = await websocket.receive_text()
            if len(data) > MAX_MESSAGE_LENGTH:
                data = data[:MAX_MESSAGE_LENGTH]
            await manager.broadcast(room_id, data, websocket)
    except WebSocketDisconnect:
        manager.disconnect(room_id, websocket)
        # Optional: Notify other user about disconnection
        # await manager.broadcast(room_id, "User left", None) 


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
