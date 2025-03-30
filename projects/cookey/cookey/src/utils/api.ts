import axios from 'axios';

interface UserData {
	wallet: string;
	point: number;
	credits: number;
}

const API_BASE_URL = '/api'; // Adjust this based on your backend URL

export const createUser = async (wallet: string): Promise<UserData> => {
	try {
		const response = await axios.post(`${API_BASE_URL}/user`, { wallet });
		console.log('Create user response:', response.data);
		return response.data;
	} catch (error) {
		console.error('Error creating user:', error);
		throw error;
	}
};

export const getUserData = async (wallet: string): Promise<UserData> => {
	try {
		const response = await axios.get(`${API_BASE_URL}/user/${wallet}`);
		console.log('Get user response:', response.data);
		// Check if the point is in the response or nested
		const userData = response.data.data || response.data;
		console.log('Processed user data:', userData);
		return userData;
	} catch (error) {
		console.error('Error fetching user data:', error);
		throw error;
	}
};

export const requestUnlockDeck = async (walletAddress: string, deckId: string) => {
	const response = await axios.post(`${API_BASE_URL}/quiz/deck/unlock`, { walletAddress, deckId });
	return response.data;
};
