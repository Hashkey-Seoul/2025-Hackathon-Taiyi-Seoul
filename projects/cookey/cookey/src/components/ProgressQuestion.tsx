import { useState } from 'react';

function ProgressQuestion() {
  const [value, setValue] = useState(50);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = () => {
    setIsSubmitted(true);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-[#1C1C1C] rounded-lg text-white">
      <div className='mb-6'>
        <h2 className="text-2xl font-medium mb-4">
          Is this Image AI Generated or Real?
        </h2>
        {/* 이미지가 들어갈 자리 */}
        <div className="w-full h-64 bg-[#2C2C2C] rounded-lg mb-4"></div>
      </div>

      <div className='mb-6'>
        <div className="bg-[#6366F1]/20 text-white p-4 rounded-lg mb-4">
          <p>
            How many people do you think picked AI Generated?
          </p>
        </div>

        <div className="w-full">
          <input
            type="range"
            min="0"
            max="100"
            value={value}
            onChange={(e) => setValue(Number(e.target.value))}
            className="w-full h-2 bg-[#2C2C2C] rounded-lg appearance-none cursor-pointer"
            disabled={isSubmitted}
          />
          <div className="flex justify-between mt-2 text-sm text-gray-400">
            <span>No one</span>
            <span>{value}%</span>
            <span>Everyone</span>
          </div>
        </div>
      </div>

      {!isSubmitted && (
        <button
          onClick={handleSubmit}
          className="w-full py-3 px-4 bg-[#6366F1] hover:bg-[#6366F1]/90 text-white font-medium rounded-lg transition-colors"
        >
          Chomp
        </button>
      )}

      {isSubmitted && (
        <div>
          <div className="text-xl mb-4">
            Well done! 🎉
          </div>
          <div className="text-gray-300 mb-6">
            Now let's try a multiple choice question!
          </div>
          <button
            className="w-full py-3 px-4 bg-white text-black font-medium rounded-lg transition-colors hover:bg-gray-100"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default ProgressQuestion;
