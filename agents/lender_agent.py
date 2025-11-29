"""
Lendora AI - Lender Agent
A privacy-first AI agent that manages lending operations and negotiates with borrowers.
Uses Llama 3 via Ollama for privacy-preserving local inference.
"""

import json
import time
from typing import Any, Dict, List, Optional
from crewai import Agent, Task, Crew
from crewai.tools import BaseTool
from langchain_openai import ChatOpenAI

# Import shared modules
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from hydra.head_manager import HydraClient

# ============================================================================
# PRIVACY-FIRST CONFIGURATION: Llama 3 via Ollama (Local)
# ============================================================================
llama3_llm = ChatOpenAI(
    model="llama3",
    base_url="http://localhost:11434/v1",
    api_key="sk-no-key-required",
    temperature=0.6,  # Slightly lower for more conservative lending decisions
)


# ============================================================================
# Custom Tools for Lender Agent
# ============================================================================

class RiskAssessmentTool(BaseTool):
    """Tool to assess borrower risk based on available data."""
    
    name: str = "RiskAssessmentTool"
    description: str = (
        "Assesses the risk of a loan based on borrower data, loan terms, and market conditions. "
        "Returns a risk score and recommended interest rate adjustment."
    )
    
    def _run(
        self, 
        borrower_address: str, 
        principal: float, 
        term_months: int,
        credit_eligible: bool = True
    ) -> str:
        """
        Assess loan risk.
        
        Args:
            borrower_address: The borrower's Cardano address
            principal: Requested loan principal in ADA
            term_months: Loan term in months
            credit_eligible: Whether borrower passed ZK credit check
        """
        # Risk calculation logic
        base_risk = 0.3  # Base risk score
        
        # Adjust for principal amount
        if principal > 5000:
            base_risk += 0.2
        elif principal > 1000:
            base_risk += 0.1
        
        # Adjust for term length
        if term_months > 12:
            base_risk += 0.15
        elif term_months > 6:
            base_risk += 0.05
        
        # Adjust for credit eligibility
        if not credit_eligible:
            base_risk += 0.3
        
        # Calculate recommended rate
        base_rate = 5.0  # Base APR
        risk_premium = base_risk * 10  # Risk premium in percentage points
        recommended_rate = base_rate + risk_premium
        
        # Cap the rate
        recommended_rate = min(recommended_rate, 15.0)
        
        risk_level = "low" if base_risk < 0.4 else "medium" if base_risk < 0.6 else "high"
        
        result = {
            "risk_score": round(base_risk, 2),
            "risk_level": risk_level,
            "recommended_rate": round(recommended_rate, 1),
            "max_principal": 10000 if risk_level == "low" else 5000 if risk_level == "medium" else 1000,
            "collateral_required": risk_level != "low",
            "analysis": f"Borrower {borrower_address[:20]}... assessed as {risk_level} risk"
        }
        
        print(f"[RiskAssessment] {result['analysis']} (score: {result['risk_score']})")
        return json.dumps(result)


class LoanOfferTool(BaseTool):
    """Tool to create and broadcast loan offers."""
    
    name: str = "LoanOfferTool"
    description: str = (
        "Creates a loan offer with specified terms and broadcasts it to the lending pool. "
        "Use this when you want to make liquidity available for borrowers."
    )
    
    def _run(
        self,
        principal: float,
        interest_rate: float,
        term_months: int,
        collateral_ratio: float = 1.5
    ) -> str:
        """
        Create a loan offer.
        
        Args:
            principal: Maximum principal to lend (in ADA)
            interest_rate: Annual interest rate (APR)
            term_months: Maximum term in months
            collateral_ratio: Required collateral ratio (e.g., 1.5 = 150%)
        """
        offer_id = f"offer_{int(time.time())}"
        
        offer = {
            "id": offer_id,
            "lender_address": "addr1_lender_demo",  # In production, from wallet
            "principal": principal,
            "interest_rate": interest_rate,
            "term_months": term_months,
            "collateral_ratio": collateral_ratio,
            "status": "active",
            "created_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
            "expires_at": time.strftime(
                "%Y-%m-%dT%H:%M:%SZ", 
                time.gmtime(time.time() + 86400 * 7)  # 7 days
            )
        }
        
        # In production, this would be broadcast to a message queue or smart contract
        log_file = os.path.join(
            os.path.dirname(__file__),
            "../logs/loan_offers.jsonl"
        )
        os.makedirs(os.path.dirname(log_file), exist_ok=True)
        
        with open(log_file, "a") as f:
            f.write(json.dumps(offer) + "\n")
        
        print(f"[LoanOffer] Created offer {offer_id}: {principal} ADA @ {interest_rate}% APR")
        return json.dumps({"success": True, "offer": offer})


class NegotiationTool(BaseTool):
    """Tool to handle negotiation responses in Hydra Head."""
    
    name: str = "NegotiationTool"
    description: str = (
        "Responds to a borrower's negotiation bid in a Hydra Head. "
        "Use this to accept, reject, or counter-offer during private negotiation."
    )
    
    def _run(
        self,
        borrower_bid_rate: float,
        min_acceptable_rate: float,
        action: str = "evaluate"
    ) -> str:
        """
        Handle negotiation.
        
        Args:
            borrower_bid_rate: The rate proposed by the borrower
            min_acceptable_rate: Minimum rate the lender will accept
            action: "accept", "reject", or "counter"
        """
        if action == "evaluate":
            # Auto-determine action based on bid
            spread = borrower_bid_rate - min_acceptable_rate
            
            if spread >= 0:
                action = "accept"
            elif spread >= -1.0:  # Within 1% of min
                action = "counter"
            else:
                action = "reject"
        
        if action == "accept":
            response = {
                "action": "accept",
                "final_rate": borrower_bid_rate,
                "message": f"Accepted loan at {borrower_bid_rate}% APR"
            }
        elif action == "counter":
            counter_rate = (borrower_bid_rate + min_acceptable_rate) / 2
            response = {
                "action": "counter",
                "counter_rate": round(counter_rate, 2),
                "message": f"Counter-offer: {counter_rate}% APR"
            }
        else:
            response = {
                "action": "reject",
                "min_rate": min_acceptable_rate,
                "message": f"Rejected. Minimum acceptable rate is {min_acceptable_rate}% APR"
            }
        
        print(f"[Negotiation] {response['message']}")
        return json.dumps(response)


class XAITool(BaseTool):
    """Explainable AI Tool - Logs reasoning for transparency."""
    
    name: str = "XAITool"
    description: str = (
        "Logs the reasoning behind a lending decision to solve the AI 'black box' problem. "
        "Use this to record why you made a particular choice."
    )
    
    def _run(self, decision: str, reasoning: str, confidence: float) -> str:
        """
        Log a decision with its reasoning.
        """
        log_entry = {
            "timestamp": time.time(),
            "agent": "lender",
            "decision": decision,
            "reasoning": reasoning,
            "confidence": confidence
        }
        
        log_file = os.path.join(
            os.path.dirname(__file__),
            "../logs/xai_decisions.jsonl"
        )
        os.makedirs(os.path.dirname(log_file), exist_ok=True)
        
        with open(log_file, "a") as f:
            f.write(json.dumps(log_entry) + "\n")
        
        print(f"[XAI-Lender] Decision logged: {decision} (confidence: {confidence})")
        return json.dumps({"logged": True, "entry": log_entry})


# ============================================================================
# The Lender Agent: "Luna"
# ============================================================================

def create_lender_agent() -> Agent:
    """
    Create the Luna lender agent.
    
    Returns:
        Agent configured with Llama 3 and lending tools
    """
    return Agent(
        role="Prudent DeFi Lender",
        goal="Maximize returns while minimizing risk through intelligent lending decisions",
        backstory=(
            "You are a sophisticated lender named 'Luna'. "
            "You carefully assess risk and reward, always seeking profitable opportunities "
            "while protecting your capital. You negotiate fairly but firmly, "
            "and you always explain your decisions clearly. "
            "You use Hydra Heads for private negotiations and value transparency."
        ),
        verbose=True,
        allow_delegation=False,
        llm=llama3_llm,
        tools=[RiskAssessmentTool(), LoanOfferTool(), NegotiationTool(), XAITool()]
    )


# ============================================================================
# Lending Pool Management
# ============================================================================

class LendingPool:
    """Manages the lender's liquidity pool and active loans."""
    
    def __init__(self, initial_liquidity: float = 10000.0):
        self.total_liquidity = initial_liquidity
        self.available_liquidity = initial_liquidity
        self.active_loans: List[Dict] = []
        self.loan_history: List[Dict] = []
    
    def allocate_for_loan(self, amount: float) -> bool:
        """Reserve liquidity for a new loan."""
        if amount <= self.available_liquidity:
            self.available_liquidity -= amount
            return True
        return False
    
    def release_liquidity(self, amount: float, profit: float = 0):
        """Return liquidity to the pool (with optional profit)."""
        self.available_liquidity += amount + profit
        self.total_liquidity += profit
    
    def get_stats(self) -> Dict:
        """Get pool statistics."""
        return {
            "total_liquidity": self.total_liquidity,
            "available_liquidity": self.available_liquidity,
            "deployed_liquidity": self.total_liquidity - self.available_liquidity,
            "active_loans": len(self.active_loans),
            "utilization_rate": (1 - self.available_liquidity / self.total_liquidity) * 100
        }


# ============================================================================
# Main Agent Loop
# ============================================================================

def run_lender_agent(pool: Optional[LendingPool] = None) -> None:
    """
    Main loop for the lender agent.
    Listens for loan requests and manages the lending pool.
    """
    print("[Luna] Starting lender agent...")
    
    if pool is None:
        pool = LendingPool(initial_liquidity=10000.0)
    
    # Create the agent
    luna = create_lender_agent()
    
    # Simulated loan request (in production, from message queue)
    mock_request = {
        "borrower_address": "addr1_borrower_xyz",
        "principal": 1000,
        "term_months": 12,
        "proposed_rate": 7.0,
        "credit_eligible": True
    }
    
    print(f"\n[Luna] Received loan request: {json.dumps(mock_request, indent=2)}\n")
    
    # Create task for the agent
    analysis_task = Task(
        description=(
            f"Analyze this loan request and decide whether to accept:\n"
            f"Borrower: {mock_request['borrower_address']}\n"
            f"Principal: {mock_request['principal']} ADA\n"
            f"Term: {mock_request['term_months']} months\n"
            f"Proposed Rate: {mock_request['proposed_rate']}%\n"
            f"Credit Eligible (ZK verified): {mock_request['credit_eligible']}\n\n"
            f"Available Liquidity: {pool.available_liquidity} ADA\n\n"
            f"Steps:\n"
            f"1. Use RiskAssessmentTool to evaluate the borrower\n"
            f"2. Use NegotiationTool to respond to their rate proposal\n"
            f"3. Use XAITool to log your decision with clear reasoning\n"
            f"4. If accepting, confirm the final terms"
        ),
        expected_output=(
            "A clear decision (accept/reject/counter) with reasoning, "
            "the final agreed terms if accepting, "
            "and XAI log entry explaining the decision."
        ),
        agent=luna
    )
    
    # Execute
    crew = Crew(
        agents=[luna],
        tasks=[analysis_task],
        verbose=True
    )
    
    result = crew.kickoff()
    
    print(f"\n[Luna] Analysis complete:")
    print(result)
    print(f"\n[Pool Stats] {json.dumps(pool.get_stats(), indent=2)}")


# ============================================================================
# Entry Point
# ============================================================================

if __name__ == "__main__":
    print("=" * 70)
    print("Lendora AI - Lender Agent (Luna)")
    print("Privacy-First Configuration: Using Llama 3 via Ollama")
    print("=" * 70)
    print("Make sure Ollama is running: ollama serve")
    print("Make sure Llama 3 is installed: ollama pull llama3\n")
    
    run_lender_agent()

