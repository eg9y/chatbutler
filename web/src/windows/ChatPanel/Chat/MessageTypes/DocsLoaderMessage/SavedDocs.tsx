import { ChevronRightIcon } from '@heroicons/react/20/solid';
import { useState } from 'react';

import { conditionalClassNames } from '../../../../../utils/classNames';

export default function SavedDocs({
	userDocuments,
	pauseResolver,
	setIsLoading,
	setIsDone,
}: {
	userDocuments:
		| {
				[x: string]: any;
		  }[]
		| null;
	pauseResolver: (value: string) => void;
	setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
	setIsDone: React.Dispatch<React.SetStateAction<boolean>>;
}) {
	const [selectedFile, setSelectedFile] = useState<string | null>(null);
	return (
		<ul role="list" className="divide-y divide-white/5">
			{userDocuments?.map((userDocument) => (
				<li
					key={userDocument.name}
					onClick={() => {
						pauseResolver(userDocument.name);
						setIsLoading(false);
						setIsDone(true);
						setSelectedFile(userDocument.name);
					}}
					className={conditionalClassNames(
						selectedFile === userDocument.name && 'underline',
						'relative flex cursor-pointer items-center space-x-4 py-4 hover:bg-neutral-300',
					)}
				>
					<div className="min-w-0 flex-auto">
						<div className="flex items-center gap-x-3">
							<div
								className={conditionalClassNames(
									// statuses[deployment.status],
									'flex-none rounded-full p-1',
								)}
							>
								<div className="h-2 w-2 rounded-full bg-current" />
							</div>
							<h2 className="min-w-0 text-sm font-semibold leading-6 text-neutral-700">
								<a className="flex gap-x-2">
									<span className="truncate">{userDocument.name}</span>
								</a>
							</h2>
						</div>
					</div>
					<ChevronRightIcon
						className="h-5 w-5 flex-none text-gray-400"
						aria-hidden="true"
					/>
				</li>
			))}
		</ul>
	);
}
