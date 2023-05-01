import { WorkflowDbSchema } from '../../db/dbTypes';
import { conditionalClassNames } from '../../utils/classNames';

export default function ChatBotList({
	chatbots,
	onClick,
}: {
	chatbots: (WorkflowDbSchema & {
		profiles:
			| {
					first_name: string | null;
			  }
			| {
					first_name: string | null;
			  }[]
			| null;
	})[];
	onClick: (
		chatbot: WorkflowDbSchema & {
			profiles:
				| {
						first_name: string | null;
				  }
				| {
						first_name: string | null;
				  }[]
				| null;
		},
	) => void;
}) {
	return (
		<div>
			<h2 className="text-lg font-semibold text-slate-800 pt-4">Choose your chatbot</h2>
			<ul
				role="list"
				className="mt-3 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4"
			>
				{chatbots.map((chatbot) => (
					<li
						key={chatbot.id}
						onClick={() => {
							onClick(chatbot);
						}}
						className="cursor-pointer col-span-1 flex rounded-md shadow-sm"
					>
						<div
							className={conditionalClassNames(
								'bg-slate-500',
								'flex w-16 flex-shrink-0 items-center justify-center rounded-l-md text-sm font-medium text-white',
							)}
						>
							{chatbot.name[0]}
						</div>
						<div className="hover:bg-slate-100 flex flex-1 items-center justify-between truncate rounded-r-md border-b border-r border-t border-slate-200 bg-white">
							<div className="flex-1 truncate px-4 py-2 text-sm">
								<a className="font-medium text-slate-900 hover:text-slate-600">
									{chatbot.name}
								</a>
								<p className="text-slate-500">{chatbot.description}</p>
							</div>
						</div>
					</li>
				))}
			</ul>
		</div>
	);
}
