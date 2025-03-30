import { useState } from 'react';
import { useAccount } from 'wagmi';
import { calculateHSKAmount, sendHSKTokens } from '../utils/blockchain';

interface CreditOption {
	amount: number;
	pricePerCredit: number;
	isDiscounted?: boolean;
	originalPrice?: number;
}

interface BuyCreditsModalProps {
	isOpen: boolean;
	onClose: () => void;
	onBuyCredits: (amount: number) => void;
}

const creditOptions: CreditOption[] = [
	{
		amount: 500,
		pricePerCredit: 0.08, // 40 HSK for 500 credits (20% savings)
		isDiscounted: true,
		originalPrice: 0.1,
	},
	{
		amount: 200,
		pricePerCredit: 0.09, // 18 HSK for 200 credits (10% savings)
		isDiscounted: true,
		originalPrice: 0.1,
	},
	{
		amount: 100,
		pricePerCredit: 0.001, // 10 HSK for 100 credits (base price)
	},
];

export default function BuyCreditsModal({
	isOpen,
	onClose,
	onBuyCredits,
}: BuyCreditsModalProps) {
	const [customAmount, setCustomAmount] = useState<number>(0);
	const [isProcessing, setIsProcessing] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const { address } = useAccount();

	if (!isOpen) return null;

	const handleSelect = async (amount: number) => {
		if (!address) {
			setError('Please connect your wallet first');
			return;
		}

		try {
			setError(null);
			setIsProcessing(true);

			// Calculate HSK amount needed
			const hskAmount = calculateHSKAmount(amount);

			// Send the transaction
			const txHash = await sendHSKTokens(hskAmount);
			console.log('Transaction hash:', txHash);

			// Show success message before closing
			setError(null);

			// Call the onBuyCredits callback
			onBuyCredits(amount);

			// Close the modal after a short delay to show success
			setTimeout(() => {
				onClose();
			}, 1500);
		} catch (err) {
			console.error('Error processing purchase:', err);

			// Handle specific error messages
			if (err instanceof Error) {
				if (err.message.includes('hardware wallet')) {
					setError(
						'Please ensure your hardware wallet is connected, unlocked, and has the HashKey Chain network selected.'
					);
				} else if (err.message.includes('insufficient funds')) {
					setError('Insufficient HSK balance to complete the purchase.');
				} else if (err.message.includes('rejected')) {
					setError('Transaction was rejected. Please try again.');
				} else {
					setError(err.message);
				}
			} else {
				setError('Failed to process purchase. Please try again.');
			}
		} finally {
			setIsProcessing(false);
		}
	};

	const handleIncrement = () => {
		setCustomAmount((prev) => prev + 1);
	};

	const handleDecrement = () => {
		setCustomAmount((prev) => Math.max(0, prev - 1));
	};

	return (
		<div className='fixed inset-0 bg-gray-900/80 backdrop-blur-sm flex items-start justify-center z-50 p-4 md:p-6 overflow-y-auto'>
			<div className='relative bg-gray-800 rounded-xl w-full max-w-md border border-primary-900 shadow-xl my-8'>
				<button
					onClick={onClose}
					className='absolute -top-3 -right-3 bg-gray-800 text-primary-400 hover:text-primary-200 w-8 h-8 rounded-full flex items-center justify-center border border-primary-900 transition-colors shadow-lg z-10'
				>
					<svg
						className='w-5 h-5'
						fill='none'
						stroke='currentColor'
						viewBox='0 0 24 24'
					>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							strokeWidth={2}
							d='M6 18L18 6M6 6l12 12'
						/>
					</svg>
				</button>

				<div className='p-6 border-b border-primary-900/50'>
					<h2 className='text-2xl font-semibold text-primary-200'>
						Get Credits
					</h2>
					<p className='text-primary-400 mt-2'>
						Select your desired amount of credits and tap on "Get Credits" to
						purchase with HSK.
					</p>
				</div>

				{error && (
					<div className='mx-6 mt-4 p-4 bg-red-900/10 border border-red-800 rounded-lg'>
						<p className='text-red-400 text-sm'>{error}</p>
					</div>
				)}

				<div className='p-6 space-y-6'>
					<div>
						<div className='text-accent-300 font-medium mb-4 flex items-center gap-2'>
							<svg
								className='w-5 h-5'
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
							Best Value Deals!
						</div>

						{creditOptions.map((option, index) => (
							<button
								key={index}
								onClick={() => handleSelect(option.amount)}
								disabled={isProcessing}
								className='w-full bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 mb-3 border border-primary-900/50 hover:border-primary-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
							>
								<div className='flex justify-between items-center mb-2'>
									<span className='text-xl font-semibold text-primary-200'>
										{option.amount} Credits
									</span>
									<div className='text-right'>
										<span className='text-xl font-semibold text-primary-200'>
											{(option.amount * option.pricePerCredit).toFixed(1)} HSK
										</span>
										{option.isDiscounted && (
											<div className='text-sm text-accent-400'>
												<span className='line-through'>
													{(
														option.amount * (option.originalPrice || 0)
													).toFixed(1)}{' '}
													HSK
												</span>
												<span className='ml-2'>
													Save {option.amount >= 500 ? '20%' : '10%'}
												</span>
											</div>
										)}
									</div>
								</div>
							</button>
						))}
					</div>

					<div className='bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-primary-900/50 hover:border-primary-900 transition-colors'>
						<div className='flex items-center justify-between'>
							<input
								type='text'
								value={customAmount}
								readOnly
								className='bg-transparent text-primary-200 text-xl w-full'
								placeholder='0 Credits'
							/>
							<div className='flex gap-2'>
								<button
									onClick={handleDecrement}
									disabled={isProcessing}
									className='bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200 font-medium shadow-lg shadow-primary-900/20 disabled:opacity-50 disabled:cursor-not-allowed'
								>
									-
								</button>
								<button
									onClick={handleIncrement}
									disabled={isProcessing}
									className='bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200 font-medium shadow-lg shadow-primary-900/20 disabled:opacity-50 disabled:cursor-not-allowed'
								>
									+
								</button>
							</div>
						</div>
					</div>

					<div className='flex justify-between items-center'>
						<span className='text-primary-200'>Subtotal</span>
						<span className='text-primary-200'>
							{calculateHSKAmount(customAmount).toFixed(4)} HSK
						</span>
					</div>
				</div>

				<div className='p-6 border-t border-primary-900/50 space-y-3'>
					<button
						onClick={() => handleSelect(customAmount)}
						disabled={customAmount === 0 || isProcessing}
						className='w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white py-3 rounded-lg transition-all duration-200 font-medium shadow-lg shadow-primary-900/20 disabled:opacity-50 disabled:cursor-not-allowed'
					>
						{isProcessing ? 'Processing...' : 'Get Credits'}
					</button>

					<button
						onClick={onClose}
						disabled={isProcessing}
						className='w-full px-4 py-3 rounded-lg bg-red-900/10 hover:bg-red-900/20 text-red-400 border border-red-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
					>
						Cancel
					</button>
				</div>
			</div>
		</div>
	);
}
