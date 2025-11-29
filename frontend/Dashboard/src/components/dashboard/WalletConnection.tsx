/**
 * Lendora AI - Enhanced Wallet Connection
 * Supports Nami and manual address input with rich UI
 */

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useWallet } from '@/hooks/use-wallet';
import { Wallet, Copy, Check, Edit2, X, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface WalletConnectionProps {
    onAddressChange?: (address: string) => void;
    defaultAddress?: string;
}

export function WalletConnection({ onAddressChange, defaultAddress }: WalletConnectionProps) {
    const {
        installedWallets,
        isConnecting,
        isConnected,
        error,
        wallet,
        address,
        shortAddress,
        balance,
        network,
        connect,
        disconnect,
    } = useWallet();

    const [manualAddress, setManualAddress] = useState(defaultAddress || '');
    const [isManualMode, setIsManualMode] = useState(!defaultAddress);
    const [copied, setCopied] = useState(false);

    const handleConnect = async (walletName: any) => {
        try {
            await connect(walletName);
            setIsManualMode(false);
            if (onAddressChange && address) {
                onAddressChange(address);
            }
        } catch (err) {
            console.error('Connection error:', err);
        }
    };

    const handleManualAddress = (addr: string) => {
        setManualAddress(addr);
        if (onAddressChange) {
            onAddressChange(addr);
        }
    };

    const copyAddress = () => {
        const addr = isConnected ? address : manualAddress;
        navigator.clipboard.writeText(addr);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const currentAddress = isConnected ? address : manualAddress;
    const currentShortAddress = isConnected ? shortAddress : (manualAddress ? `${manualAddress.slice(0, 8)}...${manualAddress.slice(-8)}` : '');

    return (
        <Card className="glass-card p-4">
            <div className="flex items-center gap-2 mb-4">
                <Wallet className="w-5 h-5 text-primary" />
                <h3 className="font-semibold">Wallet Connection</h3>
            </div>

            {isConnected ? (
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">Connected Wallet</p>
                            <p className="font-medium">{wallet?.displayName || 'Unknown'}</p>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={disconnect}
                        >
                            Disconnect
                        </Button>
                    </div>

                    <div className="space-y-2">
                        <div>
                            <Label className="text-xs text-muted-foreground">Address</Label>
                            <div className="flex items-center gap-2 mt-1">
                                <Input
                                    value={currentShortAddress}
                                    readOnly
                                    className="font-mono text-sm"
                                />
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={copyAddress}
                                >
                                    {copied ? (
                                        <Check className="w-4 h-4 text-green-500" />
                                    ) : (
                                        <Copy className="w-4 h-4" />
                                    )}
                                </Button>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <Label className="text-xs text-muted-foreground">Balance</Label>
                                <p className="font-medium">{balance} ADA</p>
                            </div>
                            <div>
                                <Label className="text-xs text-muted-foreground">Network</Label>
                                <p className="font-medium">{network}</p>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="space-y-4">
                    {/* Wallet Options */}
                    <div>
                        <Label className="text-sm mb-2 block">Connect Wallet</Label>
                        <div className="grid grid-cols-2 gap-2">
                            {installedWallets
                                .filter(w => w.installed)
                                .map((wallet) => (
                                    <motion.div
                                        key={wallet.name}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <Button
                                            variant={wallet.name === 'eternl' ? 'default' : 'outline'}
                                            onClick={() => handleConnect(wallet.name)}
                                            disabled={isConnecting}
                                            className={`justify-start relative overflow-hidden group ${
                                                wallet.name === 'eternl' ? 'bg-primary text-primary-foreground shadow-lg' : 'hover:border-primary/50'
                                            }`}
                                        >
                                            {/* Animated background */}
                                            <motion.div
                                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                                                initial={{ x: '-100%' }}
                                                whileHover={{ x: '100%' }}
                                                transition={{ duration: 0.6 }}
                                            />

                                            <div className="flex items-center gap-3 relative z-10">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                                    wallet.name === 'eternl' ? 'bg-white/20' : 'bg-primary/10'
                                                }`}>
                                                    <Wallet className={`w-4 h-4 ${
                                                        wallet.name === 'eternl' ? 'text-white' : 'text-primary'
                                                    }`} />
                                                </div>
                                                <div className="text-left">
                                                    <div className="font-medium">{wallet.displayName}</div>
                                                    {wallet.name === 'eternl' && (
                                                        <div className="text-xs opacity-75 flex items-center gap-1">
                                                            <Star className="w-3 h-3" />
                                                            Recommended
                                                        </div>
                                                    )}
                                                </div>
                                                {wallet.name === 'eternl' && (
                                                    <div className="ml-auto">
                                                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                                                    </div>
                                                )}
                                            </div>
                                        </Button>
                                    </motion.div>
                                ))}
                        </div>
                        {installedWallets.filter(w => w.installed).length === 0 && (
                            <p className="text-xs text-muted-foreground mt-2">
                                No wallets detected. Install Eternl or another Cardano wallet extension.
                            </p>
                        )}
                    </div>

                    {/* Manual Address Input */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <Label className="text-sm">Or Enter Address Manually</Label>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setIsManualMode(!isManualMode)}
                            >
                                {isManualMode ? <X className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />}
                            </Button>
                        </div>
                        <AnimatePresence>
                            {isManualMode && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                >
                                    <Input
                                        placeholder="addr1..."
                                        value={manualAddress}
                                        onChange={(e) => handleManualAddress(e.target.value)}
                                        className="font-mono text-sm"
                                    />
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Enter your Cardano address to use without wallet connection
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {error && (
                        <p className="text-xs text-red-500">{error}</p>
                    )}
                </div>
            )}

            {currentAddress && (
                <div className="mt-4 pt-4 border-t border-border">
                    <p className="text-xs text-muted-foreground mb-1">Active Address</p>
                    <p className="font-mono text-xs break-all">{currentAddress}</p>
                </div>
            )}
        </Card>
    );
}
