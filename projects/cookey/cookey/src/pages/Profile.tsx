import { useState } from 'react';
import { useAccount, useDisconnect } from 'wagmi';
import BuyCreditsModal from '../components/BuyCreditsModal';
import WalletConnect from '../components/WalletConnect';
import { useUserData } from '../hooks/useUserData';

export default function Profile() {
	const { address, isConnected } = useAccount();
	const { disconnect } = useDisconnect();
	const { userData, loading, error } = useUserData(address);
	const [copied, setCopied] = useState(false);
	const [isBuyCreditsModalOpen, setIsBuyCreditsModalOpen] = useState(false);

	const truncateAddress = (addr: string) => {
		if (!addr) return '';
		return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
	};

	const copyToClipboard = async (text: string) => {
		try {
			// Try the modern clipboard API first
			if (navigator.clipboard && window.isSecureContext) {
				await navigator.clipboard.writeText(text);
				setCopied(true);
				setTimeout(() => setCopied(false), 2000);
			} else {
				// Fallback for older browsers and mobile
				const textArea = document.createElement('textarea');
				textArea.value = text;
				textArea.style.position = 'fixed';
				textArea.style.left = '-999999px';
				textArea.style.top = '-999999px';
				document.body.appendChild(textArea);
				textArea.focus();
				textArea.select();

				try {
					document.execCommand('copy');
					textArea.remove();
					setCopied(true);
					setTimeout(() => setCopied(false), 2000);
				} catch (err) {
					console.error('Fallback: Oops, unable to copy', err);
					textArea.remove();
				}
			}
		} catch (err) {
			console.error('Failed to copy:', err);
		}
	};

	if (!isConnected) {
		return (
			<div className='max-w-md mx-auto p-4 bg-gray-900'>
				<h1 className='text-2xl font-bold mb-4 text-primary-200'>My Page</h1>
				<div className='bg-gray-800 p-4 rounded-lg shadow-lg border border-primary-900'>
					<p className='text-gray-400 mb-4'>
						Please connect your wallet to access your profile
					</p>
					<WalletConnect />
				</div>
			</div>
		);
	}

	return (
		<div className='max-w-md mx-auto min-h-screen p-4 bg-gray-900 pb-16'>
			<h1 className='text-2xl font-bold mb-4 text-primary-200'>My Page</h1>

			{/* Profile Info */}
			<div className='bg-gray-800 p-6 rounded-lg shadow-lg border border-primary-900 mb-4'>
				<div className='flex items-center space-x-4'>
					<div className='w-16 h-16 bg-primary-900 rounded-full flex items-center justify-center overflow-hidden'>
						<img src='/favicon.svg' alt='Profile' className='w-20 h-16' />
					</div>
					<div className='flex-1'>
						<h2 className='text-lg font-semibold text-primary-100'>
							{loading
								? 'Loading...'
								: error
								? 'Error loading data'
								: 'User Profile'}
						</h2>
						<button
							onClick={() => address && copyToClipboard(address)}
							className='group flex items-center space-x-2 text-sm text-primary-400 font-mono bg-primary-900/30 px-3 py-1.5 rounded-lg hover:bg-primary-900/50 transition-colors'
						>
							<span>{address ? truncateAddress(address) : ''}</span>
							{copied ? (
								<svg
									xmlns='http://www.w3.org/2000/svg'
									className='h-4 w-4 text-green-500'
									viewBox='0 0 20 20'
									fill='currentColor'
								>
									<path
										fillRule='evenodd'
										d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
										clipRule='evenodd'
									/>
								</svg>
							) : (
								<svg
									xmlns='http://www.w3.org/2000/svg'
									className='h-4 w-4 opacity-70 group-hover:opacity-100'
									viewBox='0 0 20 20'
									fill='currentColor'
								>
									<path d='M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z' />
									<path d='M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z' />
								</svg>
							)}
						</button>
					</div>
				</div>
			</div>

			{/* Points and Credits Container */}
			<div className='grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4'>
				{/* Points Container */}
				<div className='bg-gray-800/50 backdrop-blur-sm p-5 rounded-xl shadow-lg border border-accent-900/50 hover:border-accent-900 transition-colors'>
					<div className='flex items-center gap-2 mb-3'>
						<svg
							className='w-5 h-5 text-accent-300'
							fill='none'
							stroke='currentColor'
							viewBox='0 0 24 24'
						>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth={2}
								d='M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
							/>
						</svg>
						<h2 className='text-base sm:text-lg font-semibold text-accent-300'>
							Points Overview
						</h2>
					</div>
					{!loading && !error && userData && (
						<div className='bg-gradient-to-br from-accent-900/20 to-accent-900/5 rounded-xl p-4 border border-accent-800/50'>
							<div className='flex flex-row justify-between sm:flex-col sm:justify-start items-center sm:items-start gap-2 sm:gap-1'>
								<span className='text-sm text-accent-400'>Total Points</span>
								<span className='text-3xl sm:text-4xl font-bold text-accent-200 tracking-tight'>
									{userData.point}
								</span>
							</div>
						</div>
					)}
					{error && (
						<div className='p-4 bg-red-900/10 rounded-xl border border-red-800/50'>
							<p className='text-red-400'>{error}</p>
						</div>
					)}
				</div>

				{/* Credits Container */}
				<div className='bg-gray-800/50 backdrop-blur-sm p-5 rounded-xl shadow-lg border border-primary-900/50 hover:border-primary-900 transition-colors'>
					<div className='flex items-center gap-2 mb-3'>
						<svg
							className='w-5 h-5 text-primary-300'
							fill='none'
							stroke='currentColor'
							viewBox='0 0 24 24'
						>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth={2}
								d='M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z'
							/>
						</svg>
						<h2 className='text-base sm:text-lg font-semibold text-primary-300'>
							Credits Balance
						</h2>
					</div>
					<div className='bg-gradient-to-br from-primary-900/20 to-primary-900/5 rounded-xl p-4 border border-primary-800/50'>
						<div className='flex flex-row justify-between sm:flex-col sm:justify-start items-center sm:items-start gap-2 sm:gap-1'>
							<span className='text-sm text-primary-400'>
								Available Credits
							</span>
							{loading ? (
								<div className='text-primary-200 text-lg animate-pulse'>
									Loading...
								</div>
							) : error ? (
								<div className='text-red-400 text-sm'>
									Error loading credits
								</div>
							) : (
								<span className='text-3xl sm:text-4xl font-bold text-primary-200 tracking-tight'>
									{(userData?.credits ?? 0).toFixed(0)}
								</span>
							)}
						</div>
					</div>
					<button
						onClick={() => setIsBuyCreditsModalOpen(true)}
						disabled={loading}
						className='w-full mt-3 py-2.5 px-4 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white rounded-lg transition-all duration-200 font-medium shadow-lg shadow-primary-900/20 disabled:opacity-50 disabled:cursor-not-allowed'
					>
						{loading ? 'Loading...' : 'Get Credits'}
					</button>
				</div>
			</div>

			{/* Settings Section */}
			<div className='bg-gray-800 p-6 rounded-lg shadow-lg border border-primary-900'>
				<h2 className='text-lg font-semibold mb-4 text-primary-200'>
					Settings
				</h2>
				<div className='space-y-3'>
					<button
						onClick={() => disconnect()}
						className='w-full text-left px-4 py-3 rounded-lg bg-red-900/10 hover:bg-red-900/20 text-red-400 border border-red-800 transition-colors'
					>
						Disconnect Wallet
					</button>
					<button
						className='w-full text-left px-3
          py-2 rounded-md hover:bg-gray-700 text-gray-300'
					>
						Notification Preferences
					</button>
					<button
						className='w-full text-left px-3
          py-2 rounded-md hover:bg-gray-700 text-gray-300'
					>
						Display Settings
					</button>
					<button
						className='w-full text-left px-3
          py-2 rounded-md hover:bg-gray-700 text-gray-300'
					>
						Privacy Settings
					</button>
				</div>
			</div>
			<BuyCreditsModal
				isOpen={isBuyCreditsModalOpen}
				onClose={() => setIsBuyCreditsModalOpen(false)}
				onBuyCredits={async (amount) => {
					try {
						console.log('Buying credits:', amount);
						// Here you would typically make an API call to purchase credits
						// For now, we'll just close the modal
						setIsBuyCreditsModalOpen(false);
					} catch (err) {
						console.error('Failed to purchase credits:', err);
						// You might want to show an error toast or message here
					}
				}}
			/>
		</div>
	);
}
