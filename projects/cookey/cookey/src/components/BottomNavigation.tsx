import { AiOutlineHome } from 'react-icons/ai';
import { CgProfile } from 'react-icons/cg';
import { useLocation, useNavigate } from 'react-router-dom';

export default function BottomNavigation() {
	const navigate = useNavigate();
	const location = useLocation();
	const currentPath = location.pathname;

	return (
		<nav className='fixed bottom-0 left-0 right-0 bg-gray-800 shadow-lg mx-auto'>
			<div className='flex justify-around items-center h-16'>
				<button
					onClick={() => navigate('/')}
					className={`flex flex-col items-center justify-center w-full h-full ${
						currentPath === '/' ? 'text-blue-500' : 'text-gray-400'
					}`}
				>
					<AiOutlineHome className='text-2xl' />
					<span className='text-xs mt-1'>Home</span>
				</button>
				<button
					onClick={() => navigate('/profile')}
					className={`flex flex-col items-center justify-center w-full h-full ${
						currentPath === '/profile' ? 'text-blue-500' : 'text-gray-400'
					}`}
				>
					<CgProfile className='text-2xl' />
					<span className='text-xs mt-1'>My Page</span>
				</button>
			</div>
		</nav>
	);
}
