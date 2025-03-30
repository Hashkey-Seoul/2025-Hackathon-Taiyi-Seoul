import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vite.dev/config/
// vite.config.js
export default defineConfig({
	plugins: [react()],
	server: {
		host: true, // Listen on all network interfaces
		proxy: {
			'/api': {
				target:
					'http://ec2-52-79-127-229.ap-northeast-2.compute.amazonaws.com:3001',
				changeOrigin: true,
				secure: false,
				rewrite: (path) => path.replace(/^\/api/, ''),
			},
		},
	},
});
