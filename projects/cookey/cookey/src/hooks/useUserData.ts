import { AxiosError } from 'axios';
import { useEffect, useState } from 'react';
import { createUser, getUserData } from '../utils/api';

export interface UserData {
	wallet: string | undefined;
	point: number;
	credits: number;
}

export const useUserData = (wallet: string | undefined) => {
	const [userData, setUserData] = useState<UserData | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchUserData = async () => {
			if (!wallet) return;

			setLoading(true);
			setError(null);

			console.log('Attempting to fetch user data for wallet:', wallet);
			try {
				// Try to get existing user data
				const data = await getUserData(wallet);
				console.log('Raw user data received:', data);

				// Validate the data structure
				if (
					typeof data.point !== 'number' ||
					typeof data.credits !== 'number'
				) {
					console.error('Invalid data format in response:', data);
					setError('Invalid data format received');
					return;
				}

				setUserData(data);
				console.log(
					'User data set with point value:',
					data.point,
					'and credits:',
					data.credits
				);
			} catch (error) {
				const axiosError = error as AxiosError;
				console.log('Error response status:', axiosError.response?.status);
				console.log('Full error:', axiosError);

				if (axiosError.response?.status === 404) {
					console.log('User not found, attempting to create new user');
					// If user doesn't exist, create new user
					try {
						const newUser = await createUser(wallet);
						console.log('New user created with data:', newUser);

						// Validate the new user data
						if (
							typeof newUser.point !== 'number' ||
							typeof newUser.credits !== 'number'
						) {
							console.error('Invalid data format in new user:', newUser);
							setError('Invalid data format for new user');
							return;
						}

						setUserData(newUser);
						console.log(
							'New user data set with point value:',
							newUser.point,
							'and credits:',
							newUser.credits
						);
					} catch (createError) {
						console.error('Failed to create user:', createError);
						setError('Failed to create user');
					}
				} else {
					console.error('Failed to fetch user data:', axiosError);
					setError('Failed to fetch user data');
				}
			} finally {
				setLoading(false);
			}
		};

		fetchUserData();
	}, [wallet]);

	return { userData, loading, error };
};
