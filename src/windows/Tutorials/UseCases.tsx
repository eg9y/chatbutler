const UseCases = () => {
	return (
		<div className="divide-y divide-gray-200 overflow-hidden rounded-lg bg-white w-full overflow-y-auto py-4">
			<div className="px-4 py-5 sm:p-6">
				<p>
					<ul className="flex flex-col gap-4 w-2/3">
						<li>
							<p className="font-bold text-2xl">Customer Support</p>
							<p>
								Design a workflow to handle customer inquiries, route messages to
								appropriate departments, and provide automated responses.
							</p>
						</li>
						<li>
							<p className="font-bold text-2xl">Content Generation</p>
							<p>
								Create workflows to generate blog posts, social media content, or
								product descriptions.
							</p>
						</li>
						<li>
							<p className="font-bold text-2xl">Sentiment Analysis</p>
							<p>
								Analyze the sentiment of user-generated content, such as reviews or
								comments, and categorize them accordingly.
							</p>
						</li>
						<li>
							<p className="font-bold text-2xl">Data Extraction</p>
							<p>
								Extract relevant information from large documents using the Search
								API.
							</p>
						</li>
						<li>
							<p className="font-bold text-2xl">Conversational AI</p>
							<p>
								Craft interactive chatbots for websites, apps, or messaging
								platforms using the Chat API.
							</p>
						</li>
						<li>
							<p className="font-bold text-2xl">Decision Trees</p>
							<p>
								Create dynamic decision trees to guide users through multiple-choice
								questions and provide tailored responses based on their input.
							</p>
						</li>
						<li>
							<p className="font-bold text-2xl">Text Summarization</p>
							<p>Summarize long documents into concise summaries.</p>
						</li>
						<li>
							<p className="font-bold text-2xl">Text Classification</p>
							<p>
								Categorize text into predefined classes or labels based on the
								content.
							</p>
						</li>
					</ul>
				</p>
			</div>
		</div>
	);
};

export default UseCases;
