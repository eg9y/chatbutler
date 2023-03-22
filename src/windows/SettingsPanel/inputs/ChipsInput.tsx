import React, { useState } from 'react';

const ChipsInput = ({
	handleChange,
	stringArrayValue,
	propertyName,
}: {
	stringArrayValue: string[];
	propertyName: string;
	handleChange: (
		e:
			| React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
			| {
					target: {
						name: string;
						value: string[];
						type: null;
					};
			  },
	) => void;
}) => {
	const [stopwords, setStopwords] = useState<string[]>(stringArrayValue);
	const [inputValue, setInputValue] = useState('');

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter' && inputValue.trim()) {
			e.preventDefault();
			if (stopwords.length >= 4) {
				return alert('You can only have 4 stop words');
			}
			const stopWords = [...stopwords, inputValue.trim()];
			setStopwords(stopWords);
			// get range value
			handleChange({
				target: {
					name: propertyName,
					value: stopWords,
					type: null,
				},
			});

			setInputValue('');
		} else if (e.key === 'Backspace' && !stringArrayValue) {
			setStopwords(stopwords.slice(0, -1));
		}
	};

	const removeStopword = (stopword: string) => {
		setStopwords(stopwords.filter((sw) => sw !== stopword));
	};

	return (
		<div className="my-4 flex flex-col">
			<label htmlFor={propertyName} className="block text-sm font-medium text-slate-900">
				{propertyName}
			</label>
			<div className="bg-white rounded-md shadow-sm border px-1 w-full">
				<input
					type="text"
					name={propertyName}
					value={inputValue}
					onChange={(e) => setInputValue(e.target.value)}
					onKeyDown={handleKeyDown}
					className="h-1/2 w-full outline-none focus:outline-none form-input focus:ring-0 focus:ring-offset-0 border-0 px-0"
				/>
			</div>
			<div className="flex flex-wrap gap-1 pt-2">
				{stopwords.map((stopword, index) => (
					<Chip key={index} stopword={stopword} removeStopword={removeStopword} />
				))}
			</div>
		</div>
	);
};

const Chip = ({
	stopword,
	removeStopword,
}: {
	stopword: string;
	removeStopword: (stopword: string) => void;
}) => {
	return (
		<span className="inline-flex items-center bg-blue-200 text-blue-800 text-xs rounded-full px-3 py-1">
			<button className="" onClick={() => removeStopword(stopword)}>
				{stopword}
			</button>
		</span>
	);
};

export default ChipsInput;
