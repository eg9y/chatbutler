import { useState, useEffect } from 'react';

const useResize = (initialLength: number, isWidth = true, minLength: number | null = null) => {
	const [isResizing, setIsResizing] = useState(false);
	const [length, setLength] = useState(initialLength);

	const handleMouseDown = (e: any) => {
		e.preventDefault();
		setIsResizing(true);
	};

	const handleMouseUp = () => {
		setIsResizing(false);
	};

	useEffect(() => {
		const handleMouseMove = (e: any) => {
			if (!isResizing) return;
			const newLength = isWidth ? e.clientX : window.innerHeight - e.clientY;

			if (minLength === null || newLength > minLength) {
				setLength(newLength);
			} else {
				setLength(minLength);
			}
		};

		if (isResizing) {
			window.addEventListener('mousemove', handleMouseMove);
			window.addEventListener('mouseup', handleMouseUp);
		} else {
			window.removeEventListener('mousemove', handleMouseMove);
			window.removeEventListener('mouseup', handleMouseUp);
		}

		return () => {
			window.removeEventListener('mousemove', handleMouseMove);
			window.removeEventListener('mouseup', handleMouseUp);
		};
	}, [isResizing, isWidth, minLength]);

	return {
		length,
		handleMouseDown,
		setLength,
	};
};

export default useResize;
