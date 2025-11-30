import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Wallet, CheckCircle2, Loader2 } from 'lucide-react';

interface WalletConnectionProps {
    onAddressChange: (address: string) => void;
    defaultAddress?: string;
}

export function WalletConnection({ onAddressChange, defaultAddress = '' }: WalletConnectionProps) {
    const [address, setAddress] = useState(defaultAddress);
    const [isConnecting, setIsConnecting] = useState(false);

    const connectWallet = async () => {
        setIsConnecting(true);
        try {
            // Simulate wallet connection delay
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Mock Eternl wallet address
            const mockAddress = "addr1qx2fxv2umyhttkxyxp8x0dlpdt3k6cwng5pxj3jhsydzer3jcu5d8ps7zex2k2xt3UQdwq93jS8q9z5z5q5z5q5z5q5z5";
            setAddress(mockAddress);
            onAddressChange(mockAddress);
        } catch (error) {
            console.error("Failed to connect wallet", error);
        } finally {
            setIsConnecting(false);
        }
    };

    const disconnectWallet = () => {
        setAddress('');
        onAddressChange('');
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
    );
}
