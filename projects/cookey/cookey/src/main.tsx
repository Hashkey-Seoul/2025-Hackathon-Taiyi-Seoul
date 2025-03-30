import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { http } from 'viem';
import { createConfig, WagmiConfig } from 'wagmi';
import { injected, walletConnect } from 'wagmi/connectors';
import App from './App.tsx';
import './index.css';
import { activeChain } from './utils/blockchain';

const queryClient = new QueryClient();
const config = createConfig({
	chains: [activeChain],
	connectors: [
		injected(),
		walletConnect({
			projectId: '9a225b6bfcedbe8a131abc712204f6b4',
		}),
	],
	transports: {
		[activeChain.id]: http(),
	},
});

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<QueryClientProvider client={queryClient}>
			<WagmiConfig config={config}>
				<App />
			</WagmiConfig>
		</QueryClientProvider>
	</StrictMode>
);
