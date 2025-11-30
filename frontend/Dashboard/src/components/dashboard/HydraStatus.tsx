import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { Network, Zap, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';

interface HydraStatusProps {
  mode: 'real' | 'mock' | 'unavailable';
  connected?: boolean;
  headState?: string;
  activeNegotiations?: number;
  currentHeadId?: string;
}

export function HydraStatus({ mode, connected, headState, activeNegotiations, currentHeadId }: HydraStatusProps) {
  const getModeColor = (mode: string) => {
    switch (mode) {
      case 'real':
        return 'bg-green-500';
      case 'mock':
        return 'bg-blue-500';
      case 'unavailable':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getModeIcon = (mode: string) => {
    switch (mode) {
      case 'real':
        return <CheckCircle2 className="w-4 h-4" />;
      case 'mock':
        return <Network className="w-4 h-4" />;
      case 'unavailable':
        return <XCircle className="w-4 h-4" />;
      default:
        return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const getHeadStateColor = (state?: string) => {
    switch (state) {
      case 'Open':
        return 'bg-green-500';
      case 'Initializing':
        return 'bg-yellow-500';
      case 'Closed':
        return 'bg-red-500';
      case 'Idle':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <Card className="glass-panel p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Zap className="w-5 h-5 text-primary" />
          Hydra Network Status
        </h3>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className={`${getModeColor(mode)} text-white border-0`}>
            {getModeIcon(mode)}
            <span className="ml-1 capitalize">{mode}</span>
          </Badge>
          {connected !== undefined && (
            <Badge variant="outline" className={connected ? 'bg-green-500 text-white border-0' : 'bg-red-500 text-white border-0'}>
              {connected ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
              <span className="ml-1 text-xs">
                {connected ? 'Connected' : 'Disconnected'}
              </span>
            </Badge>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Head State */}
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Head State</p>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={`${getHeadStateColor(headState)} text-white border-0`}>
              {headState || 'Unknown'}
            </Badge>
          </div>
        </div>

        {/* Active Negotiations */}
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Active Negotiations</p>
          <div className="flex items-center gap-2">
            <div className="text-2xl font-bold">
              {activeNegotiations || 0}
            </div>
            <span className="text-sm text-muted-foreground">heads</span>
          </div>
        </div>
      </div>

      {/* Mode Description */}
      <div className="mt-4 p-3 rounded-lg bg-white/5">
        <div className="flex items-start gap-3">
          {mode === 'real' ? (
            <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
          ) : mode === 'mock' ? (
            <Network className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
          )}

          <div>
            <p className="text-sm font-medium mb-1">
              {mode === 'real'
                ? 'Connected to Hydra Node'
                : mode === 'mock'
                ? 'Mock Mode Active'
                : 'Hydra Unavailable'
              }
            </p>
            <p className="text-xs text-muted-foreground">
              {mode === 'real'
                ? 'Real-time Layer 2 negotiations with zero gas fees'
                : mode === 'mock'
                ? 'Simulated negotiations for development and testing'
                : 'Connect to a Hydra node to enable Layer 2 features'
              }
            </p>
          </div>
        </div>
      </div>

      {/* Head Information */}
      {((activeNegotiations && activeNegotiations > 0) || currentHeadId) && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-4 p-3 rounded-lg bg-primary/10 border border-primary/20"
        >
          <p className="text-sm font-medium text-primary mb-2">
            Active Hydra Heads
          </p>
          <div className="space-y-2">
            {/* Display current head if available */}
            {currentHeadId && (
              <div className="flex items-center justify-between text-xs p-2 rounded bg-white/5">
                <div className="flex flex-col">
                  <span className="font-mono font-medium">{currentHeadId}</span>
                  <span className="text-muted-foreground">Current negotiation head</span>
                </div>
                <Badge variant="outline" className="bg-green-500/20 text-green-600 border-green-500/30">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  {headState || 'Open'}
                </Badge>
              </div>
            )}

            {/* Display additional active heads */}
            {activeNegotiations && activeNegotiations > (currentHeadId ? 1 : 0) && (
              <>
                {Array.from({ length: Math.min(activeNegotiations - (currentHeadId ? 1 : 0), 4) }, (_, i) => (
                  <div key={i + (currentHeadId ? 1 : 0)} className="flex items-center justify-between text-xs p-2 rounded bg-white/5">
                    <div className="flex flex-col">
                      <span className="font-mono font-medium">head_{String(i + 1).padStart(3, '0')}</span>
                      <span className="text-muted-foreground">Zero-gas negotiation active</span>
                    </div>
                    <Badge variant="outline" className="bg-green-500/20 text-green-600 border-green-500/30">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Open
                    </Badge>
                  </div>
                ))}
              </>
            )}

            {/* Show count if no specific heads */}
            {!currentHeadId && activeNegotiations && activeNegotiations > 0 && (
              <div className="text-xs text-muted-foreground text-center py-2">
                {activeNegotiations} active negotiation{activeNegotiations !== 1 ? 's' : ''}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </Card>
  );
}
