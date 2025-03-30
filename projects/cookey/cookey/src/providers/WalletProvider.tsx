import { createWeb3Modal } from '@web3modal/wagmi';
import { ReactNode } from 'react';
import { WagmiProvider } from 'wagmi';
import { config, projectId } from '../utils/wallet';

// Create the Web3Modal instance
createWeb3Modal({
	wagmiConfig: config,
	projectId,
	enableAnalytics: true,
	themeMode: 'light',
	featuredWalletIds: [],
	includeWalletIds: [
		'c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96', // MetaMask
		'f2436c67184f158d1beda5df53298ee84abfc367581e4505134b5bcf5f46697d', // OKX Wallet
	],
	defaultChain: config.chains[0],
});

interface WalletProviderProps {
	children: ReactNode;
}

export function WalletProvider({ children }: WalletProviderProps) {
	return <WagmiProvider config={config}>{children}</WagmiProvider>;
}
