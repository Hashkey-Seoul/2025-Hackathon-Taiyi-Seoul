import {
	Navigate,
	Route,
	BrowserRouter as Router,
	Routes,
} from 'react-router-dom';
import BottomNavigation from './components/BottomNavigation';
import DeckList from './components/DeckList';
import QuizList from './components/QuizList';
import SelectQuestion from './components/SelectQuestion';
import Home from './pages/Home';
import Profile from './pages/Profile';

function App() {
	return (
		<Router>
			<div className='min-h-screen flex flex-col items-center justify-center p-4 bg-gray-900'>
				<div className='w-full max-w-2xl'>
					<Routes>
						<Route path='/' element={<Home />} />
						<Route path='/deck' element={<DeckList />} />
						<Route path='/deck/:deckId' element={<QuizList />} />
						<Route path='/quiz/:quizId' element={<SelectQuestion />} />
						<Route path='/profile' element={<Profile />} />
						<Route path='*' element={<Navigate to='/' replace />} />
					</Routes>
					<BottomNavigation />
				</div>
			</div>
		</Router>
	);
}

export default App;
