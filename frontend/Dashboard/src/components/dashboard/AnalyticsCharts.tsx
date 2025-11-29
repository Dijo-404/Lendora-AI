/**
 * Lendora AI - Comprehensive Analytics Charts
 * Multiple chart types for detailed loan analytics with enhanced visuals
 */

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import {
    LineChart,
    Line,
    AreaChart,
    Area,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    RadialBarChart,
    RadialBar
} from 'recharts';
import {
    TrendingUp,
    DollarSign,
    Activity,
    PieChart as PieChartIcon,
    BarChart3,
    LineChart as LineChartIcon,
    Target,
    Users,
    Clock,
    ArrowUpCircle
} from 'lucide-react';
import { motion } from 'framer-motion';

interface AnalyticsData {
    profit: Array<{ x: number; y: number; value: number; label: string }>;
    loans: Array<{ x: number; y: number; value: number; label: string }>;
    rates: Array<{ x: number; y: number; value: number; label: string }>;
    volume: Array<{ name: string; value: number; color: string }>;
}

const CHART_COLORS = {
    primary: 'hsl(var(--primary))',
    secondary: 'hsl(var(--secondary))',
    accent: 'hsl(var(--accent))',
    success: '#00FF88',
    warning: '#FFA500',
    danger: '#FF4757',
    info: '#3742FA'
};

export function AnalyticsCharts() {
    const [data, setData] = useState<AnalyticsData>({
        profit: [],
        loans: [],
        rates: [],
        volume: []
    });
    const [activeTab, setActiveTab] = useState<'profit' | 'loans' | 'rates' | 'volume'>('profit');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
                const res = await fetch(`${apiUrl}/api/analytics`);

                if (res.ok) {
                    const analytics = await res.json();
                    setData(analytics);
                } else {
                    generateMockData();
                }
            } catch (err) {
                console.error('Failed to fetch analytics:', err);
                generateMockData();
            }
        };

        fetchData();
    }, []);

    const generateMockData = () => {
        const volumeData = [
            { name: 'USDT', value: 45, color: CHART_COLORS.success },
            { name: 'USDC', value: 30, color: CHART_COLORS.primary },
            { name: 'DAI', value: 15, color: CHART_COLORS.secondary },
            { name: 'ADA', value: 10, color: CHART_COLORS.accent }
        ];

        setData({
            profit: [],
            loans: [],
            rates: [],
            volume: volumeData
        });
    };



    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <Card className="glass-card p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-lg bg-primary/10">
                        <BarChart3 className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold">Analytics Dashboard</h3>
                        <p className="text-sm text-muted-foreground">Comprehensive loan performance metrics</p>
                    </div>
                </div>

                <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as typeof activeTab)}>
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="profit" className="flex items-center gap-2">
                            <TrendingUp className="w-4 h-4" />
                            Profit
                        </TabsTrigger>
                        <TabsTrigger value="loans" className="flex items-center gap-2">
                            <Activity className="w-4 h-4" />
                            Loans
                        </TabsTrigger>
                        <TabsTrigger value="rates" className="flex items-center gap-2">
                            <LineChartIcon className="w-4 h-4" />
                            Rates
                        </TabsTrigger>
                        <TabsTrigger value="volume" className="flex items-center gap-2">
                            <PieChartIcon className="w-4 h-4" />
                            Volume
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="profit" className="mt-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <Card className="glass-card p-4">
                                <div className="flex items-center gap-2 mb-4">
                                    <ArrowUpCircle className="w-5 h-5 text-green-500" />
                                    <h4 className="font-semibold">Profit Trend</h4>
                                </div>
                                <ChartContainer config={{}} className="h-64">
                                    <AreaChart data={Array.from({ length: 12 }, (_, i) => ({
                                        month: `M${i + 1}`,
                                        profit: 1000 + Math.sin(i * 0.5) * 500 + Math.random() * 200,
                                        target: 1500 + i * 80
                                    }))}>
                                        <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                                        <XAxis dataKey="month" />
                                        <YAxis />
                                        <ChartTooltip content={<ChartTooltipContent />} />
                                        <Area
                                            type="monotone"
                                            dataKey="profit"
                                            stroke={CHART_COLORS.success}
                                            fill={CHART_COLORS.success}
                                            fillOpacity={0.3}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="target"
                                            stroke={CHART_COLORS.primary}
                                            fill={CHART_COLORS.primary}
                                            fillOpacity={0.1}
                                        />
                                    </AreaChart>
                                </ChartContainer>
                            </Card>

                            <Card className="glass-card p-4">
                                <div className="flex items-center gap-2 mb-4">
                                    <DollarSign className="w-5 h-5 text-primary" />
                                    <h4 className="font-semibold">Monthly Performance</h4>
                                </div>
                                <ChartContainer config={{}} className="h-64">
                                    <BarChart data={Array.from({ length: 6 }, (_, i) => ({
                                        month: `Month ${i + 1}`,
                                        profit: 1200 + Math.random() * 800
                                    }))}>
                                        <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                                        <XAxis dataKey="month" />
                                        <YAxis />
                                        <ChartTooltip content={<ChartTooltipContent />} />
                                        <Bar dataKey="profit" fill={CHART_COLORS.success} radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ChartContainer>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="loans" className="mt-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <Card className="glass-card p-4">
                                <div className="flex items-center gap-2 mb-4">
                                    <Users className="w-5 h-5 text-blue-500" />
                                    <h4 className="font-semibold">Loan Activity</h4>
                                </div>
                                <ChartContainer config={{}} className="h-64">
                                    <LineChart data={Array.from({ length: 8 }, (_, i) => ({
                                        period: `${i + 1}Q`,
                                        active: 5 + Math.sin(i * 0.8) * 8 + Math.random() * 5,
                                        completed: 12 + Math.cos(i * 0.6) * 6 + Math.random() * 4
                                    }))}>
                                        <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                                        <XAxis dataKey="period" />
                                        <YAxis />
                                        <ChartTooltip content={<ChartTooltipContent />} />
                                        <Line
                                            type="monotone"
                                            dataKey="active"
                                            stroke={CHART_COLORS.primary}
                                            strokeWidth={3}
                                            dot={{ fill: CHART_COLORS.primary, r: 4 }}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="completed"
                                            stroke={CHART_COLORS.success}
                                            strokeWidth={3}
                                            dot={{ fill: CHART_COLORS.success, r: 4 }}
                                        />
                                    </LineChart>
                                </ChartContainer>
                            </Card>

                            <Card className="glass-card p-4">
                                <div className="flex items-center gap-2 mb-4">
                                    <Target className="w-5 h-5 text-purple-500" />
                                    <h4 className="font-semibold">Loan Distribution</h4>
                                </div>
                                <ChartContainer config={{}} className="h-64">
                                    <RadialBarChart
                                        cx="50%"
                                        cy="50%"
                                        innerRadius="20%"
                                        outerRadius="80%"
                                        data={[
                                            { name: 'Active', value: 65, fill: CHART_COLORS.primary },
                                            { name: 'Completed', value: 85, fill: CHART_COLORS.success },
                                            { name: 'Pending', value: 25, fill: CHART_COLORS.warning }
                                        ]}
                                    >
                                        <RadialBar dataKey="value" cornerRadius={10} />
                                        <ChartTooltip content={<ChartTooltipContent />} />
                                    </RadialBarChart>
                                </ChartContainer>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="rates" className="mt-6">
                        <Card className="glass-card p-4">
                            <div className="flex items-center gap-2 mb-4">
                                <Clock className="w-5 h-5 text-orange-500" />
                                <h4 className="font-semibold">Interest Rate Trends</h4>
                            </div>
                            <ChartContainer config={{}} className="h-80">
                                <AreaChart data={Array.from({ length: 24 }, (_, i) => ({
                                    hour: `${i}:00`,
                                    rate: 6.5 + Math.sin(i * 0.3) * 1.2 + Math.random() * 0.5,
                                    benchmark: 7.2 + Math.sin(i * 0.2) * 0.3
                                }))}>
                                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                                    <XAxis dataKey="hour" />
                                    <YAxis domain={[6, 9]} />
                                    <ChartTooltip content={<ChartTooltipContent />} />
                                    <Area
                                        type="monotone"
                                        dataKey="rate"
                                        stroke={CHART_COLORS.accent}
                                        fill={CHART_COLORS.accent}
                                        fillOpacity={0.3}
                                        strokeWidth={2}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="benchmark"
                                        stroke={CHART_COLORS.secondary}
                                        fill={CHART_COLORS.secondary}
                                        fillOpacity={0.1}
                                        strokeWidth={2}
                                        strokeDasharray="5 5"
                                    />
                                </AreaChart>
                            </ChartContainer>
                        </Card>
                    </TabsContent>

                    <TabsContent value="volume" className="mt-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <Card className="glass-card p-4">
                                <div className="flex items-center gap-2 mb-4">
                                    <PieChartIcon className="w-5 h-5 text-indigo-500" />
                                    <h4 className="font-semibold">Asset Distribution</h4>
                                </div>
                                <ChartContainer config={{}} className="h-64">
                                    <PieChart>
                                        <Pie
                                            data={data.volume}
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={80}
                                            dataKey="value"
                                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                        >
                                            {data.volume.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <ChartTooltip content={<ChartTooltipContent />} />
                                    </PieChart>
                                </ChartContainer>
                            </Card>

                            <Card className="glass-card p-4">
                                <div className="flex items-center gap-2 mb-4">
                                    <BarChart3 className="w-5 h-5 text-teal-500" />
                                    <h4 className="font-semibold">Volume Breakdown</h4>
                                </div>
                                <ChartContainer config={{}} className="h-64">
                                    <BarChart data={data.volume} layout="horizontal">
                                        <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                                        <XAxis type="number" />
                                        <YAxis dataKey="name" type="category" width={60} />
                                        <ChartTooltip content={<ChartTooltipContent />} />
                                        <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                                            {data.volume.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ChartContainer>
                            </Card>
                        </div>
                    </TabsContent>
                </Tabs>
            </Card>
        </motion.div>
    );
}
