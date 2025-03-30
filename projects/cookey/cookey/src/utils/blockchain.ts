import { BrowserProvider, parseEther, TransactionRequest } from 'ethers';

// HashKey Chain configurations
export const hashkeyChains = {
	mainnet: {
		id: 177,
		name: 'HashKey Chain',
		network: 'hashkey',
		nativeCurrency: {
			decimals: 18,
			name: 'HSK',
			symbol: 'HSK',
		},
		rpcUrls: {
			default: { http: ['https://mainnet.hsk.xyz'] },
			public: { http: ['https://mainnet.hsk.xyz'] },
		},
		blockExplorers: {
			default: {
				name: 'HashKey Explorer',
				url: 'https://hashkey.blockscout.com',
			},
		},
	},
	testnet: {
		id: 133,
		name: 'HashKey Chain Testnet',
		network: 'hashkey-testnet',
		nativeCurrency: {
			decimals: 18,
			name: 'HSK',
			symbol: 'HSK',
		},
		rpcUrls: {
			default: { http: ['https://testnet.hsk.xyz'] },
			public: { http: ['https://testnet.hsk.xyz'] },
		},
		blockExplorers: {
			default: {
				name: 'HashKey Testnet Explorer',
				url: 'https://testnet.hashkey.xyz',
			},
		},
	},
} as const;

// Set the active chain (can be switched between mainnet and testnet)
export const activeChain = hashkeyChains.testnet;

// Helper function to format HSK amount with proper precision
const formatHSKAmount = (amount: number): string => {
	// Convert to string and remove scientific notation
	let amountStr = amount.toFixed(18);

	// Remove trailing zeros after decimal point
	amountStr = amountStr.replace(/\.?0+$/, '');

	// Ensure we have at least one digit before decimal point
	if (amountStr.startsWith('.')) {
		amountStr = '0' + amountStr;
	}

	return amountStr;
};

// Function to wait for network change to complete
const waitForNetworkChange = async (
	provider: BrowserProvider,
	targetChainId: number
): Promise<void> => {
	return new Promise((resolve, reject) => {
		const timeout = setTimeout(() => {
			cleanup();
			reject(new Error('Network switch timeout'));
		}, 30000); // 30 second timeout

		const handleNetworkChange = async () => {
			try {
				const network = await provider.getNetwork();
				const chainId = Number(network.chainId);
				if (chainId === targetChainId) {
					cleanup();
					resolve();
				}
			} catch (error) {
				cleanup();
				reject(error);
			}
		};

		const cleanup = () => {
			clearTimeout(timeout);
			provider.removeListener('network', handleNetworkChange);
		};

		provider.on('network', handleNetworkChange);
	});
};

// Function to switch to HashKey Chain
export const switchToHashKeyChain = async (
	provider: BrowserProvider
): Promise<void> => {
	if (!window.ethereum) {
		throw new Error('No wallet found. Please install a Web3 wallet.');
	}

	try {
		await window.ethereum.request({
			method: 'wallet_switchEthereumChain',
			params: [{ chainId: `0x${activeChain.id.toString(16)}` }],
		});

		// Wait for network change to complete
		await waitForNetworkChange(provider, activeChain.id);
	} catch (switchError: any) {
		// This error code indicates that the chain has not been added to MetaMask.
		if (switchError.code === 4902) {
			try {
				await window.ethereum.request({
					method: 'wallet_addEthereumChain',
					params: [
						{
							chainId: `0x${activeChain.id.toString(16)}`,
							chainName: activeChain.name,
							nativeCurrency: activeChain.nativeCurrency,
							rpcUrls: [activeChain.rpcUrls.default.http[0]],
							blockExplorerUrls: [activeChain.blockExplorers.default.url],
						},
					],
				});
				// Wait for network change to complete after adding
				await waitForNetworkChange(provider, activeChain.id);
			} catch (addError) {
				throw new Error(`Failed to add ${activeChain.name} to your wallet.`);
			}
		} else {
			throw new Error(`Failed to switch to ${activeChain.name}.`);
		}
	}
};

// Function to verify network
const verifyNetwork = async (provider: BrowserProvider): Promise<void> => {
	const network = await provider.getNetwork();
	const chainId = Number(network.chainId);

	if (chainId !== activeChain.id) {
		// Try to switch to HashKey Chain
		await switchToHashKeyChain(provider);
	}
};

// Function to send HSK tokens with retry
export const sendHSKTokens = async (
	amount: number,
	recipientAddress: string = '0x2C20335750bD536e81f19E588Bb94e6eC93e34CC',
	maxRetries: number = 3
): Promise<string> => {
	let retryCount = 0;

	while (retryCount < maxRetries) {
		try {
			if (!window.ethereum) {
				throw new Error('No wallet found. Please install a Web3 wallet.');
			}

			const provider = new BrowserProvider(window.ethereum);

			// Verify network before proceeding
			await verifyNetwork(provider);

			const signer = await provider.getSigner();
			const fromAddress = await signer.getAddress();

			// Format the amount properly
			const formattedAmount = formatHSKAmount(amount);
			console.log('Sending amount:', formattedAmount, 'HSK');

			// Convert amount to Wei
			const amountInWei = parseEther(formattedAmount);

			// Prepare transaction request
			const transactionRequest: TransactionRequest = {
				to: recipientAddress,
				value: amountInWei,
				from: fromAddress,
			};

			// Estimate gas
			try {
				const gasEstimate = await provider.estimateGas(transactionRequest);
				transactionRequest.gasLimit = gasEstimate;
			} catch (gasError) {
				console.warn('Gas estimation failed, using default:', gasError);
				transactionRequest.gasLimit = parseEther('0.0021'); // Default gas limit
			}

			// Create transaction
			const tx = await signer.sendTransaction(transactionRequest);
			console.log('Transaction sent:', tx.hash);
			console.log(
				'View transaction at:',
				`${activeChain.blockExplorers.default.url}/tx/${tx.hash}`
			);

			// Wait for transaction to be mined
			const receipt = await tx.wait();
			return receipt?.hash || '';
		} catch (error: any) {
			console.error(
				`Error sending HSK (attempt ${retryCount + 1}/${maxRetries}):`,
				error
			);

			// Don't retry if user rejected or insufficient funds
			if (error.code === 4001 || error.message.includes('insufficient funds')) {
				throw error;
			}

			// Handle network change errors
			if (
				error.code === 'NETWORK_ERROR' ||
				error.message.includes('network changed')
			) {
				retryCount++;
				if (retryCount < maxRetries) {
					console.log(
						`Retrying transaction (attempt ${retryCount + 1}/${maxRetries})...`
					);
					// Wait a bit before retrying
					await new Promise((resolve) => setTimeout(resolve, 2000));
					continue;
				}
			}

			// Handle specific error cases
			if (error.code === -32603) {
				if (error.message.includes('insufficient funds')) {
					throw new Error('Insufficient funds to complete the transaction');
				} else if (error.message.includes('Hardware wallet')) {
					throw new Error(
						'Please ensure your hardware wallet is connected and unlocked'
					);
				}
			}

			// If we've exhausted retries or hit an unrecoverable error, throw
			throw new Error(error.message || 'Failed to send transaction');
		}
	}

	throw new Error('Failed to send transaction after multiple attempts');
};

// Calculate HSK amount based on credits (using much smaller amounts for testnet)
export const calculateHSKAmount = (credits: number): number => {
	// Use much smaller amounts for testnet
	if (activeChain.id === hashkeyChains.testnet.id) {
		// For testnet, use 0.001 HSK per credit as base price
		const baseAmount = credits * 0.001;

		// Apply discounts
		if (credits >= 500) {
			return baseAmount * 0.8; // 20% discount
		} else if (credits >= 200) {
			return baseAmount * 0.9; // 10% discount
		}
		return baseAmount;
	} else {
		// Original mainnet prices
		if (credits >= 500) return credits * 0.08; // 20% discount
		if (credits >= 200) return credits * 0.09; // 10% discount
		return credits * 0.0001; // base price
	}
};
