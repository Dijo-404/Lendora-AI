"""
Lendora AI - FastAPI Backend Server
REST API and WebSocket server for frontend communication
Integrates with AI agents, Hydra, and provides real-time updates
"""

from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
import asyncio
import json
import os
from datetime import datetime
from pydantic import BaseModel
from contextlib import asynccontextmanager

# ============================================================================
# Application Setup
# ============================================================================

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifecycle manager."""
    print("=" * 70)
    print("Lendora AI Backend API Started")
    print("=" * 70)
    print("REST API:    http://localhost:8000")
    print("WebSocket:   ws://localhost:8000/ws")
    print("Docs:        http://localhost:8000/docs")
    print("=" * 70)
    yield
    print("Shutting down Lendora AI Backend...")

app = FastAPI(
    title="Lendora AI API",
    description="Privacy-First DeFi Lending Platform on Cardano",
    version="1.0.0",
    lifespan=lifespan
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================================================================
# Data Models
# ============================================================================

class LoanOffer(BaseModel):
    id: str
    lender_address: str
    principal: float
    initial_interest_rate: float
    term_months: int
    offered_at: str
    status: str = "active"
    collateral_ratio: float = 1.5

class LoanRequest(BaseModel):
    borrower_address: str
    principal: float
    term_months: int
    proposed_rate: float

class Trade(BaseModel):
    id: str
    timestamp: str
    type: str
    principal: float
    interestRate: float
    profit: Optional[float] = None
    status: str

class AgentStatus(BaseModel):
    status: str
    current_task: Optional[str] = None
    last_decision: Optional[str] = None

class DashboardStats(BaseModel):
    totalBalance: float
    activeLoans: int
    totalProfit: float
    agentStatus: str

class XAILog(BaseModel):
    timestamp: float
    decision: str
    reasoning: str
    confidence: float
    agent: str = "borrower"

# ============================================================================
# WebSocket Connection Manager
# ============================================================================

class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []
        self._lock = asyncio.Lock()

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        async with self._lock:
            self.active_connections.append(websocket)
        print(f"[WebSocket] Client connected. Total: {len(self.active_connections)}")

    async def disconnect(self, websocket: WebSocket):
        async with self._lock:
            if websocket in self.active_connections:
                self.active_connections.remove(websocket)
        print(f"[WebSocket] Client disconnected. Total: {len(self.active_connections)}")

    async def broadcast(self, message: dict):
        async with self._lock:
            connections = self.active_connections.copy()
        
        for connection in connections:
            try:
                await connection.send_json(message)
            except Exception:
                # Connection might be closed, remove it
                await self.disconnect(connection)

    async def send_to(self, websocket: WebSocket, message: dict):
        try:
            await websocket.send_json(message)
        except Exception:
            await self.disconnect(websocket)

manager = ConnectionManager()

# ============================================================================
# In-Memory Data Store (Replace with database in production)
# ============================================================================

class DataStore:
    def __init__(self):
        self.loans: List[dict] = [
            {
                "id": "loan_001",
                "lender_address": "addr1_lender_xyz",
                "principal": 1000.0,
                "initial_interest_rate": 8.5,
                "term_months": 12,
                "offered_at": "2025-11-29T12:00:00Z",
                "status": "active",
                "collateral_ratio": 1.5
            }
        ]
        
        self.trades: List[dict] = [
            {
                "id": "trade_001",
                "timestamp": "2025-11-29T10:30:00Z",
                "type": "loan_accepted",
                "principal": 1000.0,
                "interestRate": 7.5,
                "profit": 75.0,
                "status": "completed"
            },
            {
                "id": "trade_002",
                "timestamp": "2025-11-28T15:45:00Z",
                "type": "loan_repaid",
                "principal": 500.0,
                "interestRate": 8.0,
                "profit": 40.0,
                "status": "completed"
            },
            {
                "id": "trade_003",
                "timestamp": "2025-11-27T09:15:00Z",
                "type": "negotiation",
                "principal": 2000.0,
                "interestRate": 6.5,
                "profit": None,
                "status": "pending"
            }
        ]
        
        self.agent_status = {
            "status": "profiting",
            "current_task": "Monitoring new loan offers",
            "last_decision": "Accepted loan at 7.5% APR"
        }
        
        self.stats = {
            "totalBalance": 125450.75,
            "activeLoans": 8,
            "totalProfit": 12543.50,
            "agentStatus": "profiting"
        }

store = DataStore()

# ============================================================================
# Helper Functions
# ============================================================================

def get_log_file_path(filename: str) -> str:
    """Get path to a log file in the logs directory."""
    return os.path.join(
        os.path.dirname(__file__),
        f"../../logs/{filename}"
    )

def read_jsonl_file(filepath: str, limit: int = 50) -> List[dict]:
    """Read entries from a JSONL file."""
    entries = []
    if os.path.exists(filepath):
        try:
            with open(filepath, 'r') as f:
                for line in f:
                    line = line.strip()
                    if line:
                        try:
                            entries.append(json.loads(line))
                        except json.JSONDecodeError:
                            pass
        except IOError:
            pass
    return entries[-limit:]

# ============================================================================
# REST API Endpoints
# ============================================================================

@app.get("/")
async def root():
    """API root - health check."""
    return {
        "message": "Lendora AI API",
        "version": "1.0.0",
        "status": "healthy",
        "timestamp": datetime.now().isoformat()
    }

@app.get("/health")
async def health_check():
    """Detailed health check endpoint."""
    return {
        "status": "healthy",
        "services": {
            "api": "running",
            "websocket": "ready",
            "connections": len(manager.active_connections)
        },
        "timestamp": datetime.now().isoformat()
    }

# --- Loan Endpoints ---

@app.get("/api/loans/offers", response_model=List[LoanOffer])
async def get_loan_offers():
    """Get current loan offers."""
    return store.loans

@app.post("/api/loans/offers", response_model=LoanOffer)
async def create_loan_offer(offer: LoanOffer):
    """Create a new loan offer."""
    offer_dict = offer.model_dump()
    offer_dict["offered_at"] = datetime.now().isoformat()
    store.loans.append(offer_dict)
    
    # Broadcast to WebSocket clients
    await manager.broadcast({
        "type": "new_offer",
        "data": offer_dict
    })
    
    return offer_dict

@app.post("/api/loans/request")
async def request_loan(request: LoanRequest):
    """Submit a loan request (triggers agent negotiation)."""
    # In production, this would queue the request for agent processing
    request_id = f"req_{int(datetime.now().timestamp())}"
    
    response = {
        "request_id": request_id,
        "status": "pending",
        "message": "Loan request submitted. Agent Lenny is analyzing...",
        "request": request.model_dump()
    }
    
    # Broadcast request to connected clients
    await manager.broadcast({
        "type": "loan_request",
        "data": response
    })
    
    return response

# --- Trade Endpoints ---

@app.get("/api/trades/history", response_model=List[Trade])
async def get_trade_history(limit: int = 50):
    """Get trade history."""
    return store.trades[:limit]

@app.post("/api/trades")
async def record_trade(trade: Trade):
    """Record a new trade."""
    trade_dict = trade.model_dump()
    store.trades.insert(0, trade_dict)
    
    # Update stats
    if trade.profit:
        store.stats["totalProfit"] += trade.profit
    
    # Broadcast to WebSocket clients
    await manager.broadcast({
        "type": "new_trade",
        "data": trade_dict
    })
    
    return trade_dict

# --- Agent Endpoints ---

@app.get("/api/agent/status", response_model=AgentStatus)
async def get_agent_status():
    """Get AI agent current status."""
    return store.agent_status

@app.post("/api/agent/status")
async def update_agent_status(status: AgentStatus):
    """Update agent status (called by agent process)."""
    store.agent_status = status.model_dump()
    store.stats["agentStatus"] = status.status
    
    # Broadcast status update
    await manager.broadcast({
        "type": "agent_status",
        "data": {
            **store.agent_status,
            "timestamp": datetime.now().isoformat()
        }
    })
    
    return store.agent_status

@app.get("/api/agent/xai-logs")
async def get_xai_logs(limit: int = 50):
    """Get XAI decision logs."""
    log_file = get_log_file_path("xai_decisions.jsonl")
    logs = read_jsonl_file(log_file, limit)
    return logs

# --- Dashboard Endpoints ---

@app.get("/api/dashboard/stats", response_model=DashboardStats)
async def get_dashboard_stats():
    """Get dashboard statistics."""
    return store.stats

# ============================================================================
# WebSocket Endpoint
# ============================================================================

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    """WebSocket endpoint for real-time updates."""
    await manager.connect(websocket)
    
    try:
        # Send initial status
        await manager.send_to(websocket, {
            "type": "agent_status",
            "data": {
                **store.agent_status,
                "timestamp": datetime.now().isoformat()
            }
        })
        
        # Send current stats
        await manager.send_to(websocket, {
            "type": "stats_update",
            "data": store.stats
        })
        
        # Keep connection alive and handle incoming messages
        while True:
            try:
                # Wait for incoming message with timeout
                data = await asyncio.wait_for(
                    websocket.receive_text(),
                    timeout=30.0
                )
                
                # Handle incoming commands
                try:
                    message = json.loads(data)
                    await handle_ws_message(websocket, message)
                except json.JSONDecodeError:
                    pass
                    
            except asyncio.TimeoutError:
                # Send keepalive ping
                await manager.send_to(websocket, {
                    "type": "ping",
                    "timestamp": datetime.now().isoformat()
                })
                
    except WebSocketDisconnect:
        await manager.disconnect(websocket)
    except Exception as e:
        print(f"[WebSocket] Error: {e}")
        await manager.disconnect(websocket)

async def handle_ws_message(websocket: WebSocket, message: dict):
    """Handle incoming WebSocket messages."""
    msg_type = message.get("type")
    
    if msg_type == "pong":
        # Client responding to ping
        pass
    
    elif msg_type == "subscribe":
        # Client subscribing to specific updates
        channel = message.get("channel")
        print(f"[WebSocket] Client subscribed to: {channel}")
    
    elif msg_type == "get_status":
        # Client requesting current status
        await manager.send_to(websocket, {
            "type": "agent_status",
            "data": {
                **store.agent_status,
                "timestamp": datetime.now().isoformat()
            }
        })

# ============================================================================
# Background Task: Periodic Status Updates
# ============================================================================

async def periodic_updates():
    """Send periodic updates to all connected clients."""
    while True:
        await asyncio.sleep(10)  # Every 10 seconds
        
        if manager.active_connections:
            await manager.broadcast({
                "type": "agent_status",
                "data": {
                    **store.agent_status,
                    "timestamp": datetime.now().isoformat()
                }
            })

@app.on_event("startup")
async def start_background_tasks():
    """Start background tasks on app startup."""
    asyncio.create_task(periodic_updates())

# ============================================================================
# Entry Point
# ============================================================================

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
