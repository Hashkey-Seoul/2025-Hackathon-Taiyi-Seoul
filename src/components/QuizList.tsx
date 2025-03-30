import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Deck, Quiz } from '../types/quiz';
import useStore from '../store/useStore';
import Swal from 'sweetalert2';
import { useUserData } from '../hooks/useUserData';
import { useAccount } from 'wagmi';
import BuyCreditsModal from './BuyCreditsModal';
export default function QuizList() {
  const { deckId } = useParams();
  const navigate = useNavigate();
  const { _deck } = useStore();
  const [deck, setDeck] = useState<Deck | null>(_deck);
  const [isBuyCreditsModalOpen, setIsBuyCreditsModalOpen] = useState(false);
  const { address } = useAccount();
  const { userData } = useUserData(address);

  useEffect(() => {
    if(_deck) {
      setDeck(_deck);
      return;
    }
    const storedDecks = localStorage.getItem('quizDecks');
    if (storedDecks) {
      const decks: Deck[] = JSON.parse(storedDecks);
      const currentDeck = decks.find(d => d.id === deckId);
      if (currentDeck) {
        setDeck(currentDeck);
      } else {
        // 덱을 찾을 수 없는 경우 메인으로 리다이렉트
        navigate('/', { replace: true });
      }
    } else {
      // 저장된 데이터가 없는 경우 메인으로 리다이렉트
      navigate('/', { replace: true });
    }
  }, [deckId, navigate, _deck]);

  const handleQuizSelect = (quiz: Quiz) => {
    if (quiz.isDone) {
      Swal.fire({
        icon: 'warning',
        // title: '경고!',
        text: 'You have already completed this quiz!',
        confirmButtonText: 'OK'
      });
      return;
    }

    const quizWithDeck = {
      ...quiz,
      deckId: deck?.id || '',
      deckTitle: deck?.title || '',
      quizTitle: quiz.question
    };
    navigate(`/quiz/${quiz.id}`, { state: { quiz: quizWithDeck } });
  };

  const handleBack = () => {
    navigate('/');
  };

  if (!deck) {
    return (
      <div className="flex items-center justify-center">
        <div className="animate-pulse text-gray-900 dark:text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-16">
      <div className='absolute top-4 right-4 flex items-center gap-2'>
				<button
					onClick={() => setIsBuyCreditsModalOpen(true)}
					className='flex items-center gap-2 bg-[#2C2C2C] hover:bg-[#3C3C3C] px-4 py-2 rounded-lg transition-colors'
				>
					<span className='text-gray-300'>Balance</span>
					<span className='text-white'>{userData?.credits} Credits,</span>
					<span className='text-white'>{userData?.point} Points</span>
					<span className='text-[#6366F1]'>+</span>
				</button>
			</div>
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={handleBack}
          className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{deck.title}</h1>
      </div>

      {deck.quizList.map((quiz, index) => {
        let buttonClass = 'w-full bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow text-left';
        if (quiz.isDone) {
          buttonClass += ' dark:bg-black opacity-20';
        } else {
          buttonClass += ' dark:bg-gray-800';
        }

        return <button
          key={quiz.id}
          onClick={() => handleQuizSelect(quiz)}
          className={buttonClass}
        >
          <div className="flex items-start gap-4">
            <span className="text-gray-500 dark:text-gray-400">#{index + 1}</span>
            <div>
              <h2 className="text-xl font-medium text-gray-900 dark:text-white mb-2">{quiz.question}</h2>
              <p className="text-gray-500 dark:text-gray-400">{quiz.answerList.length} options</p>
            </div>
          </div>
        </button>
      }
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