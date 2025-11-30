import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Wallet, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';

interface WalletConnectionProps {
    onAddressChange: (address: string) => void;
    defaultAddress?: string;
}

export function WalletConnection({ onAddressChange, defaultAddress = '' }: WalletConnectionProps) {
    const [address, setAddress] = useState(defaultAddress);
    const [isConnecting, setIsConnecting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const connectWallet = async () => {
        setIsConnecting(true);
        try {
            setError(null);
            // Simulate wallet connection delay
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Mock Eternl wallet address for demo
            const mockAddress = "addr1qx2fxv2umyhttkxyxp8x0dlpdt3k6cwng5pxj3jhsydzer3jcu5d8ps7zex2k2xt3UQdwq93jS8q9z5z5q5z5q5z5q5z5";
            setAddress(mockAddress);
            onAddressChange(mockAddress);
        } catch (err) {
            console.error("Failed to connect wallet", err);
            setError(err instanceof Error ? err.message : "Failed to connect wallet");
        } finally {
            setIsConnecting(false);
        }
    };

    const disconnectWallet = () => {
        setAddress('');
        onAddressChange('');
        setError(null);
    };

    if (address) {
        return (
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500/10 text-green-600 border border-green-500/20">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="font-mono text-sm">
                        {address.slice(0, 8)}...{address.slice(-8)}
                    </span>
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={disconnectWallet}
                    className="hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30"
                >
                    Disconnect
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {error && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 text-red-600 border border-red-500/20">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-sm">{error}</span>
                </div>
            )}

            <Button
                onClick={connectWallet}
                disabled={isConnecting}
                className="w-full sm:w-auto gap-2"
            >
                {isConnecting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                    <Wallet className="w-4 h-4" />
                )}
                {isConnecting ? 'Connecting...' : 'Connect Wallet'}
            </Button>
        </div>
    );
}
