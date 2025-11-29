/**
 * Lendora AI - Enhanced Dashboard Layout
 * Complete workflow visualization with real-time updates and rich UI
 */

import { useState, useEffect, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { AgentStatusOrb } from '@/components/3d/AgentStatusOrb';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { AuroraBackground } from '@/components/ui/AuroraBackground';
import { DashboardMetrics } from '@/components/dashboard/DashboardMetrics';
import { AgentConversation } from '@/components/dashboard/AgentConversation';
import { AnalyticsCharts } from '@/components/dashboard/AnalyticsCharts';
import { WorkflowVisualizer } from '@/components/dashboard/WorkflowVisualizer';
import {
    Shield,
    Sparkles,
    Activity,
    TrendingUp,
    CheckCircle2,
    Zap,
    Crown,
    Star
} from 'lucide-react';

interface DashboardStats {
    totalBalance: number;
    activeLoans: number;
    totalProfit: number;
    agentStatus: 'profiting' | 'negotiating' | 'idle' | 'error';
}

interface WorkflowStep {
    step: number;
    name: string;
    status: 'pending' | 'processing' | 'completed';
    details?: Record<string, unknown>;
}

interface Trade {
    id: string;
    timestamp: string;
    type: string;
    principal: number;
    interestRate: number;
    originalRate?: number;
    profit?: number;
    status: string;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:8000/ws';

export default function DashboardLayout() {
    const { theme, setTheme } = useTheme();

    // State
    const [stats, setStats] = useState<DashboardStats>({
        totalBalance: 0,
        activeLoans: 0,
        totalProfit: 0,
        agentStatus: 'idle'
    });
    const [workflowSteps, setWorkflowSteps] = useState<WorkflowStep[]>([]);
    const [trades, setTrades] = useState<Trade[]>([]);
    const [isWorkflowRunning, setIsWorkflowRunning] = useState(false);
    const [, setWs] = useState<WebSocket | null>(null);

    // Initial workflow steps
    const initialSteps: WorkflowStep[] = [
        { step: 1, name: 'Midnight ZK Credit Check', status: 'pending' },
        { step: 2, name: 'Loan Offer Created', status: 'pending' },
        { step: 3, name: 'Open Hydra Head', status: 'pending' },
        { step: 4, name: 'AI Analysis & Negotiation', status: 'pending' },
        { step: 5, name: 'Close Hydra Head', status: 'pending' },
        { step: 6, name: 'Aiken Validator Settlement', status: 'pending' },
    ];

    // WebSocket message handler
    const handleWsMessage = useCallback((message: { type: string; data: Record<string, unknown> }) => {
        switch (message.type) {
            case 'stats_update':
                setStats(message.data as unknown as DashboardStats);
                break;
            case 'agent_status':
                setStats(prev => ({ ...prev, agentStatus: (message.data as { status: string }).status as DashboardStats['agentStatus'] }));
                break;
            case 'workflow_step': {
                const stepData = message.data as unknown as WorkflowStep;
                setWorkflowSteps(prev => {
                    const updated = [...prev];
                    const idx = updated.findIndex(s => s.step === stepData.step);
                    if (idx >= 0) {
                        updated[idx] = { ...updated[idx], ...stepData };
                    }
                    return updated;
                });
                break;
            }
            case 'workflow_complete':
                setIsWorkflowRunning(false);
                fetchTrades();
                break;
        }
    }, []);

    // WebSocket connection
    useEffect(() => {
        const wsUrl = WS_URL || (API_URL.replace(/^http/, 'ws') + '/ws');
        const websocket = new WebSocket(wsUrl);

        websocket.onopen = () => {
            console.log('WebSocket connected');
        };

        websocket.onmessage = (e) => {
            try {
                const message = JSON.parse(e.data);
                handleWsMessage(message);
            } catch (err) {
                console.error('WebSocket message error:', err);
            }
        };

        websocket.onerror = (err) => {
            console.error('WebSocket error:', err);
        };

        websocket.onclose = () => {
            console.log('WebSocket closed');
        };

        setWs(websocket);

        return () => {
            if (websocket.readyState === WebSocket.OPEN) {
                websocket.close();
            }
        };
    }, [handleWsMessage]);

    // Fetch initial data
    useEffect(() => {
        fetchStats();
        fetchTrades();
    }, []);

    const fetchStats = async () => {
        try {
            const res = await fetch(`${API_URL}/api/dashboard/stats`);
            const data = await res.json();
            setStats(data);
        } catch {
            // Use demo data
            setStats({
                totalBalance: 125450.75,
                activeLoans: 8,
                totalProfit: 12543.50,
                agentStatus: 'idle'
            });
        }
    };

    const fetchTrades = async () => {
        try {
            const res = await fetch(`${API_URL}/api/trades/history`);
            const data = await res.json();
            setTrades(data);
        } catch {
            // Demo data
        }
    };

    const simulateWorkflow = async () => {
        for (let i = 0; i < initialSteps.length; i++) {
            setWorkflowSteps(prev => prev.map((s, idx) => ({
                ...s,
                status: idx < i ? 'completed' : idx === i ? 'processing' : 'pending'
            })));
            await new Promise(r => setTimeout(r, 1000));
        }
        setWorkflowSteps(prev => prev.map(s => ({ ...s, status: 'completed' as const })));

        // Add demo trade
        const newTrade: Trade = {
            id: `trade_${Date.now()}`,
            timestamp: new Date().toISOString(),
            type: 'loan_accepted',
            principal: 1000,
            interestRate: 7.5,
            originalRate: 8.5,
            profit: 15,
            status: 'completed'
        };
        setTrades(prev => [newTrade, ...prev]);

        setStats(prev => ({
            ...prev,
            activeLoans: prev.activeLoans + 1,
            totalProfit: prev.totalProfit + newTrade.profit!,
            agentStatus: 'profiting'
        }));
    };

    return (
        <AuroraBackground>
            <div className="min-h-screen p-4 md:p-8">
                {/* Theme Toggle */}
                <div className="fixed top-4 right-4 z-50">
                    <Button
                        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                        variant="outline"
                        size="icon"
                        className="backdrop-blur-xl bg-card/50"
                    >
                        {theme === 'dark' ? <Star className="w-4 h-4" /> : <Crown className="w-4 h-4" />}
                    </Button>
                </div>

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 rounded-xl bg-primary/10 relative">
                            <Shield className="w-8 h-8 text-primary" />
                            <motion.div
                                className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-background"
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            />
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                                    Lendora AI
                                </h1>
                                <motion.div
                                    animate={{ rotate: [0, 10, -10, 0] }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                >
                                    <Sparkles className="w-6 h-6 text-primary" />
                                </motion.div>
                            </div>
                            <div className="flex items-center gap-2">
                                <p className="text-muted-foreground text-lg">
                                    Privacy-First DeFi Lending on Cardano
                                </p>
                                <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-green-500/10 text-green-600 text-xs font-medium">
                                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                                    Live
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Enhanced Dashboard Metrics */}
                <DashboardMetrics stats={stats} />

                {/* Main Content Grid */}
                <div className="grid lg:grid-cols-3 gap-6 mb-8">
                    {/* Agent Status - 3D */}
                    <Card className="glass-card p-4 lg:col-span-1">
                        <div className="flex items-center gap-2 mb-4">
                            <Activity className="w-5 h-5 text-primary" />
                            <h3 className="font-semibold">Agent Status</h3>
                            <div className={`ml-auto w-2 h-2 rounded-full ${stats.agentStatus === 'profiting' ? 'bg-green-500 animate-pulse' :
                                stats.agentStatus === 'negotiating' ? 'bg-blue-500 animate-pulse' :
                                    'bg-gray-400'
                                }`} />
                        </div>
                        <div className="h-48">
                            <Canvas camera={{ position: [0, 0, 5] }}>
                                <ambientLight intensity={0.5} />
                                <AgentStatusOrb status={stats.agentStatus} />
                            </Canvas>
                        </div>
                        <p className="text-center text-xl font-bold capitalize mt-2">
                            {stats.agentStatus}
                        </p>
                    </Card>

                    {/* Workflow Visualizer */}
                    <div className="lg:col-span-2">
                        <WorkflowVisualizer
                            steps={workflowSteps.length > 0 ? workflowSteps : initialSteps}
                            isRunning={isWorkflowRunning}
                            onStepClick={(step) => console.log('Step clicked:', step)}
                            showDetails={true}
                        />
                    </div>
                </div>

                {/* Agent Conversations and Analytics */}
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                    <AgentConversation conversationId={undefined} />

                    {/* Recent Trades */}
                    <Card className="glass-card p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <TrendingUp className="w-5 h-5 text-primary" />
                            <h3 className="text-xl font-bold">Recent Trades</h3>
                        </div>

                        <div className="space-y-3">
                            {trades.length > 0 ? trades.slice(0, 5).map((trade, idx) => (
                                <motion.div
                                    key={trade.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border hover:border-primary/30 transition-colors cursor-pointer"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                                            <CheckCircle2 className="w-5 h-5 text-green-500" />
                                        </div>
                                        <div>
                                            <p className="font-medium">Loan Accepted</p>
                                            <p className="text-sm text-muted-foreground">
                                                {trade.principal} ADA @ {trade.interestRate}%
                                                {trade.originalRate && (
                                                    <span className="text-green-500 ml-2">
                                                        (saved {(trade.originalRate - trade.interestRate).toFixed(1)}%)
                                                    </span>
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        {trade.profit && (
                                            <p className="text-green-500 font-bold">+{trade.profit.toFixed(2)} ADA</p>
                                        )}
                                        <p className="text-xs text-muted-foreground">
                                            {new Date(trade.timestamp).toLocaleDateString()}
                                        </p>
                                    </div>
                                </motion.div>
                            )) : (
                                <div className="text-center py-8">
                                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted/30 flex items-center justify-center">
                                        <TrendingUp className="w-8 h-8 text-muted-foreground" />
                                    </div>
                                    <p className="text-muted-foreground mb-2">No trades yet</p>
                                    <p className="text-xs text-muted-foreground">Start a workflow to see results here</p>
                                </div>
                            )}
                        </div>
                    </Card>
                </div>

                {/* Comprehensive Analytics Charts */}
                <AnalyticsCharts />

                {/* Quick Actions */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="mt-8"
                >
                    <Card className="glass-card p-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-primary/10">
                                    <Zap className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold">Quick Actions</h3>
                                    <p className="text-sm text-muted-foreground">Start a new loan workflow or manage existing ones</p>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <Button
                                    onClick={() => {
                                        setWorkflowSteps(initialSteps);
                                        setIsWorkflowRunning(true);
                                        setTimeout(() => simulateWorkflow(), 1000);
                                    }}
                                    disabled={isWorkflowRunning}
                                    className="bg-primary hover:bg-primary/90"
                                >
                                    {isWorkflowRunning ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            <Zap className="w-4 h-4 mr-2" />
                                            Start Workflow
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </Card>
                </motion.div>
            </div>
        </AuroraBackground>
    );
}
