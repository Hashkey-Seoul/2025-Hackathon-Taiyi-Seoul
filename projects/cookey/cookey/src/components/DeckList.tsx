import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Deck, ApiResponse } from '../types/quiz';
import { useAccount } from 'wagmi';
import Swal from 'sweetalert2';
import { requestUnlockDeck } from '../utils/api';
import BuyCreditsModal from './BuyCreditsModal';
import { useUserData } from '../hooks/useUserData';
import useStore from '../store/useStore';
export default function DeckList() {
	const [decks, setDecks] = useState<Deck[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const navigate = useNavigate();
	const { address } = useAccount();
	const { userData } = useUserData(address);
	const [isBuyCreditsModalOpen, setIsBuyCreditsModalOpen] = useState(false);
	const { _userData ,_setUserData } = useStore();

	useEffect(() => {
		fetchDecks();
	}, [userData]);

	const fetchDecks = async () => {
		try {
			setIsLoading(true);
			setError(null);

			const response = await fetch(`/api/quiz/deck/${address}`);
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const result: ApiResponse<Deck[]> = await response.json();
			if (result.code === 0 && Array.isArray(result.data)) {
				localStorage.setItem('quizDecks', JSON.stringify(result.data));
				setDecks(result.data);
				console.log('result.data', result.data, userData);
				if (userData) {
					_setUserData({ ...userData, credits: result.data[0].credits, point: result.data[0].points });
				} else {
					console.error('userData is null, cannot update user data');
				}
			} else {
				throw new Error(result.message || 'Failed to fetch decks');
			}
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : 'Failed to fetch decks';
			setError(errorMessage);
			console.error('Error fetching decks:', error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleDeckSelect = async (deck: Deck) => {
		if (!deck.isUnlock) {
			const response = await requestUnlockDeck(address!.toString(), deck.id);
			console.log(response);

			if (response.code === 0) {
				Swal.fire({
					icon: 'success',
					title: 'Unlock Success!',
					text: 'You can now play the quiz.',
					confirmButtonText: 'OK'
				});

				// update deck list
				fetchDecks();
			} else {
				Swal.fire({
					icon: 'warning',
					title: 'Unlock failed!',
					text: response.message,
					// text: '\nyou need to have enough points to unlock the deck.',
					confirmButtonText: 'OK'
				});
			}
			return;
		}

		navigate(`/deck/${deck.id}`);
	};

	if (isLoading) {
		return (
			<div className='flex items-center justify-center min-h-screen'>
				<div className='animate-pulse text-white'>Loading...</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className='flex items-center justify-center min-h-screen'>
				<div className='text-center'>
					<p className='text-red-500 mb-4'>{error}</p>
					<button
						onClick={fetchDecks}
						className='bg-[#6366F1] text-white px-4 py-2 rounded-lg hover:bg-[#6366F1]/90 transition-colors'
					>
						Retry
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className='min-h-screen -mt-4 -mb-4'>
			<div className='absolute top-4 right-4 flex items-center gap-2'>
				<button
					onClick={() => setIsBuyCreditsModalOpen(true)}
					className='flex items-center gap-2 bg-[#2C2C2C] hover:bg-[#3C3C3C] px-4 py-2 rounded-lg transition-colors'
				>
					<span className='text-gray-300'>Balance</span>
					<span className='text-white'>{_userData?.credits} Credits,</span>
					<span className='text-white'>{_userData?.point} Points</span>
					<span className='text-[#6366F1]'>+</span>
				</button>
			</div>
			<h1 className='text-2xl font-bold text-white mb-6 mt-10'>Quiz Decks</h1>
			{decks.length === 0 ? (
				<div className='text-center text-gray-400 min-h-[200px] flex items-center justify-center'>
					No quiz decks available
				</div>
			) : (
				<div className='grid gap-4 sm:grid-cols-1 md:grid-cols-1'>
					{decks.map((deck) => {
						let buttonClass = 'pointer-events-auto relative z-0 w-full text-left p-4 bg-[#1C1C1C] rounded-lg';
						if (!deck.isUnlock) {
							buttonClass += ' opacity-40';
						} else {
							// buttonClass += ' bg-gray-800';
						}

						return (
							<div className="relative" key={deck.id}>
								{/* 흐린 버튼 전체 */}
								<button
									key={deck.id}
									onClick={() => handleDeckSelect(deck)}
									className={buttonClass}
								>
									<h2 className="text-xl font-medium text-white mb-2">{deck.title}</h2>
									<p className="text-gray-400 text-sm">
										{deck.quizList.length || deck.cost} {deck.quizList.length === 1 ? 'quiz' : 'quizzes'}
									</p>
									<div className="mt-4 flex items-center justify-between">
										<div className="flex items-center text-sm text-gray-400">
											<svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
											</svg>
											Start Quiz
										</div>
										<div className="text-[#6366F1]">
											<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
											</svg>
										</div>
									</div>
								</button>

								{/* Locked 표시 – 오른쪽 위 작고 선명하게 */}
								{!deck.isUnlock ? (
									<div className="absolute top-2 right-3 z-10 flex items-center text-red-500 bg-[#1C1C1C] px-2 py-1 rounded-md shadow-sm">
										<svg
											className="w-4 h-4 mr-1"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M12 2v4m0 0v4m0-4h4m-4 0H8"
											/>
										</svg>
										<span className="text-lg font-semibold">Locked</span>
									</div>
								) : (
									<div className="absolute top-2 right-3 z-10 flex items-center text-green-500 bg-[#1C1C1C] px-2 py-1 rounded-md shadow-sm">
										<span className="text-lg font-semibold">Unlocked</span>
									</div>
								)}
							</div>
						);
					})}
				</div>
			)}

			<BuyCreditsModal
				isOpen={isBuyCreditsModalOpen}
				onClose={() => setIsBuyCreditsModalOpen(false)}
				onBuyCredits={(amount) => {
					console.log('Buying credits:', amount);
					setIsBuyCreditsModalOpen(false);
				}}
			/>
		</div>
	);
}
