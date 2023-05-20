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
			<div className="w-full rounded-md border bg-white px-1 shadow-sm">
				<input
					type="text"
					name={propertyName}
					value={inputValue}
					onChange={(e) => setInputValue(e.target.value)}
					onKeyDown={handleKeyDown}
					className="form-input h-1/2 w-full border-0 px-0 outline-none focus:outline-none focus:ring-0 focus:ring-offset-0"
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
		<span className="inline-flex items-center rounded-full bg-blue-200 px-3 py-1 text-xs text-blue-800">
			<button className="" onClick={() => removeStopword(stopword)}>
				{stopword}
			</button>
		</span>
	);
};

export default ChipsInput;
