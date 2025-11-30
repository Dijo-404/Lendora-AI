# Lendora AI

Privacy-First DeFi Lending on Cardano

Lendora is a decentralized lending protocol that uses AI agents to negotiate loans in private Hydra Heads with zero gas fees, employing Midnight zero-knowledge proofs for credit scoring, and featuring an immersive dashboard interface.

## Quick Start

### Docker Deployment (Recommended)

```bash
# Full stack deployment
./deploy.sh

# Or manually
docker-compose up -d

# Production deployment
docker-compose -f docker-compose.prod.yml up -d
```

**Access Points:**
- Frontend: http://localhost:80
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs

### Manual Setup

The system operates in mock mode by default, requiring no Hydra node.

```bash
# Start Backend (auto-detects mock mode)
cd backend/api
uvicorn server:app --host 0.0.0.0 --port 8000

# Start Frontend (separate terminal)
cd frontend/Dashboard
npm run dev

# Access:
# Frontend: http://localhost:8080
# API Docs: http://localhost:8000/docs
```

**Note:** The system automatically falls back to mock Hydra mode when no Hydra node is available. All functionality works identically in mock mode.

## Architecture

The system implements a complete DeFi lending workflow:

```
Borrower → Midnight ZK Check → Lender Offer → AI Analysis → Hydra Negotiation → Aiken Settlement
```

Key components:

- **Midnight Network**: Zero-knowledge credit verification
- **Hydra Heads**: Layer 2 scaling for off-chain negotiations
- **AI Agents**: Automated loan analysis and negotiation
- **Aiken Validators**: On-chain settlement verification

## Technology Stack

### Backend Components

| Component | Technology | Description |
|-----------|------------|-------------|
| AI Agents | CrewAI + Llama 3 | Loan negotiation automation |
| Layer 2 Scaling | Hydra Head Protocol | Zero-gas off-chain negotiations |
| Smart Contracts | Aiken Language | Settlement validation |
| Privacy Layer | Midnight Network | Zero-knowledge proofs |
| API Layer | FastAPI + WebSockets | Real-time communication |

### Frontend Components

| Component | Technology | Description |
|-----------|------------|-------------|
| 3D Interface | React Three Fiber | Immersive data visualization |
| UI Framework | React + TypeScript | Type-safe user interface |
| Build System | Vite | Fast development and bundling |
| Styling | Tailwind CSS | Utility-first CSS framework |
| State Management | React Query | Server state synchronization |

## Key Features

### Complete Lending Workflow

1. **Privacy-Preserving Credit Checks** - Zero-knowledge proofs via Midnight Network
2. **AI-Powered Analysis** - Local Llama 3 model analyzes loan terms
3. **Layer 2 Negotiation** - Zero-gas Hydra Head protocol for off-chain negotiation
4. **Automated Settlement** - Smart contract verification with dual signatures
5. **Real-time Monitoring** - WebSocket-based live updates

### AI Agent System

- **Borrower Agent (Lenny)** - Optimizes loan terms through negotiation
- **Lender Agent (Luna)** - Risk assessment and counter-offer evaluation
- **Explainable AI** - Decision logging with reasoning and confidence scores & confidence

### Frontend Dashboard

- **3D Login Portal** - Holographic cube with particle field
- **Wallet Connection** - Eternl, Nami, and other CIP-30 wallets
- **Role Selection** - Choose to be Borrower or Lender
- **Stablecoin Selection** - USDT, USDC, DAI with liquidity suggestions
- **Auto-Confirm Toggle** - Let AI auto-accept good deals
- **Agent Conversations** - Real-time negotiation chat between agents
- **AI Thoughts** - View Masumi's reasoning and confidence scores
- **Agent Status Orb** - Real-time 3D sphere (green=profiting, blue=negotiating)
- **Workflow Visualizer** - Live step-by-step progress
- **Trade History** - Completed loans with savings shown
- **Dual Themes** - Cyber-Noir (dark) / Foggy Future (light)

## Installation

### Prerequisites

- Node.js 18+
- Python 3.10+
- Ollama (for local AI models)

### Setup

```bash
# Clone repository
git clone <repository-url>
cd Lendora-AI

# Install backend dependencies
pip install -r requirements.txt
pip install -r backend/api/requirements.txt

# Install frontend dependencies
cd frontend/Dashboard
npm install
cd ../..

# Install Ollama and models
curl -fsSL https://ollama.com/install.sh | sh
ollama pull llama3
```

### Running the Application

**Terminal 1 - Backend:**
```bash
cd backend/api
uvicorn server:app --host 0.0.0.0 --port 8000
```

**Terminal 2 - Frontend:**
```bash
cd frontend/Dashboard
npm run dev
```

**Terminal 3 - Ollama:**
```bash
ollama serve
```

### Access Points

| Service | URL |
|---------|-----|
| Frontend | http://localhost:8080 |
| Backend API | http://localhost:8000 |
| API Documentation | http://localhost:8000/docs |
| Ollama API | http://localhost:11434 |

### First Use

1. Install a Cardano wallet (Eternl recommended)
2. Open http://localhost:8080
3. Connect your wallet
4. Select borrower or lender role
5. Start a loan workflow

## API Reference

### Core Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/workflow/start` | POST | Initiate complete lending workflow |
| `/api/dashboard/stats` | GET | Get dashboard statistics |
| `/api/trades/history` | GET | Retrieve trade history |
| `/api/agent/status` | GET | Check AI agent status |
| `/api/midnight/credit-check` | POST | Perform ZK credit verification |
| `/ws` | WebSocket | Real-time updates |

### Example API Call

```bash
curl -X POST http://localhost:8000/api/workflow/start \
  -H "Content-Type: application/json" \
  -d '{
    "borrower_address": "addr1_borrower",
    "lender_address": "addr1_lender",
    "credit_score": 750,
    "principal": 1000,
    "interest_rate": 8.5,
    "term_months": 12
  }'
```

## Project Structure

```
Lendora-AI/
├── agents/                      # AI agent implementations
│   ├── borrower_agent.py       # Borrower negotiation agent
│   ├── lender_agent.py         # Lender evaluation agent
│   └── masumi/                 # Masumi Cardano analysis tools
├── backend/
│   ├── api/server.py           # FastAPI backend server
│   └── cardano/                # Cardano transaction builders
├── contracts/                  # Aiken smart contracts
├── frontend/Dashboard/         # React frontend application
├── hydra/                      # Hydra Head protocol client
└── docs/                       # Documentation and guides
```

## Smart Contracts

### Aiken Settlement Validator

Validates loan settlements with dual signature verification:

```aiken
validator {
  fn settle(datum: LoanDatum, redeemer: SettleLoan, context: ScriptContext) -> Bool {
    let interest_rate_valid = redeemer.final_interest_rate >= 0 &&
                              redeemer.final_interest_rate <= 10000
    let signed_by_borrower = list.has(transaction.extra_signatories, datum.borrower)
    let signed_by_lender = list.has(transaction.extra_signatories, datum.lender)

    interest_rate_valid && signed_by_borrower && signed_by_lender
  }
}
```

### Midnight ZK Circuit

Zero-knowledge credit eligibility verification:

```compact
circuit check_eligibility(private credit_score: Uint) -> (public is_eligible: Boolean) {
    const MIN_CREDIT_SCORE: Uint = 700;
    is_eligible = credit_score > MIN_CREDIT_SCORE;
    return (is_eligible);
}
```

## Explainable AI

All AI decisions are logged with reasoning and confidence scores for transparency and auditability.

## Wallet Integration

Lendora AI supports CIP-30 compatible Cardano wallets including Eternl, Nami, Yoroi, and Flint.

### Connecting a Wallet

1. Install a Cardano wallet extension (Eternl recommended)
2. Create or import a wallet
3. Ensure the wallet is unlocked
4. Click "Connect Wallet" in the application
5. Select your wallet and approve the connection

### Supported Features

- Real-time balance display
- Network detection (Mainnet/Testnet)
- Role selection (Borrower/Lender)
- Transaction monitoring
- Manual address entry option

## Development

### Environment Configuration

Optional environment variables can be set in a `.env` file:

```env
# Backend Configuration
OLLAMA_BASE_URL=http://localhost:11434
HYDRA_NODE_URL=ws://127.0.0.1:4001
HYDRA_MODE=auto
PORT=8000

# Frontend Configuration
VITE_API_URL=http://localhost:8000
VITE_WS_URL=ws://localhost:8000/ws
```

### Testing

```bash
# Run contract tests
cd contracts/contracts
aiken check

# Test Python syntax
python -m py_compile agents/*.py backend/api/server.py

# Build frontend
cd frontend/Dashboard
npm run build
```

## Hydra Configuration

The system automatically uses mock mode when no Hydra node is available. For production deployment with real Hydra nodes, see `docs/HYDRA_SETUP.md`.

## Resources

- [Hydra Head Protocol](https://hydra.family/head-protocol/)
- [Aiken Smart Contracts](https://aiken-lang.org/)
- [Midnight Network](https://midnight.network/)
- [CrewAI Framework](https://docs.crewai.com/)
- [Ollama](https://ollama.com/)

## Deployment

### Docker

```bash
# Development
./deploy.sh

# Production
./deploy.sh prod
```

### Manual Deployment

See `docs/DEPLOYMENT.md` for detailed deployment instructions.

## License

MIT License
