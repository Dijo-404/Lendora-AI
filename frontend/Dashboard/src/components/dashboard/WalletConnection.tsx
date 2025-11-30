import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Wallet, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { useCardanoWallet } from '@cardano-foundation/cardano-connect-with-wallet';

interface WalletConnectionProps {
    onAddressChange: (address: string) => void;
    defaultAddress?: string;
}

export function WalletConnection({ onAddressChange, defaultAddress = '' }: WalletConnectionProps) {
    const [address, setAddress] = useState(defaultAddress);
    const [error, setError] = useState<string | null>(null);

    const {
        isConnected,
        isConnecting,
        connect,
        disconnect,
        stakeAddress,
        usedAddresses,
        availableWallets,
        isEnabled,
    } = useCardanoWallet({
        limitNetwork: 'mainnet', // Can be 'mainnet' or 'testnet'
    });

    useEffect(() => {
        if (isConnected && usedAddresses && usedAddresses.length > 0) {
            const walletAddress = usedAddresses[0];
            setAddress(walletAddress);
            onAddressChange(walletAddress);
            setError(null);
        } else if (!isConnected) {
            setAddress('');
            onAddressChange('');
        }
    }, [isConnected, usedAddresses, onAddressChange]);

    const handleConnect = async () => {
        try {
            setError(null);
            await connect();
        } catch (err) {
            console.error("Failed to connect wallet:", err);
            setError(err instanceof Error ? err.message : "Failed to connect wallet");
        }
    };

    const handleDisconnect = () => {
        disconnect();
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
                    onClick={handleDisconnect}
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

            {!isEnabled && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-yellow-500/10 text-yellow-600 border border-yellow-500/20">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-sm">No Cardano wallet extension detected. Please install a Cardano wallet like Eternl, Nami, or Flint.</span>
                </div>
            )}

            <Button
                onClick={handleConnect}
                disabled={isConnecting || !isEnabled}
                className="w-full sm:w-auto gap-2"
            >
                {isConnecting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                    <Wallet className="w-4 h-4" />
                )}
                {isConnecting ? 'Connecting...' : 'Connect Cardano Wallet'}
            </Button>

            {availableWallets && availableWallets.length > 0 && (
                <div className="text-xs text-muted-foreground">
                    Available wallets: {availableWallets.join(', ')}
                </div>
            )}
        </div>
    );
}
