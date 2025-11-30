import { useState, useEffect, useRef, useCallback } from 'react';

interface AgentStatus {
  status: 'idle' | 'negotiating' | 'analyzing';
  task?: string;
}

interface Conversation {
  conversation_id: string;
  messages: Array<{
    id: string;
    timestamp: string;
    agent: string;
    type: 'message' | 'thought' | 'action';
    content: string;
    confidence?: number;
    reasoning?: string;
  }>;
}

interface HydraStatus {
  mode: 'hydra' | 'direct' | 'unavailable';
  connected?: boolean;
  head_state?: string;
  active_negotiations?: number;
  current_head_id?: string;
}

interface WorkflowStep {
  step: number;
  name: string;
  status: string;
  details: any;
  timestamp: string;
}

interface WebSocketState {
  isConnected: boolean;
  agentStatus: AgentStatus;
  currentConversation: Conversation | null;
  hydraStatus: HydraStatus;
  workflowSteps: WorkflowStep[];
  stats: {
    totalBalance: number;
    activeLoans: number;
    totalProfit: number;
    agentStatus: string;
  };
}

const WS_URL = process.env.REACT_APP_WS_URL || 'ws://localhost:8000/ws';

export function useWebSocket() {
  const [state, setState] = useState<WebSocketState>({
    isConnected: false,
    agentStatus: { status: 'idle' },
    currentConversation: null,
    hydraStatus: { mode: 'unavailable' },
    workflowSteps: [],
    stats: {
      totalBalance: 125450.75,
      activeLoans: 8,
      totalProfit: 12543.50,
      agentStatus: 'idle'
    }
  });

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    try {
      wsRef.current = new WebSocket(WS_URL);

      wsRef.current.onopen = () => {
        console.log('WebSocket connected');
        setState(prev => ({ ...prev, isConnected: true }));
        reconnectAttempts.current = 0;
      };

      wsRef.current.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          handleMessage(message);
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };

      wsRef.current.onclose = () => {
        console.log('WebSocket disconnected');
        setState(prev => ({ ...prev, isConnected: false }));

        // Attempt to reconnect if not intentionally closed
        if (reconnectAttempts.current < maxReconnectAttempts) {
          reconnectAttempts.current++;
          reconnectTimeoutRef.current = setTimeout(() => {
            console.log(`Attempting to reconnect (${reconnectAttempts.current}/${maxReconnectAttempts})`);
            connect();
          }, 2000 * reconnectAttempts.current);
        }
      };

      wsRef.current.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
    }
  }, []);

  const handleMessage = (message: any) => {
    switch (message.type) {
      case 'connected':
        console.log('WebSocket connection confirmed');
        break;

      case 'agent_status':
        setState(prev => ({
          ...prev,
          agentStatus: message.data,
          stats: { ...prev.stats, agentStatus: message.data.status }
        }));
        break;

      case 'conversation_update':
        // Fetch latest conversation
        fetchLatestConversation();
        break;

      case 'hydra_status':
        setState(prev => ({
          ...prev,
          hydraStatus: message.data
        }));
        break;

      case 'workflow_step':
        setState(prev => ({
          ...prev,
          workflowSteps: [...prev.workflowSteps.slice(-9), message.data] // Keep last 10 steps
        }));
        break;

      case 'stats_update':
        setState(prev => ({
          ...prev,
          stats: { ...prev.stats, ...message.data }
        }));
        break;

      case 'workflow_started':
        // Reset workflow steps for new workflow
        setState(prev => ({
          ...prev,
          workflowSteps: [],
          agentStatus: { status: 'negotiating', task: 'Starting workflow...' }
        }));
        break;

      default:
        console.log('Unhandled WebSocket message:', message);
    }
  };

  const fetchLatestConversation = async () => {
    try {
      const response = await fetch('/api/conversation/latest');
      const data = await response.json();
      if (data.conversation_id && data.messages.length > 0) {
        setState(prev => ({
          ...prev,
          currentConversation: data
        }));
      }
    } catch (error) {
      console.error('Failed to fetch conversation:', error);
    }
  };

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
  }, []);

  // Send ping every 30 seconds to keep connection alive
  useEffect(() => {
    const pingInterval = setInterval(() => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({ type: 'ping' }));
      }
    }, 30000);

    return () => clearInterval(pingInterval);
  }, []);

  useEffect(() => {
    connect();

    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  return {
    ...state,
    connect,
    disconnect,
    fetchLatestConversation
  };
}
