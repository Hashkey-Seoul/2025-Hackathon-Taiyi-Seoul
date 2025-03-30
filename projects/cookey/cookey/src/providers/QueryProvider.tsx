import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';

interface QueryProviderProps {
	children: ReactNode;
}

// Create a client
const queryClient = new QueryClient();

export function QueryProvider({ children }: QueryProviderProps) {
	return (
		<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
	);
}
