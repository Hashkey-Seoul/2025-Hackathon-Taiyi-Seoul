import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useAccount } from 'wagmi';
import { useUserData } from '../hooks/useUserData';
import useStore from '../store/useStore';
import { Deck, QuizSubmission, QuizWithDeck } from '../types/quiz';
import BuyCreditsModal from './BuyCreditsModal';

function SelectQuestion() {
  const location = useLocation();
  const navigate = useNavigate();
  const { quizId } = useParams();
  const quiz = location.state?.quiz as QuizWithDeck;
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [progressValue, setProgressValue] = useState<number>(50);
  const [showProgress, setShowProgress] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isBuyCreditsModalOpen, setIsBuyCreditsModalOpen] = useState(false);
  const [showTimeoutAlert, setShowTimeoutAlert] = useState(false);
  const { address } = useAccount();
  const { _setDeck, _setUserData } = useStore();
  const { userData } = useUserData(address);

  useEffect(() => {
    // URL의 quizId와 state의 quiz.id가 일치하지 않으면 메인으로 리다이렉트
    if (!quiz || quiz.id !== quizId) {
      navigate('/', { replace: true });
      return;
    }
  }, [quiz, quizId, navigate]);

  const submitQuiz = async (isTimeout: boolean = false) => {
    const submission: QuizSubmission = {
      deckId: quiz.deckId,
      deckTitle: quiz.deckTitle,
      quizId: quiz.id,
      quizTitle: quiz.quizTitle,
      selectedAnswer: isTimeout ? '' : selectedOption || '',
      timeout: isTimeout,
      selectedPercentage: isTimeout ? -1 : progressValue,
      walletAddress: address!.toString(), // 지갑 주소는 추후 연동
    };

    const response = await fetch('/api/quiz/submission', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(submission),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // API 호출 로직 추가 예정
    console.log('Complete: submit quiz:', submission);

    const result = await response.json();
    if (result.code === 0) {
      const storedDecks = localStorage.getItem('quizDecks');
      if (storedDecks) {
        const decks: Deck[] = JSON.parse(storedDecks);
        const currentDeck = decks.find(d => d.id === quiz.deckId);
        if (currentDeck) {
          currentDeck.quizList = result.data;
          const index = decks.findIndex(d => d.id === quiz.deckId);
          decks[index] = currentDeck;
          _setDeck(currentDeck);
          if (userData) {
            _setUserData({ ...userData, credits: result.data!.credits, point: result.data!.point });
          } else {
            console.error('userData is null, cannot update user data');
          }
          localStorage.setItem('quizDecks', JSON.stringify(decks));

          // // index + 1 퀴즈가 있으면 다음 퀴즈로 이동, 없으면 메인으로 이동
          // const nextQuizIndex = decks[index].quizList.findIndex(q => q.id === result.data[0].id);
          // if (nextQuizIndex !== -1) {
          //   console.log('decks[index].quizList[nextQuizIndex + 1]', decks[index].quizList[nextQuizIndex + 1]);
          //   navigate(`/quiz/${quiz.id}`, { state: { quiz: decks[index].quizList[nextQuizIndex + 1] } });
          // } else {
          //   navigate('/');
          // }
        }
      }
    }
  };

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(timer);
    } else {
      setShowTimeoutAlert(true);
      submitQuiz(true);
    }
  }, [timeLeft]);

  const handleOptionSelect = (option: string) => {
    if (isAnswered) return;
    setSelectedOption(option);
    setIsAnswered(true);
    setShowProgress(true);
  };

  const handleConfirm = () => {
    submitQuiz();
    navigate(-1);
  };

  const handleTimeoutConfirm = () => {
    setShowTimeoutAlert(false);
    navigate(-1);
  };

  if (!quiz) {
    return <div className='text-center'>퀴즈를 찾을 수 없습니다.</div>;
  }

  const isCorrect = quiz.correctAnswer && selectedOption === quiz.correctAnswer;

  return (
    <div className='max-w-2xl mx-auto p-6 bg-[#1C1C1C] rounded-lg text-white relative'>
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
      <style>
        {`
          .timer-circle {
            width: 24px;
            height: 24px;
            position: relative;
          }
          .timer-circle::after {
            content: '';
            position: absolute;
            width: 4px;
            height: 4px;
            background-color: #6366F1;
            border-radius: 50%;
            top: 0;
            left: 50%;
            transform-origin: 50% 12px;
            transform: translateX(-50%);
            opacity: 0;
          }
          .timer-circle.start::after {
            opacity: 1;
            animation: timerRotate 60s linear infinite;
          }
          @keyframes timerRotate {
            0% {
              transform: translateX(-50%) rotate(0deg);
            }
            100% {
              transform: translateX(-50%) rotate(-360deg);
            }
          }
        `}
      </style>
      <div className='absolute top-4 left-4 flex items-center gap-2'>
        <div className='relative w-6 h-6'>
          <svg className='w-6 h-6 transform -rotate-90'>
            <circle
              className='text-gray-300'
              strokeWidth='2'
              stroke='currentColor'
              fill='transparent'
              r='10'
              cx='12'
              cy='12'
            />
            <circle
              className='text-[#6366F1]'
              strokeWidth='2'
              strokeDasharray={60}
              strokeDashoffset={60 - (timeLeft / 60) * 60}
              strokeLinecap='round'
              stroke='currentColor'
              fill='transparent'
              r='10'
              cx='12'
              cy='12'
            />
          </svg>
          <span className='absolute inset-0 flex items-center justify-center text-xs text-gray-300'>
            {timeLeft}
          </span>
        </div>
      </div>

      <div className='mb-6 mt-8'>
        <h2 className='text-2xl font-medium mb-6'>{quiz.question}</h2>

        <div className='w-full flex flex-col gap-3'>
          {quiz.answerList.map((answer, index) => {
            let buttonClass =
              'w-full flex items-center gap-4 py-3 px-4 rounded-lg font-medium transition-colors';

            if (!quiz.correctAnswer) {
              if (selectedOption === answer) {
                buttonClass += ' bg-purple-600';
              } else {
                buttonClass += ' bg-[#2C2C2C] hover:bg-[#3C3C3C]';
              }
            } else {
              if (isAnswered) {
                if (answer === quiz.correctAnswer) {
                  buttonClass += ' bg-green-600';
                } else if (answer === selectedOption) {
                  buttonClass += ' bg-red-600';
                } else {
                  buttonClass += ' bg-[#2C2C2C]';
                }
              } else {
                if (selectedOption === answer) {
                  buttonClass += ' bg-[#6366F1]';
                } else {
                  buttonClass += ' bg-[#2C2C2C] hover:bg-[#3C3C3C]';
                }
              }
            }

            return (
              <button
                key={index}
                onClick={() => handleOptionSelect(answer)}
                disabled={isAnswered}
                className={buttonClass}
              >
                <span className='w-8 h-8 flex items-center justify-center bg-[#3C3C3C] rounded-lg'>
                  {String.fromCharCode(65 + index)}
                </span>
                <span>{answer}</span>
              </button>
            );
          })}
        </div>
      </div>

      {isAnswered && quiz.correctAnswer && (
        <div className='mt-4 text-center'>
          <p
            className={`text-xl font-bold ${isCorrect ? 'text-green-500' : 'text-red-500'
              }`}
          >
            {isCorrect ? '정답입니다! 🎉' : '틀렸습니다. 😢'}
          </p>
        </div>
      )}

      {showProgress && (
        <div className='mt-8'>
          <div className='bg-[#6366F1]/20 text-white p-4 rounded-lg mb-4'>
            <p>How many people do you think chose this answer?</p>
          </div>

          <div className='w-full'>
            <input
              type='range'
              min='0'
              max='100'
              value={progressValue}
              onChange={(e) => setProgressValue(Number(e.target.value))}
              className='w-full h-2 bg-[#2C2C2C] rounded-lg appearance-none cursor-pointer'
            />
            <div className='flex justify-between mt-2 text-sm text-gray-400'>
              <span>No one</span>
              <span>{progressValue}%</span>
              <span>Everyone</span>
            </div>
          </div>

          <button
            onClick={handleConfirm}
            className='w-full mt-6 py-3 px-4 bg-[#6366F1] hover:bg-[#6366F1]/90 text-white font-medium rounded-lg transition-colors'
          >
            Confirm
          </button>
        </div>
      )}

      {showTimeoutAlert && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-[#1C1C1C] rounded-lg p-6 w-full max-w-md'>
            <h2 className='text-xl text-white font-medium mb-4'>
              시간초과 되었습니다
            </h2>
            <button
              onClick={handleTimeoutConfirm}
              className='w-full bg-[#6366F1] text-white py-3 rounded-lg hover:bg-[#6366F1]/90 transition-colors'
            >
              확인
            </button>
          </div>
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

export default SelectQuestion;
