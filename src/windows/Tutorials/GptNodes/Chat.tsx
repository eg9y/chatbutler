const Chat = () => {
	return (
		<div className="divide-y divide-gray-200 overflow-hidden rounded-lg bg-white w-full">
			<div className="px-4 py-5 sm:p-6">
				<div>
					<h2 className="font-bold text-2xl">Introduction:</h2>
					<p>
						The Chat Node allows you to build conversations with the OpenAI Chat API.
						This node expects a chain of connected Chat Message nodes and aggregates
						their contents to form a conversation sequence. Users can also customize the
						request settings for the API call.
					</p>
				</div>
				<div className="pt-4">
					<h2 className="font-bold text-2xl">Usage:</h2>
					<ul className="list-inside list-decimal flex flex-col gap-2">
						<li>Drag and drop the Chat Node onto the canvas.</li>
						<li>
							Create a chain of Chat Message nodes by connecting them sequentially.
							Make sure the last Chat Message node in the sequence connects to the
							Chat Node.
						</li>
						<li>
							Configure the content and role (user, assistant, or system) of each Chat
							Message node in the chain.
						</li>
						<li>
							In the Chat Node settings panel, adjust the API request settings as
							needed, such as temperature, model, and stop sequence.
						</li>
						<li>
							When the workflow is executed, the Chat Node will collect all the
							messages in the sequence and send them to the OpenAI Chat API. The API
							will then generate a response based on the conversation history and the
							configured settings.
						</li>
					</ul>
				</div>
			</div>
		</div>
	);
};

export default Chat;
