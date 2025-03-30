import { BrowserProvider, Eip1193Provider } from 'ethers';
import { useState } from 'react';
import { useAccount, useConnect } from 'wagmi';
import { injected, walletConnect } from 'wagmi/connectors';
import okx from '../assets/okx.jpg';
import walletconnect from '../assets/walletconnect.webp';

interface WalletInfo {
	id: string;
	name: string;
	icon: string;
}

// Types for OKX Wallet request parameters
// type RequestParams = string[] | Record<string, unknown>[] | undefined;
// type RequestResponse = string | number | boolean | Record<string, unknown>;

// Interface for Ethereum Provider
interface EthereumProvider extends Eip1193Provider {
	isMetaMask?: boolean;
	isBitKeep?: boolean;
	isOKExWallet?: boolean;
}

// // Interface for OKX Wallet
// interface OKXWallet {
// 	isOKXWallet: boolean;
// 	request: (args: {
// 		method: string;
// 		params?: RequestParams;
// 	}) => Promise<RequestResponse>;
// 	enable: () => Promise<string[]>;
// }

// Extend Window interface to include wallet providers
declare global {
	interface Window {
		okxwallet?: EthereumProvider;
		// ethereum?: EthereumProvider;
	}
}

const wallets: WalletInfo[] = [
	{
		id: 'metamask',
		name: 'MetaMask',
		icon: 'https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg',
	},
	{
		id: 'okx',
		name: 'OKX Wallet',
		icon: okx,
	},
	{
		id: 'walletconnect',
		name: 'WalletConnect',
		icon: walletconnect,
	},
];

export default function WalletConnect() {
	const { connect } = useConnect();
	const { isConnected } = useAccount();
	const [error, setError] = useState<string | null>(null);

	if (isConnected) {
		return null;
	}

	const isMetaMaskInstalled = () => {
		return (
			typeof window !== 'undefined' &&
			window.ethereum?.isMetaMask === true &&
			window.ethereum?.isBitKeep !== true
		);
	};

	const isOKXWalletInstalled = () => {
		return typeof window !== 'undefined' && window.okxwallet !== undefined;
	};

	const connectWallet = async (walletId: string) => {
		try {
			setError(null);

			if (walletId === 'metamask') {
				if (isMetaMaskInstalled()) {
					await connect({
						connector: injected({
							target: 'metaMask',
						}),
					});
				} else {
					window.open('https://metamask.io/download/', '_blank');
					setError('Please install MetaMask to continue');
				}
			} else if (walletId === 'okx') {
				if (isOKXWalletInstalled() && window.okxwallet) {
					try {
						console.log('Connecting to OKX Wallet...');
						const provider = new BrowserProvider(window.okxwallet);
						const accounts = await provider.send('eth_requestAccounts', []);
						console.log('OKX Wallet accounts:', accounts);

						if (accounts.length > 0) {
							// Use wagmi's connect after getting accounts
							await connect({
								connector: injected(),
							});
						}
					} catch (error) {
						console.error('OKX Wallet connection error:', error);
						setError('Failed to connect to OKX Wallet. Please try again.');
					}
				} else {
					window.open('https://www.okx.com/web3', '_blank');
					setError('Please install OKX Wallet to continue');
				}
			} else if (walletId === 'walletconnect') {
				await connect({
					connector: walletConnect({
						projectId: '9a225b6bfcedbe8a131abc712204f6b4',
					}),
				});
			}
		} catch (err) {
			setError(
				`Failed to connect wallet: ${
					err instanceof Error ? err.message : 'Unknown error'
				}`
			);
		}
	};

	return (
		<div className='space-y-4'>
			{error && (
				<div className='p-4 text-red-600 bg-red-50 dark:bg-red-900/10 rounded-lg text-sm border border-red-200 dark:border-red-800'>
					{error}
				</div>
			)}
			{wallets.map((wallet) => (
				<button
					key={wallet.id}
					onClick={() => connectWallet(wallet.id)}
					className='w-full flex items-center justify-center space-x-3 px-4 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors shadow-md hover:shadow-lg'
				>
					<img src={wallet.icon} alt={wallet.name} className='w-6 h-6' />
					<span>Connect {wallet.name}</span>
				</button>
			))}
		</div>
	);
}
