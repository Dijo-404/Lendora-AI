/**
 * Lendora AI - Enhanced Agent Conversation Viewer
 * Shows negotiation chat between agents with rich icons and animations
 */

import { useState, useEffect, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Bot,
    User,
    Brain,
    Sparkles,
    CheckCircle2,
    Clock,
    ArrowRight,
    MessageCircle,
    Zap
} from 'lucide-react';

interface ConversationMessage {
    id: string;
    timestamp: string;
    agent: 'lenny' | 'luna' | 'system';
    type: 'message' | 'thought' | 'action';
    content: string;
    confidence?: number;
    reasoning?: string;
}

interface AgentConversationProps {
    conversationId?: string;
}

export function AgentConversation({ conversationId }: AgentConversationProps) {
    const [messages, setMessages] = useState<ConversationMessage[]>([]);
    const [activeTab, setActiveTab] = useState<'conversation' | 'thoughts'>('conversation');

    const fetchConversation = useCallback(async () => {
        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
            const endpoint = conversationId ? `${apiUrl}/api/conversation/${conversationId}` : `${apiUrl}/api/conversation/latest`;
            const res = await fetch(endpoint);
            if (res.ok) {
                const data = await res.json();
                if (data.messages && data.messages.length > 0) {
                    setMessages(data.messages);
                    return;
                }
            }
            // Mock data for demo
            generateMockMessages();
        } catch (err) {
            console.error('Failed to fetch conversation:', err);
            generateMockMessages();
        }
    }, [conversationId]);

    useEffect(() => {
        fetchConversation();
        // Poll for updates every 5 seconds
        const interval = setInterval(fetchConversation, 5000);
        return () => clearInterval(interval);
    }, [fetchConversation]);

    const generateMockMessages = () => {
        const mockMessages: ConversationMessage[] = [
            {
                id: '1',
                timestamp: new Date().toISOString(),
                agent: 'system',
                type: 'message',
                content: 'Loan workflow started. Role: borrower, Stablecoin: ADA, Principal: 1000'
            },
            {
                id: '2',
                timestamp: new Date().toISOString(),
                agent: 'lenny',
                type: 'thought',
                content: 'Analyzing offer... Market average is 7.5%. This rate is 8.5% above average.',
                confidence: 0.85,
                reasoning: 'Rate is acceptable but could be negotiated lower'
            },
            {
                id: '3',
                timestamp: new Date().toISOString(),
                agent: 'lenny',
                type: 'message',
                content: 'Counter-offer: 7.5% interest rate. This is more aligned with current market conditions.'
            },
            {
                id: '4',
                timestamp: new Date().toISOString(),
                agent: 'luna',
                type: 'thought',
                content: 'Evaluating borrower offer... Risk assessment shows medium risk, recommended rate is 7.8%.',
                confidence: 0.92,
                reasoning: 'Offer is within acceptable range'
            },
            {
                id: '5',
                timestamp: new Date().toISOString(),
                agent: 'luna',
                type: 'message',
                content: 'Accepted! Final rate: 7.5%'
            }
        ];
        setMessages(mockMessages);
    };

    const getAgentIcon = (agent: string) => {
        const iconClass = "w-5 h-5";
        const containerClass = `w-8 h-8 rounded-full flex items-center justify-center relative`;

        switch (agent) {
            case 'lenny':
                return (
                    <motion.div className={`${containerClass} bg-blue-500/20`}>
                        <Bot className={`${iconClass} text-blue-500`} />
                        <motion.div
                            className="absolute -bottom-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-background"
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        />
                    </motion.div>
                );
            case 'luna':
                return (
                    <motion.div className={`${containerClass} bg-green-500/20`}>
                        <User className={`${iconClass} text-green-500`} />
                        <motion.div
                            className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background"
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                        />
                    </motion.div>
                );
            case 'system':
                return (
                    <motion.div className={`${containerClass} bg-muted`}>
                        <MessageCircle className={`${iconClass} text-muted-foreground`} />
                    </motion.div>
                );
            default:
                return (
                    <motion.div className={`${containerClass} bg-purple-500/20`}>
                        <Sparkles className={`${iconClass} text-purple-500`} />
                    </motion.div>
                );
        }
    };

    const getAgentName = (agent: string) => {
        switch (agent) {
            case 'lenny': return 'Lenny (Borrower Agent)';
            case 'luna': return 'Luna (Lender Agent)';
            case 'system': return 'System';
            default: return agent;
        }
    };

    const getAgentColor = (agent: string) => {
        switch (agent) {
            case 'lenny': return 'text-blue-500 bg-blue-500/20 border-blue-500/30';
            case 'luna': return 'text-purple-500 bg-purple-500/20 border-purple-500/30';
            case 'system': return 'text-gray-500 bg-gray-500/20 border-gray-500/30';
            default: return 'text-muted-foreground bg-muted/20';
        }
    };

    const filteredMessages = messages.filter(msg =>
        activeTab === 'conversation' ? msg.type !== 'thought' : msg.type === 'thought'
    );

    return (
        <Card className="glass-card p-4 h-96">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                        <Bot className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold">AI Agent Conversation</h3>
                        <p className="text-xs text-muted-foreground">Lenny & Luna negotiation chat</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <motion.div
                        className="w-2 h-2 rounded-full bg-green-500 animate-pulse"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    />
                    <span className="text-xs font-medium text-green-500">Live</span>
                </div>
            </div>

            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'conversation' | 'thoughts')}>
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="conversation" className="flex items-center gap-2">
                        <MessageCircle className="w-4 h-4" />
                        Negotiation Chat
                    </TabsTrigger>
                    <TabsTrigger value="thoughts" className="flex items-center gap-2">
                        <Brain className="w-4 h-4" />
                        AI Thoughts
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="conversation" className="mt-4">
                    <ScrollArea className="h-80">
                        <div className="space-y-3 pr-4">
                            <AnimatePresence>
                                {filteredMessages.map((msg, idx) => (
                                    <motion.div
                                        key={msg.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        className={`flex gap-3 p-4 rounded-xl border transition-all duration-300 ${
                                            msg.type === 'thought' ? 'bg-muted/30' : ''
                                        } ${getAgentColor(msg.agent)}`}
                                    >
                                        <div className="flex-shrink-0 mt-1">
                                            {getAgentIcon(msg.agent)}
                                        </div>

                                        <div className="flex-1">
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-semibold text-sm">
                                                        {getAgentName(msg.agent)}
                                                    </span>
                                                    {msg.type === 'thought' && (
                                                        <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-purple-500/10 text-purple-600 text-xs">
                                                            <Brain className="w-3 h-3" />
                                                            AI Thought
                                                        </div>
                                                    )}
                                                    {msg.type === 'action' && (
                                                        <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-orange-500/10 text-orange-600 text-xs">
                                                            <Zap className="w-3 h-3" />
                                                            Action
                                                        </div>
                                                    )}
                                                </div>
                                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                    <Clock className="w-3 h-3" />
                                                    {new Date(msg.timestamp).toLocaleTimeString()}
                                                </span>
                                            </div>

                                            <p className="text-sm leading-relaxed">{msg.content}</p>

                                            {msg.type === 'thought' && msg.confidence && (
                                                <div className="flex items-center gap-3 mt-3">
                                                    <div className="flex items-center gap-2">
                                                        <Brain className="w-4 h-4 text-purple-500" />
                                                        <span className="text-xs text-purple-500 font-medium">
                                                            Confidence: {(msg.confidence * 100).toFixed(0)}%
                                                        </span>
                                                    </div>

                                                    {msg.reasoning && (
                                                        <div className="flex items-center gap-2">
                                                            <Sparkles className="w-4 h-4 text-cyan-500" />
                                                            <span className="text-xs text-cyan-500">
                                                                {msg.reasoning}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            {msg.type === 'action' && (
                                                <div className="flex items-center gap-2 mt-2">
                                                    <ArrowRight className="w-4 h-4 text-orange-500" />
                                                    <span className="text-xs text-orange-500 font-medium">
                                                        Executing transaction...
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </ScrollArea>
                </TabsContent>

                <TabsContent value="thoughts" className="mt-4">
                    <ScrollArea className="h-80">
                        <div className="space-y-3 pr-4">
                            <AnimatePresence>
                                {filteredMessages.map((msg, idx) => (
                                    <motion.div
                                        key={msg.id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        className={`p-4 rounded-xl border bg-purple-500/5 border-purple-500/20`}
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className="flex-shrink-0">
                                                <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                                                    <Brain className="w-4 h-4 text-purple-500" />
                                                </div>
                                            </div>

                                            <div className="flex-1">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="font-semibold text-sm text-purple-600">
                                                        {getAgentName(msg.agent)} - AI Reasoning
                                                    </span>
                                                    <span className="text-xs text-muted-foreground">
                                                        {new Date(msg.timestamp).toLocaleTimeString()}
                                                    </span>
                                                </div>

                                                <p className="text-sm leading-relaxed mb-3">{msg.content}</p>

                                                {msg.confidence && (
                                                    <div className="flex items-center gap-2">
                                                        <div className="flex items-center gap-2">
                                                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                                                            <span className="text-xs text-green-500 font-medium">
                                                                Confidence: {(msg.confidence * 100).toFixed(0)}%
                                                            </span>
                                                        </div>

                                                        {msg.reasoning && (
                                                            <div className="flex items-center gap-2">
                                                                <Sparkles className="w-4 h-4 text-cyan-500" />
                                                                <span className="text-xs text-cyan-500">
                                                                    {msg.reasoning}
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </ScrollArea>
                </TabsContent>
            </Tabs>
        </Card>
    );
}
