import { useState, useEffect } from 'react';

const useResize = (initialLength: number, isWidth = true) => {
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
			setLength(newLength);
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
	}, [isResizing, isWidth]);

	return {
		length,
		handleMouseDown,
		setLength,
	};
};

export default useResize;
