/**
 * Lendora AI - Login Gate
 * Wallet connection and role selection interface
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AuroraBackground } from '@/components/ui/AuroraBackground';
import { WalletConnection } from '@/components/dashboard/WalletConnection';
import {
    Wallet,
    Shield,
    User,
    Building2,
    Sparkles,
    ArrowRight,
    CheckCircle2
} from 'lucide-react';


export default function LoginGate() {
    const navigate = useNavigate();
    const [selectedRole, setSelectedRole] = useState<'borrower' | 'lender' | null>(null);
    const [walletAddress, setWalletAddress] = useState('');

    const handleWalletConnect = (address: string) => {
        setWalletAddress(address);
    };

    const handleRoleSelect = (role: 'borrower' | 'lender') => {
        setSelectedRole(role);
    };

    const handleContinue = () => {
        if (walletAddress && selectedRole) {
            // Navigate to dashboard - the dashboard will handle the loan form
            navigate('/dashboard');
        }
    };

    const roles = [
        {
            id: 'borrower',
            title: 'Borrower',
            description: 'Get loans with competitive rates using AI negotiation',
            icon: User,
            color: 'text-blue-500',
            bgColor: 'bg-blue-500/10',
            features: [
                'AI-negotiated rates',
                'Privacy-first lending',
                'Instant loan approval',
                'Flexible terms'
            ]
        },
        {
            id: 'lender',
            title: 'Lender',
            description: 'Earn returns by providing liquidity to borrowers',
            icon: Building2,
            color: 'text-green-500',
            bgColor: 'bg-green-500/10',
            features: [
                'Competitive returns',
                'Risk assessment',
                'Automated management',
                'Portfolio analytics'
            ]
        }
    ];

    return (
        <AuroraBackground>
            <div className="min-h-screen flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="w-full max-w-4xl"
                >
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                        className="text-center mb-8"
                    >
                        <div className="flex items-center justify-center gap-4 mb-6">
                            <div className="p-4 rounded-2xl bg-primary/10">
                                <Shield className="w-12 h-12 text-primary" />
                            </div>
                            <div>
                                <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                                    Lendora AI
                                </h1>
                                <p className="text-muted-foreground text-lg mt-2">
                                    Privacy-First DeFi Lending on Cardano
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Main Content */}
                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Role Selection */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4, duration: 0.6 }}
                        >
                            <Card className="glass-card p-6">
                                <div className="flex items-center gap-3 mb-6">
                                    <Sparkles className="w-6 h-6 text-primary" />
                                    <h2 className="text-2xl font-bold">Choose Your Role</h2>
                                </div>

                                <div className="space-y-4">
                                    {roles.map((role, index) => {
                                        const IconComponent = role.icon;
                                        return (
                                            <motion.div
                                                key={role.id}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.5 + index * 0.1, duration: 0.4 }}
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                            >
                                                <Card
                                                    className={`glass-card p-4 cursor-pointer transition-all duration-300 ${
                                                        selectedRole === role.id
                                                            ? 'border-primary shadow-lg shadow-primary/20'
                                                            : 'hover:border-primary/50'
                                                    }`}
                                                    onClick={() => handleRoleSelect(role.id as 'borrower' | 'lender')}
                                                >
                                                    <div className="flex items-start gap-4">
                                                        <div className={`p-3 rounded-xl ${role.bgColor} flex-shrink-0`}>
                                                            <IconComponent className={`w-6 h-6 ${role.color}`} />
                                                        </div>

                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2 mb-2">
                                                                <h3 className="text-lg font-semibold">{role.title}</h3>
                                                                {selectedRole === role.id && (
                                                                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                                                                )}
                                                            </div>

                                                            <p className="text-sm text-muted-foreground mb-4">
                                                                {role.description}
                                                            </p>

                                                            <div className="grid grid-cols-2 gap-2">
                                                                {role.features.map((feature, idx) => (
                                                                    <div key={idx} className="flex items-center gap-2 text-xs text-muted-foreground">
                                                                        <div className="w-1.5 h-1.5 bg-current rounded-full opacity-60" />
                                                                        {feature}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Card>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            </Card>
                        </motion.div>

                        {/* Wallet Connection */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.6, duration: 0.6 }}
                        >
                            <Card className="glass-card p-6">
                                <div className="flex items-center gap-3 mb-6">
                                    <Wallet className="w-6 h-6 text-primary" />
                                    <h2 className="text-2xl font-bold">Connect Wallet</h2>
                                </div>

                                <WalletConnection
                                    onAddressChange={handleWalletConnect}
                                    defaultAddress={walletAddress}
                                />

                                {walletAddress && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.2 }}
                                        className="mt-6 p-4 rounded-lg bg-green-500/10 border border-green-500/20"
                                    >
                                        <div className="flex items-center gap-2 mb-2">
                                            <CheckCircle2 className="w-5 h-5 text-green-500" />
                                            <span className="font-medium text-green-600">Wallet Connected</span>
                                        </div>
                                        <p className="text-xs text-muted-foreground font-mono">
                                            {walletAddress.length > 20
                                                ? `${walletAddress.slice(0, 10)}...${walletAddress.slice(-8)}`
                                                : walletAddress
                                            }
                                        </p>
                                    </motion.div>
                                )}
                            </Card>
                        </motion.div>
                    </div>

                    {/* Continue Button */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8, duration: 0.6 }}
                        className="mt-8 text-center"
                    >
                        <Button
                            onClick={handleContinue}
                            disabled={!walletAddress || !selectedRole}
                            size="lg"
                            className="px-8 py-4 text-lg font-semibold bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 shadow-lg"
                        >
                            <>
                                <ArrowRight className="w-5 h-5 mr-2" />
                                Enter Lendora AI
                            </>
                        </Button>

                        {(!walletAddress || !selectedRole) && (
                            <p className="text-sm text-muted-foreground mt-4">
                                {!walletAddress && !selectedRole && "Please connect your wallet and select a role"}
                                {!walletAddress && selectedRole && "Please connect your wallet"}
                                {walletAddress && !selectedRole && "Please select a role"}
                            </p>
                        )}
                    </motion.div>

                    {/* Features Preview */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.0, duration: 0.6 }}
                        className="mt-12 grid md:grid-cols-3 gap-6"
                    >
                        {[
                            {
                                icon: Shield,
                                title: "Privacy First",
                                description: "Zero-knowledge proofs protect your data"
                            },
                            {
                                icon: Sparkles,
                                title: "AI Powered",
                                description: "Intelligent negotiation and risk assessment"
                            },
                            {
                                icon: Wallet,
                                title: "Cardano Native",
                                description: "Built on Cardano's secure blockchain"
                            }
                        ].map((feature, index) => {
                            const IconComponent = feature.icon;
                            return (
                                <motion.div
                                    key={feature.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 1.2 + index * 0.1, duration: 0.4 }}
                                    whileHover={{ y: -2 }}
                                >
                                    <Card className="glass-card p-6 text-center">
                                        <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-primary/10 flex items-center justify-center">
                                            <IconComponent className="w-6 h-6 text-primary" />
                                        </div>
                                        <h3 className="font-semibold mb-2">{feature.title}</h3>
                                        <p className="text-sm text-muted-foreground">{feature.description}</p>
                                    </Card>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                </motion.div>
            </div>
        </AuroraBackground>
    );
}
