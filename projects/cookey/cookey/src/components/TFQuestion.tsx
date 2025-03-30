import { useState } from 'react';

function TFQuestion() {
  const [selected, setSelected] = useState<'AI Generated' | 'Real' | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const handleAnswer = (answer: 'AI Generated' | 'Real') => {
    console.log(isCorrect);
    setSelected(answer);
    // 여기에 정답 체크 로직 추가
    setIsCorrect(answer === 'Real'); // 예시로 Real이 정답이라고 가정
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-[#1C1C1C] rounded-lg text-white">
      <div className='mb-6'>
        <h2 className="text-2xl font-medium mb-4">
          Is this Image AI Generated or Real?
        </h2>
        <div className="bg-[#6366F1] text-white p-4 rounded-lg mb-4">
          <p>
            Every card poses a question. This one has two possible responses.
          </p>
        </div>
        {/* 이미지가 들어갈 자리 */}
        <div className="w-full h-64 bg-[#2C2C2C] rounded-lg mb-4"></div>
      </div>

      <div className='mb-4'>
        <h3 className="text-xl mb-4">What do you think about this statement?</h3>
        <div className='w-full flex flex-col gap-3'>
          <button
            onClick={() => handleAnswer('AI Generated')}
            className={`w-full py-3 px-4 rounded-lg font-medium text-center transition-colors ${
              selected === 'AI Generated'
                ? 'bg-[#6366F1]'
                : 'bg-[#6366F1]/80 hover:bg-[#6366F1]'
            }`}
          >
            AI Generated
          </button>
          <button
            onClick={() => handleAnswer('Real')}
            className={`w-full py-3 px-4 rounded-lg font-medium text-center transition-colors ${
              selected === 'Real'
                ? 'bg-[#6366F1]'
                : 'bg-[#6366F1]/80 hover:bg-[#6366F1]'
            }`}
          >
            Real
          </button>
        </div>
      </div>

      {selected && (
        <button
          className="w-full py-3 px-4 bg-[#6366F1] hover:bg-[#6366F1]/90 text-white font-medium rounded-lg transition-colors"
        >
          Next
        </button>
      )}
    </div>
  );
}

export default TFQuestion;
