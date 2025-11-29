"""
Lendora AI - Borrower Agent
A privacy-first AI agent that negotiates loans in Hydra Heads using Llama 3 (via Ollama).
"""

import json
import time
from typing import Any, Dict
from crewai import Agent, Task, Crew
from crewai.tools import BaseTool
from langchain_openai import ChatOpenAI

# Import our Hydra Head Manager
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from hydra.head_manager import HydraClient


# ============================================================================
# PRIVACY-FIRST CONFIGURATION: Llama 3 via Ollama (Local)
# ============================================================================
llama3_llm = ChatOpenAI(
    model="llama3",  # The model name registered in Ollama
    base_url="http://localhost:11434/v1",  # Local Ollama endpoint
    api_key="NA",  # Not required for local Ollama, but field is mandatory
    temperature=0.7,
)


# ============================================================================
# Custom Tools
# ============================================================================

class HydraTool(BaseTool):
    """Tool to interact with Hydra Head for off-chain negotiation."""
    
    name: str = "HydraTool"
    description: str = (
        "Opens a Hydra Head for off-chain loan negotiation. "
        "Use this when you want to accept a loan offer and negotiate privately."
    )
    
    def _run(self, participants: str, utxo: str, bid_cbor: str) -> str:
        """
        Execute Hydra Head workflow.
        
        Args:
            participants: Comma-separated list of participant addresses
            utxo: UTXO to commit (format: txhash#index)
            bid_cbor: CBOR hex of the negotiation transaction
        """
        try:
            client = HydraClient()
            
            # Initialize Head
            participant_list = participants.split(",")
            init_result = client.init_head(participant_list)
            print(f"[HydraTool] Head initialized: {init_result}")
            
            # Commit funds
            commit_result = client.commit_funds(utxo)
            print(f"[HydraTool] Funds committed: {commit_result}")
            
            # Submit negotiation bid
            tx_result = client.new_tx(bid_cbor)
            print(f"[HydraTool] Negotiation bid submitted: {tx_result}")
            
            return json.dumps({
                "success": True,
                "init": init_result,
                "commit": commit_result,
                "tx": tx_result
            })
        except Exception as e:
            return json.dumps({"success": False, "error": str(e)})


class XAITool(BaseTool):
    """Explainable AI Tool - Logs reasoning for transparency."""
    
    name: str = "XAITool"
    description: str = (
        "Logs the reasoning behind a decision to solve the AI 'black box' problem. "
        "Use this to record why you made a particular choice."
    )
    
    def _run(self, decision: str, reasoning: str, confidence: float) -> str:
        """
        Log a decision with its reasoning.
        
        Args:
            decision: The decision made (e.g., "accept_loan")
            reasoning: Human-readable explanation
            confidence: Confidence score (0.0 - 1.0)
        """
        log_entry = {
            "timestamp": time.time(),
            "decision": decision,
            "reasoning": reasoning,
            "confidence": confidence
        }
        
        # In production, this would go to a database or audit log
        log_file = os.path.join(
            os.path.dirname(__file__), 
            "../logs/xai_decisions.jsonl"
        )
        os.makedirs(os.path.dirname(log_file), exist_ok=True)
        
        with open(log_file, "a") as f:
            f.write(json.dumps(log_entry) + "\n")
        
        print(f"[XAI] Decision logged: {decision} (confidence: {confidence})")
        return json.dumps({"logged": True, "entry": log_entry})


# ============================================================================
# The Borrower Agent: "Lenny"
# ============================================================================

def create_borrower_agent() -> Agent:
    """
    Create the Lenny borrower agent.
    
    Returns:
        Agent configured with Llama 3 and custom tools
    """
    return Agent(
        role="Human-like DeFi Negotiator",
        goal="Negotiate the best loan terms while maintaining privacy and transparency",
        backstory=(
            "You are a savvy human trader named 'Lenny'. "
            "You negotiate hard but politely, always seeking the best deal. "
            "You value privacy and use Hydra Heads for off-chain negotiation. "
            "You explain your reasoning clearly to build trust."
        ),
        verbose=True,
        allow_delegation=False,
        llm=llama3_llm,  # Using local Llama 3
        tools=[HydraTool(), XAITool()]
    )


# ============================================================================
# Loan Offer Monitoring Logic
# ============================================================================

def monitor_loan_offers() -> None:
    """
    Main monitoring loop that listens for loan offers.
    When an offer is received, the agent analyzes it using Llama 3.
    If acceptable, it opens a Hydra Head for private negotiation.
    """
    print("[Lenny] Starting loan offer monitoring...")
    
    # Create the agent
    lenny = create_borrower_agent()
    
    # Simulated offer (in production, this would come from a message queue)
    mock_offer = {
        "lender_address": "addr1_lender_xyz",
        "principal": 1000,  # ADA
        "initial_interest_rate": 8.5,  # %
        "term_months": 12,
        "offered_at": time.time()
    }
    
    print(f"\n[Lenny] Received loan offer: {json.dumps(mock_offer, indent=2)}\n")
    
    # Create a task for the agent to analyze the offer
    analysis_task = Task(
        description=(
            f"Analyze this loan offer and decide whether to accept:\n"
            f"Principal: {mock_offer['principal']} ADA\n"
            f"Interest Rate: {mock_offer['initial_interest_rate']}%\n"
            f"Term: {mock_offer['term_months']} months\n\n"
            f"If acceptable, use the HydraTool to open a negotiation channel. "
            f"Use the XAITool to log your reasoning."
        ),
        expected_output=(
            "A decision (accept/reject) with clear reasoning, "
            "and if accepted, confirmation that Hydra Head was opened."
        ),
        agent=lenny
    )
    
    # Execute the task
    crew = Crew(
        agents=[lenny],
        tasks=[analysis_task],
        verbose=True
    )
    
    result = crew.kickoff()
    
    print(f"\n[Lenny] Analysis complete:")
    print(result)


# ============================================================================
# Entry Point
# ============================================================================

if __name__ == "__main__":
    # Ensure Ollama is running before starting
    print("=" * 70)
    print("Lendora AI - Borrower Agent (Lenny)")
    print("Privacy-First Configuration: Using Llama 3 via Ollama")
    print(f"Ollama Endpoint: {llama3_llm.openai_api_base}")
    print("=" * 70)
    print("\n⚠️  Make sure Ollama is running: ollama serve")
    print("⚠️  Make sure Llama 3 is installed: ollama pull llama3\n")
    
    monitor_loan_offers()
