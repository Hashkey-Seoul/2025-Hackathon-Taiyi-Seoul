import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
	const { pathname } = useLocation();

	useEffect(() => {
		// Scroll both window and document body to handle different mobile browsers
		window.scrollTo(0, 0);
		document.body.scrollTop = 0; // For Safari
		document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
	}, [pathname]);

	return null;
}
