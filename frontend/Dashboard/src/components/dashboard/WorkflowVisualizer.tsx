/**
 * Lendora AI - Enhanced Workflow Visualizer
 * Interactive workflow steps with rich icons and animations
 */

import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import {
    CheckCircle2,
    Circle,
    Loader2,
    Shield,
    Brain,
    Network,
    FileText,
    Zap,
    ArrowRight,
    Clock,
    AlertCircle,
    Database,
    Target
} from 'lucide-react';

interface WorkflowStep {
    step: number;
    name: string;
    status: 'pending' | 'processing' | 'completed' | 'error';
    details?: Record<string, unknown>;
    duration?: number;
    icon?: React.ComponentType<{ className?: string }>;
    color?: string;
}

interface WorkflowVisualizerProps {
    steps: WorkflowStep[];
    isRunning?: boolean;
    onStepClick?: (step: WorkflowStep) => void;
    showDetails?: boolean;
}

const STEP_ICONS = {
    1: Shield,      // Midnight ZK Check
    2: FileText,    // Loan Offer
    3: Network,     // Hydra Head
    4: Brain,       // AI Analysis
    5: Zap,         // Close Head
    6: Database     // Aiken Validator
};

const STEP_COLORS = {
    1: 'text-blue-500',
    2: 'text-green-500',
    3: 'text-purple-500',
    4: 'text-orange-500',
    5: 'text-red-500',
    6: 'text-cyan-500'
};

export function WorkflowVisualizer({
    steps,
    isRunning = false,
    onStepClick,
    showDetails = true
}: WorkflowVisualizerProps) {
    const getStepIcon = (step: WorkflowStep) => {
        const IconComponent = STEP_ICONS[step.step as keyof typeof STEP_ICONS] || Circle;
        const colorClass = STEP_COLORS[step.step as keyof typeof STEP_COLORS] || 'text-gray-400';

        switch (step.status) {
            case 'completed':
                return <CheckCircle2 className="w-6 h-6 text-green-500" />;
            case 'processing':
                return <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />;
            case 'error':
                return <AlertCircle className="w-6 h-6 text-red-500" />;
            default:
                return <IconComponent className={`w-6 h-6 ${colorClass}`} />;
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'completed':
                return (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-green-500/10 text-green-500 border border-green-500/20">
                        <CheckCircle2 className="w-3 h-3" />
                        Complete
                    </span>
                );
            case 'processing':
                return (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-blue-500/10 text-blue-500 border border-blue-500/20">
                        <Loader2 className="w-3 h-3 animate-spin" />
                        Processing
                    </span>
                );
            case 'error':
                return (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-red-500/10 text-red-500 border border-red-500/20">
                        <AlertCircle className="w-3 h-3" />
                        Error
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-gray-500/10 text-gray-500 border border-gray-500/20">
                        <Clock className="w-3 h-3" />
                        Pending
                    </span>
                );
        }
    };

    const getStepDescription = (step: WorkflowStep) => {
        const descriptions = {
            1: "Privacy-first credit verification using zero-knowledge proofs",
            2: "AI-generated loan offer with competitive terms",
            3: "Off-chain negotiation channel opened on Hydra",
            4: "Llama 3 analysis and counter-offer generation",
            5: "Hydra head closed, settlement prepared",
            6: "Dual-signature validation and loan disbursement"
        };
        return descriptions[step.step as keyof typeof descriptions] || step.name;
    };

    return (
        <Card className="glass-card p-6">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                        <Target className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold">Workflow Progress</h3>
                        <p className="text-sm text-muted-foreground">
                            Privacy-First DeFi Lending Pipeline
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <motion.div
                        className={`w-2 h-2 rounded-full ${isRunning ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}
                        animate={isRunning ? { scale: [1, 1.2, 1] } : {}}
                        transition={{ duration: 1, repeat: Infinity }}
                    />
                    <span className="text-sm font-medium">
                        {isRunning ? 'Active' : 'Idle'}
                    </span>
                </div>
            </div>

            <div className="space-y-4">
                <AnimatePresence mode="popLayout">
                    {steps.map((step, index) => (
                        <motion.div
                            key={step.step}
                            initial={{ opacity: 0, x: -20, scale: 0.95 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: 20, scale: 0.95 }}
                            transition={{
                                duration: 0.3,
                                delay: index * 0.1,
                                type: "spring",
                                stiffness: 100
                            }}
                            className="group"
                        >
                            <motion.div
                                className={`flex items-start gap-4 p-4 rounded-xl border transition-all duration-300 cursor-pointer ${
                                    step.status === 'completed'
                                        ? 'bg-green-500/5 border-green-500/20 shadow-lg shadow-green-500/10'
                                        : step.status === 'processing'
                                        ? 'bg-blue-500/5 border-blue-500/20 shadow-lg shadow-blue-500/10'
                                        : step.status === 'error'
                                        ? 'bg-red-500/5 border-red-500/20 shadow-lg shadow-red-500/10'
                                        : 'bg-muted/30 border-border hover:border-primary/30'
                                }`}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => onStepClick?.(step)}
                            >
                                {/* Step indicator */}
                                <div className="flex-shrink-0 mt-1">
                                    {getStepIcon(step)}
                                </div>

                                {/* Step content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h4 className="font-semibold text-sm">
                                            Step {step.step}: {step.name}
                                        </h4>
                                        {getStatusBadge(step.status)}
                                    </div>

                                    <p className="text-xs text-muted-foreground mb-3">
                                        {getStepDescription(step)}
                                    </p>

                                    {/* Progress details */}
                                    <AnimatePresence>
                                        {showDetails && step.details && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className="space-y-2"
                                            >
                                                {Object.entries(step.details).map(([key, value]) => (
                                                    <div key={key} className="flex justify-between text-xs">
                                                        <span className="text-muted-foreground capitalize">
                                                            {key.replace(/([A-Z])/g, ' $1').toLowerCase()}:
                                                        </span>
                                                        <span className="font-mono">
                                                            {String(value).length > 20
                                                                ? `${String(value).slice(0, 20)}...`
                                                                : String(value)
                                                            }
                                                        </span>
                                                    </div>
                                                ))}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Connection arrow */}
                                {index < steps.length - 1 && (
                                    <motion.div
                                        className="flex-shrink-0 mt-2"
                                        animate={{
                                            x: [0, 5, 0],
                                            opacity: [0.5, 1, 0.5]
                                        }}
                                        transition={{
                                            duration: 2,
                                            repeat: Infinity,
                                            delay: index * 0.2
                                        }}
                                    >
                                        <ArrowRight className="w-4 h-4 text-muted-foreground" />
                                    </motion.div>
                                )}
                            </motion.div>

                            {/* Connection line */}
                            {index < steps.length - 1 && (
                                <motion.div
                                    className="ml-7 w-px h-4 bg-gradient-to-b from-border to-transparent"
                                    initial={{ scaleY: 0 }}
                                    animate={{ scaleY: 1 }}
                                    transition={{ delay: index * 0.1 + 0.3 }}
                                />
                            )}
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Workflow stats */}
            <div className="mt-6 pt-6 border-t border-border">
                <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                        <div className="text-2xl font-bold text-green-500">
                            {steps.filter(s => s.status === 'completed').length}
                        </div>
                        <div className="text-xs text-muted-foreground">Completed</div>
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-blue-500">
                            {steps.filter(s => s.status === 'processing').length}
                        </div>
                        <div className="text-xs text-muted-foreground">Active</div>
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-gray-500">
                            {steps.length - steps.filter(s => s.status === 'completed' || s.status === 'processing').length}
                        </div>
                        <div className="text-xs text-muted-foreground">Pending</div>
                    </div>
                </div>
            </div>
        </Card>
    );
}
