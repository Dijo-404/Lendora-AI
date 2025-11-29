"""
Lendora AI - Agents Module
Privacy-First AI Agents for DeFi Lending

Agents:
- Borrower Agent ("Lenny"): Negotiates loan terms on behalf of borrowers
- Lender Agent ("Luna"): Manages lending pool and evaluates loan requests
"""

from .borrower_agent import create_borrower_agent, monitor_loan_offers
from .lender_agent import create_lender_agent, run_lender_agent, LendingPool

__all__ = [
    # Borrower Agent
    "create_borrower_agent",
    "monitor_loan_offers",
    # Lender Agent
    "create_lender_agent",
    "run_lender_agent",
    "LendingPool",
]
