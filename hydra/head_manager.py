"""
Lendora AI - Hydra Head Manager
WebSocket client for interacting with a local Hydra Node.
"""

import asyncio
import json
import websockets
from typing import List, Dict, Any


class HydraClient:
    """
    Client for interacting with a local Hydra Node via WebSocket.
    Manages the full lifecycle of a Hydra Head for private loan negotiations.
    """
    
    def __init__(self, hydra_node_url: str = "ws://localhost:4001"):
        """
        Initialize the Hydra client.
        
        Args:
            hydra_node_url: WebSocket URL of the local Hydra node (default: ws://localhost:4001)
        """
        self.hydra_node_url = hydra_node_url
        self.websocket = None
        
    async def _connect(self):
        """Establish WebSocket connection to Hydra node."""
        if self.websocket is None or self.websocket.closed:
            self.websocket = await websockets.connect(self.hydra_node_url)
            print(f"[HydraClient] Connected to Hydra node at {self.hydra_node_url}")
    
    async def _send_command(self, command: Dict[str, Any]) -> Dict[str, Any]:
        """
        Send a command to the Hydra node and await response.
        
        Args:
            command: JSON-RPC style command dictionary
            
        Returns:
            Response from the Hydra node
        """
        await self._connect()
        
        # Send command
        await self.websocket.send(json.dumps(command))
        print(f"[HydraClient] Sent: {command['tag']}")
        
        # Receive response
        response = await self.websocket.recv()
        response_data = json.loads(response)
        print(f"[HydraClient] Received: {response_data.get('tag', 'unknown')}")
        
        return response_data
    
    async def _close(self):
        """Close WebSocket connection."""
        if self.websocket and not self.websocket.closed:
            await self.websocket.close()
            print("[HydraClient] Connection closed")
    
    # ========================================================================
    # Hydra Head Lifecycle Methods
    # ========================================================================
    
    def init_head(self, participants: List[str]) -> Dict[str, Any]:
        """
        Initialize a new Hydra Head with specified participants.
        
        Args:
            participants: List of participant verification key hashes
            
        Returns:
            Response from Hydra node
        """
        command = {
            "tag": "Init",
            "participants": participants
        }
        
        return asyncio.run(self._execute_init(command))
    
    async def _execute_init(self, command: Dict[str, Any]) -> Dict[str, Any]:
        """Async execution of init command."""
        try:
            response = await self._send_command(command)
            return response
        finally:
            await self._close()
    
    def commit_funds(self, utxo: str) -> Dict[str, Any]:
        """
        Commit funds (UTxO) to the Hydra Head.
        
        Args:
            utxo: UTxO reference in format "txhash#index"
            
        Returns:
            Response from Hydra node
        """
        # Parse UTxO
        tx_hash, tx_index = utxo.split("#")
        
        command = {
            "tag": "Commit",
            "utxo": {
                "txHash": tx_hash,
                "index": int(tx_index)
            }
        }
        
        return asyncio.run(self._execute_commit(command))
    
    async def _execute_commit(self, command: Dict[str, Any]) -> Dict[str, Any]:
        """Async execution of commit command."""
        try:
            response = await self._send_command(command)
            return response
        finally:
            await self._close()
    
    def new_tx(self, cbor_hex: str) -> Dict[str, Any]:
        """
        Submit a new transaction to the Hydra Head (e.g., a negotiation bid).
        This happens off-chain within the Head, incurring no gas fees.
        
        Args:
            cbor_hex: Transaction in CBOR hex format
            
        Returns:
            Response from Hydra node
        """
        command = {
            "tag": "NewTx",
            "transaction": cbor_hex
        }
        
        return asyncio.run(self._execute_new_tx(command))
    
    async def _execute_new_tx(self, command: Dict[str, Any]) -> Dict[str, Any]:
        """Async execution of new transaction command."""
        try:
            response = await self._send_command(command)
            return response
        finally:
            await self._close()
    
    def close_head(self) -> Dict[str, Any]:
        """
        Close the Hydra Head and settle the final state on Layer 1.
        This is when the agreed-upon loan terms get committed to the main chain.
        
        Returns:
            Response from Hydra node
        """
        command = {
            "tag": "Close"
        }
        
        return asyncio.run(self._execute_close(command))
    
    async def _execute_close(self, command: Dict[str, Any]) -> Dict[str, Any]:
        """Async execution of close command."""
        try:
            response = await self._send_command(command)
            return response
        finally:
            await self._close()


# ============================================================================
# Helper Functions
# ============================================================================

def create_mock_negotiation_tx(interest_rate: float, borrower: str, lender: str) -> str:
    """
    Create a mock CBOR transaction representing a negotiation bid.
    In production, this would use cardano-cli or a library like PyCardano.
    
    Args:
        interest_rate: Proposed interest rate
        borrower: Borrower's address
        lender: Lender's address
        
    Returns:
        Mock CBOR hex string
    """
    # This is a placeholder. In production, you'd build a real Cardano transaction.
    mock_tx = {
        "type": "LoanNegotiation",
        "borrower": borrower,
        "lender": lender,
        "proposed_interest_rate": interest_rate,
        "timestamp": "2025-11-29T12:50:00Z"
    }
    
    # Convert to hex (mock implementation)
    import binascii
    cbor_hex = binascii.hexlify(json.dumps(mock_tx).encode()).decode()
    
    return cbor_hex


# ============================================================================
# Testing / Demo
# ============================================================================

if __name__ == "__main__":
    print("=" * 70)
    print("Lendora AI - Hydra Head Manager")
    print("=" * 70)
    
    print("\n[WARNING] This requires a running Hydra node at ws://localhost:4001")
    print("[WARNING] Install: https://hydra.family/head-protocol/docs/getting-started\n")
    
    # Example usage
    client = HydraClient()
    
    print("\n[Demo] Example workflow:")
    print("1. client.init_head(['participant1', 'participant2'])")
    print("2. client.commit_funds('abc123...#0')")
    print("3. client.new_tx('84a400...')  # Negotiation bid")
    print("4. client.close_head()  # Settle on L1")
    
    print("\n[Demo] Creating mock negotiation transaction...")
    mock_cbor = create_mock_negotiation_tx(
        interest_rate=7.5,
        borrower="addr1_borrower_xyz",
        lender="addr1_lender_abc"
    )
    print(f"Mock CBOR: {mock_cbor[:80]}...")
