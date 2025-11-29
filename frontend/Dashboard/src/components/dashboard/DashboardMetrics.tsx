/**
 * Lendora AI - Enhanced Dashboard Metrics
 * Comprehensive metrics display with rich icons and animations
 */

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import CountUp from 'react-countup';
import {
    DollarSign,
    TrendingUp,
    Activity,
    Target,
    BarChart3,
    PieChart,
    ArrowUp,
    ArrowDown,
    Minus
} from 'lucide-react';

interface MetricCard {
    title: string;
    value: string | number;
    subtitle: string;
    icon: React.ComponentType<{ className?: string }>;
    trend?: {
        value: number;
        direction: 'up' | 'down' | 'neutral';
        label: string;
    };
    color: string;
    bgColor: string;
}

interface DashboardMetricsProps {
    stats: {
        totalBalance: number;
        activeLoans: number;
        totalProfit: number;
        agentStatus: string;
        successRate?: number;
        avgRate?: number;
        totalVolume?: number;
        networkHealth?: number;
    };
}

export function DashboardMetrics({ stats }: DashboardMetricsProps) {
    const metrics: MetricCard[] = [
        {
            title: "Total Balance",
            value: stats.totalBalance,
            subtitle: "ADA in treasury",
            icon: DollarSign,
            trend: { value: 12.5, direction: 'up', label: '+12.5%' },
            color: "text-green-500",
            bgColor: "bg-green-500/10"
        },
        {
            title: "Active Loans",
            value: stats.activeLoans,
            subtitle: "Currently funded",
            icon: Activity,
            trend: { value: 8.2, direction: 'up', label: '+8.2%' },
            color: "text-blue-500",
            bgColor: "bg-blue-500/10"
        },
        {
            title: "Total Profit",
            value: stats.totalProfit,
            subtitle: "ADA earned",
            icon: TrendingUp,
            trend: { value: 23.1, direction: 'up', label: '+23.1%' },
            color: "text-emerald-500",
            bgColor: "bg-emerald-500/10"
        },
        {
            title: "Success Rate",
            value: stats.successRate || 94.7,
            subtitle: "Loan completion rate",
            icon: Target,
            trend: { value: 2.3, direction: 'up', label: '+2.3%' },
            color: "text-purple-500",
            bgColor: "bg-purple-500/10"
        },
        {
            title: "Average Rate",
            value: `${stats.avgRate || 7.25}%`,
            subtitle: "Interest rate",
            icon: BarChart3,
            trend: { value: -0.5, direction: 'down', label: '-0.5%' },
            color: "text-orange-500",
            bgColor: "bg-orange-500/10"
        },
        {
            title: "Total Volume",
            value: stats.totalVolume || 125430,
            subtitle: "ADA transacted",
            icon: PieChart,
            trend: { value: 15.8, direction: 'up', label: '+15.8%' },
            color: "text-cyan-500",
            bgColor: "bg-cyan-500/10"
        }
    ];

    const getTrendIcon = (direction: 'up' | 'down' | 'neutral') => {
        switch (direction) {
            case 'up':
                return ArrowUp;
            case 'down':
                return ArrowDown;
            default:
                return Minus;
        }
    };

    const getTrendColor = (direction: 'up' | 'down' | 'neutral') => {
        switch (direction) {
            case 'up':
                return 'text-green-500';
            case 'down':
                return 'text-red-500';
            default:
                return 'text-gray-500';
        }
    };

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            {metrics.map((metric, index) => {
                const IconComponent = metric.icon;
                const TrendIcon = metric.trend ? getTrendIcon(metric.trend.direction) : null;

                return (
                    <motion.div
                        key={metric.title}
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{
                            duration: 0.5,
                            delay: index * 0.1,
                            type: "spring",
                            stiffness: 100
                        }}
                        whileHover={{
                            y: -4,
                            scale: 1.02,
                            transition: { duration: 0.2 }
                        }}
                        className="group"
                    >
                        <Card className="glass-card p-4 relative overflow-hidden cursor-pointer">
                            {/* Animated background gradient */}
                            <motion.div
                                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                                style={{
                                    background: `radial-gradient(circle at center, ${metric.color.replace('text-', '')} 0%, transparent 70%)`,
                                }}
                            />

                            {/* Icon with glow effect */}
                            <div className={`p-3 rounded-xl ${metric.bgColor} mb-3 relative`}>
                                <IconComponent className={`w-6 h-6 ${metric.color}`} />
                                <motion.div
                                    className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-20"
                                    style={{
                                        background: `linear-gradient(45deg, ${metric.color.replace('text-', '')}, transparent)`,
                                        filter: 'blur(8px)',
                                    }}
                                    animate={{ scale: [1, 1.1, 1] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                />
                            </div>

                            {/* Content */}
                            <div className="relative z-10">
                                <h3 className="text-sm text-muted-foreground mb-1 font-medium">
                                    {metric.title}
                                </h3>

                                <div className="flex items-baseline gap-1 mb-1">
                                    <span className="text-2xl font-bold tabular-nums">
                                        {typeof metric.value === 'number' && metric.title.includes('Balance') ||
                                         metric.title.includes('Profit') || metric.title.includes('Volume') ? (
                                            <CountUp
                                                end={metric.value as number}
                                                duration={2}
                                                decimals={metric.title.includes('Rate') ? 2 : 0}
                                                preserveValue
                                            />
                                        ) : (
                                            metric.value
                                        )}
                                    </span>
                                    {metric.title.includes('Rate') && !metric.title.includes('Success') && (
                                        <span className="text-sm text-muted-foreground">%</span>
                                    )}
                                </div>

                                <p className="text-xs text-muted-foreground mb-2">
                                    {metric.subtitle}
                                </p>

                                {/* Trend indicator */}
                                {metric.trend && (
                                    <motion.div
                                        className={`flex items-center gap-1 text-xs ${getTrendColor(metric.trend.direction)}`}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.5 + index * 0.1 }}
                                    >
                                        {TrendIcon && <TrendIcon className="w-3 h-3" />}
                                        <span>{metric.trend.label}</span>
                                    </motion.div>
                                )}
                            </div>

                            {/* Floating particles */}
                            <motion.div
                                className="absolute top-2 right-2 w-1 h-1 bg-current rounded-full opacity-30"
                                animate={{
                                    y: [0, -10, 0],
                                    opacity: [0.3, 0.8, 0.3],
                                }}
                                transition={{
                                    duration: 3,
                                    repeat: Infinity,
                                    delay: index * 0.5,
                                }}
                                style={{ color: metric.color.replace('text-', '') }}
                            />
                        </Card>
                    </motion.div>
                );
            })}
        </div>
    );
}
