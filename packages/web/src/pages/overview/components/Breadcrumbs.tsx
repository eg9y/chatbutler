import { SimpleWorkflow } from '@chatbutler/shared';

export default function Breadcrumbs({
	chatbot,
	setChatbot,
	setCurrentPage,
	currentPage = '',
}: {
	chatbot?: SimpleWorkflow;
	setChatbot: (chatbot: SimpleWorkflow | undefined) => void;
	setCurrentPage: (page: string) => void;
	currentPage?: string;
}) {
	return (
		<nav className="flex" aria-label="Breadcrumb">
			<ol role="list" className="flex items-center space-x-4">
				<li>
					<div
						onClick={() => {
							setChatbot(undefined);
							setCurrentPage('home');
						}}
						className="cursor-pointer"
					>
						<h1 className="text-base font-semibold leading-7 text-slate-600">
							Your Chatbots
						</h1>
					</div>
				</li>
				{chatbot && (
					<li>
						<div className="flex items-center">
							<svg
								className="h-5 w-5 flex-shrink-0 text-gray-300"
								fill="currentColor"
								viewBox="0 0 20 20"
								aria-hidden="true"
							>
								<path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
							</svg>
							<a
								className="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700"
								aria-current={'page'}
							>
								{chatbot.name}
							</a>
						</div>
					</li>
				)}
				{currentPage && (
					<li>
						<div className="flex items-center">
							<svg
								className="h-5 w-5 flex-shrink-0 text-gray-300"
								fill="currentColor"
								viewBox="0 0 20 20"
								aria-hidden="true"
							>
								<path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
							</svg>
							<a
								className="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700"
								aria-current={'page'}
							>
								{currentPage}
							</a>
						</div>
					</li>
				)}
			</ol>
		</nav>
	);
}
