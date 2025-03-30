import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccount } from 'wagmi';
import cookey from '../assets/cookey1.jpg';
import WalletConnect from '../components/WalletConnect';

export default function Home() {
	const { isConnected } = useAccount();
	const navigate = useNavigate();

	useEffect(() => {
		if (isConnected) {
			navigate('/deck');
		}
	}, [isConnected, navigate]);

	if (!isConnected) {
		return (
			<div className='max-w-md mx-auto flex flex-col items-center justify-center p-4 bg-gray-900 pb-16'>
				<div className='flex gap-8 mb-8'>
					<img
						src={cookey}
						className='h-24 w-24 rounded-md'
						alt='Hashkey logo'
					/>
				</div>
				<h1 className='text-4xl font-bold mb-2 text-white'>Cookey</h1>
				<p className='text-lg mb-6 text-gray-400'>Predict. Vote. Earn.</p>

				<div className='mt-6 max-w-md text-center'>
					<h3 className='font-bold text-gray-300 mb-2'>About Cookey</h3>
					<p className='text-gray-400 text-sm'>
						A social quiz platform based on collective intelligence where users
						answer questions or predict others' choices to earn rewards. Powered
						by Haeshi Key chain.
					</p>
				</div>

				<div className='mt-8 w-full max-w-sm'>
					<div className='bg-gray-800 p-4 rounded-lg shadow'>
						<p className='text-gray-400 mb-4'>
							Please connect your wallet to participate in surveys
						</p>
						<WalletConnect />
					</div>
				</div>
			</div>
		);
	}

	return <></>;
}
