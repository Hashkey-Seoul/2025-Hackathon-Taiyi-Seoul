import { http } from 'viem';
import { createConfig } from 'wagmi';
import { injected, walletConnect } from 'wagmi/connectors';
import { hashkeyChain } from './blockchain';

// WalletConnect Project ID - you should get your own from https://cloud.walletconnect.com
// This is a demo project ID
export const projectId = '9a225b6bfcedbe8a131abc712204f6b4';

// Create wagmi config
export const config = createConfig({
	chains: [hashkeyChain],
	transports: {
		[hashkeyChain.id]: http(),
	},
	connectors: [
		// Use injected connector that can handle both MetaMask and OKX
		injected(),
		walletConnect({
			projectId,
			showQrModal: true,
			metadata: {
				name: 'Snackey App',
				description: 'Wallet connection for Snackey dApp',
				url: 'https://snackey.app',
				icons: ['https://walletconnect.com/walletconnect-logo.png'],
			},
		}),
	],
});
