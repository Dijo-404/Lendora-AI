/**
 * Lendora AI - Main Dashboard
 * Displays loan requests, negotiations, and analytics
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FluidBackground } from '@/components/ui/FluidBackground';
import { InteractiveCharts } from '@/components/dashboard/InteractiveCharts';
import { WalletConnection } from '@/components/dashboard/WalletConnection';
import {
    LayoutDashboard,
    Settings,
    LogOut,
    Plus,
    Bell,
    Search
} from 'lucide-react';

export default function Dashboard() {
    const [activeTab, setActiveTab] = useState('overview');

    // Mock data for charts
    const mockTrades = [
        { timestamp: '2024-01-01', principal: 5000, interestRate: 8.5, profit: 120 },
        { timestamp: '2024-01-15', principal: 7500, interestRate: 8.2, profit: 180 },
        { timestamp: '2024-02-01', principal: 6000, interestRate: 8.0, profit: 150 },
        { timestamp: '2024-02-15', principal: 9000, interestRate: 7.8, profit: 210 },
        { timestamp: '2024-03-01', principal: 12000, interestRate: 7.5, profit: 300 },
        { timestamp: '2024-03-15', principal: 10000, interestRate: 7.2, profit: 250 },
        { timestamp: '2024-04-01', principal: 15000, interestRate: 7.0, profit: 400 },
    ];

    return (
        <>
            <FluidBackground variant="default" intensity="low" />

            <div className="min-h-screen flex relative z-10">
                {/* Sidebar */}
                <motion.aside
                    initial={{ x: -100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="w-64 glass-panel border-r border-white/10 hidden md:flex flex-col p-6 fixed h-full z-10"
                >
                    <div className="flex items-center gap-3 mb-10">
                        <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                            <div className="w-6 h-6 bg-primary rounded-lg" />
                        </div>
                        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
                            Lendora AI
                        </h1>
                    </div>

                    <nav className="space-y-2 flex-1">
                        {[
                            { id: 'overview', icon: LayoutDashboard, label: 'Overview' },
                            { id: 'requests', icon: Plus, label: 'Loan Requests' },
                            { id: 'settings', icon: Settings, label: 'Settings' },
                        ].map((item) => (
                            <Button
                                key={item.id}
                                variant={activeTab === item.id ? "secondary" : "ghost"}
                                className={`w-full justify-start gap-3 ${activeTab === item.id ? 'bg-white/10' : 'hover:bg-white/5'
                                    }`}
                                onClick={() => setActiveTab(item.id)}
                            >
                                <item.icon className="w-5 h-5" />
                                {item.label}
                            </Button>
                        ))}
                    </nav>

                    <Button variant="ghost" className="justify-start gap-3 text-red-400 hover:text-red-300 hover:bg-red-500/10">
                        <LogOut className="w-5 h-5" />
                        Disconnect
                    </Button>
                </motion.aside>

                {/* Main Content */}
                <main className="flex-1 md:ml-64 p-8">
                    {/* Header */}
                    <header className="flex justify-between items-center mb-8">
                        <div>
                            <h2 className="text-3xl font-bold mb-2">Dashboard</h2>
                            <p className="text-muted-foreground">Welcome back, Borrower</p>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="relative hidden sm:block">
                                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                <input
                                    type="text"
                                    placeholder="Search loans..."
                                    className="pl-10 pr-4 py-2 rounded-full bg-white/5 border border-white/10 focus:outline-none focus:border-primary/50 transition-colors w-64"
                                />
                            </div>

                            <Button size="icon" variant="ghost" className="rounded-full relative">
                                <Bell className="w-5 h-5" />
                                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
                            </Button>

                            <WalletConnection
                                defaultAddress="addr1..."
                                onAddressChange={() => { }}
                            />
                        </div>
                    </header>

                    {/* Content Area */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="space-y-8"
                    >
                        {/* Analytics Section */}
                        <section>
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-semibold">Market Overview</h3>
                                <div className="flex gap-2">
                                    <Button size="sm" variant="outline" className="rounded-full">1W</Button>
                                    <Button size="sm" variant="outline" className="rounded-full bg-primary text-primary-foreground border-none">1M</Button>
                                    <Button size="sm" variant="outline" className="rounded-full">1Y</Button>
                                </div>
                            </div>

                            <InteractiveCharts trades={mockTrades} />
                        </section>

                        {/* Recent Activity */}
                        <section>
                            <h3 className="text-xl font-semibold mb-6">Recent Activity</h3>
                            <div className="grid gap-4">
                                {[1, 2, 3].map((i) => (
                                    <Card key={i} className="glass-panel p-4 flex items-center justify-between hover-lift">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                            </div>
                                            <div>
                                                <h4 className="font-medium">Loan Request #{1000 + i}</h4>
                                                <p className="text-sm text-muted-foreground">Negotiating via Hydra Head</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold">5,000 ADA</p>
                                            <p className="text-sm text-green-500">8.5% APR</p>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        </section>
                    </motion.div>
                </main>
            </div>
        </>
    );
}
