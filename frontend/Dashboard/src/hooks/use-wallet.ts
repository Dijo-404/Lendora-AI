/**
 * Lendora AI - Wallet Hook
 * Manages Cardano wallet connections and operations
 */

import { useState, useEffect, useCallback } from 'react';

// Mock wallet interface (in production, use @cardano/wallet-js or similar)
interface Wallet {
    name: string;
    displayName: string;
    installed: boolean;
}

interface WalletState {
    installedWallets: Wallet[];
    isConnecting: boolean;
    isConnected: boolean;
    error: string | null;
    wallet: Wallet | null;
    address: string;
    shortAddress: string;
    balance: string;
    network: string;
}

const MOCK_WALLETS: Wallet[] = [
    {
        name: 'eternl',
        displayName: 'Eternl',
        installed: true // Mock as installed for demo
    },
    {
        name: 'nami',
        displayName: 'Nami',
        installed: false
    },
    {
        name: 'yoroi',
        displayName: 'Yoroi',
        installed: false
    },
    {
        name: 'flint',
        displayName: 'Flint',
        installed: false
    },
    {
        name: 'typhon',
        displayName: 'Typhon',
        installed: false
    },
    {
        name: 'gerowallet',
        displayName: 'GeroWallet',
        installed: false
    }
];

export function useWallet() {
    const [state, setState] = useState<WalletState>({
        installedWallets: MOCK_WALLETS,
        isConnecting: false,
        isConnected: false,
        error: null,
        wallet: null,
        address: '',
        shortAddress: '',
        balance: '0',
        network: 'Testnet'
    });

    // Check for installed wallets on mount
    useEffect(() => {
        checkInstalledWallets();
    }, []);

    const checkInstalledWallets = useCallback(() => {
        // In production, check for actual wallet extensions
        // For demo, we'll mock the wallet detection
        setState(prev => ({
            ...prev,
            installedWallets: MOCK_WALLETS.map(wallet => ({
                ...wallet,
                installed: wallet.name === 'eternl' // Mock Eternl as installed
            }))
        }));
    }, []);

    const connect = useCallback(async (walletName: 'nami' | 'eternl' | 'yoroi' | 'flint' | 'typhon' | 'gerowallet') => {
        setState(prev => ({ ...prev, isConnecting: true, error: null }));

        try {
            // Simulate connection delay
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Mock wallet connection
            const wallet = MOCK_WALLETS.find(w => w.name === walletName);
            if (!wallet?.installed) {
                throw new Error(`${wallet?.displayName || walletName} is not installed`);
            }

            // Generate mock address and balance
            const mockAddress = `addr1_${walletName}_${Date.now().toString(36)}`;
            const mockBalance = (Math.random() * 10000 + 1000).toFixed(2);

            setState(prev => ({
                ...prev,
                isConnecting: false,
                isConnected: true,
                wallet,
                address: mockAddress,
                shortAddress: `${mockAddress.slice(0, 8)}...${mockAddress.slice(-8)}`,
                balance: mockBalance,
                network: 'Mainnet' // Could be Testnet based on configuration
            }));

        } catch (error) {
            setState(prev => ({
                ...prev,
                isConnecting: false,
                error: error instanceof Error ? error.message : 'Connection failed'
            }));
        }
    }, []);

    const disconnect = useCallback(() => {
        setState(prev => ({
            ...prev,
            isConnected: false,
            wallet: null,
            address: '',
            shortAddress: '',
            balance: '0',
            error: null
        }));
    }, []);

    return {
        ...state,
        connect,
        disconnect,
    };
}
