const Overview = () => {
	return (
		<div className="divide-y divide-gray-200 overflow-hidden rounded-lg bg-white w-full">
			<div className="px-4 py-5 sm:p-6">
				<p>
					Welcome to PromptSandbox.io, an intuitive a visual programming interface
					designed to help you create powerful workflows using OpenAI APIs. This platform
					enables you to easily interact with various OpenAI services, such as Chat,
					Completion, and Embeddings APIs, by using a collection of nodes and connections.
				</p>
				<br />
				<p>
					In this tutorial, you&apos;ll learn how to use the key features of
					PromptSandbox.io to build custom workflows that harness the power of OpenAI in a
					user-friendly way. Here&apos;s an overview of the general workflow:
				</p>
				<div className="py-4">
					<h2 className="font-bold text-2xl">General Workflow</h2>
					<ul className="flex flex-col gap-4 list-decimal list-inside pt-2">
						<li>
							Start by selecting the appropriate nodes for your use case from the
							provided list:
							<ul className="pl-4 list-inside list-disc">
								<li>Chat Node</li>
								<li>Chat Message Node</li>
								<li>Completion Node</li>
								<li>Text Node</li>
								<li>Classify Node</li>
								<li>File Text Node</li>
								<li>Search Node</li>
								<li>Combine Node</li>
							</ul>
						</li>
						<li>
							Drag and drop these nodes onto the canvas and configure their settings
							to suit your requirements.
						</li>
						<li>
							Connect the nodes by drawing edges between them, representing the flow
							of data from the source node to target nodes.
						</li>
						<li>
							Create a sequence or structure with these connected nodes to achieve
							your desired functionality or goal.
						</li>
						<li>
							Execute the workflow to see the results, and make any necessary
							adjustments to refine the output.
						</li>
					</ul>
				</div>
			</div>
		</div>
	);
};

export default Overview;
