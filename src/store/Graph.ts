export class Graph {
	adjacencyList = new Map<string, string[]>();

	constructor() {
		this.adjacencyList = new Map();
	}

	addEdge(source: string, target: string) {
		if (!this.adjacencyList.has(source)) {
			this.adjacencyList.set(source, []);
		}

		this.adjacencyList.get(source)?.push(target);
	}

	topologicalSort() {
		const visited = new Set();
		const sorted: string[] = [];

		const visit = (node: string) => {
			if (!visited.has(node)) {
				visited.add(node);
				const neighbors = this.adjacencyList.get(node) || [];
				for (const neighbor of neighbors) {
					visit(neighbor);
				}
				sorted.unshift(node);
			}
		};

		for (const node of this.adjacencyList.keys()) {
			visit(node);
		}

		return sorted;
	}

	getRootNodes(): string[] {
		const childNodeIds = new Set<string>();

		// Add all child node IDs to the set
		for (const [parent, children] of this.adjacencyList) {
			for (const childId of children) {
				// get substring of childId between 0 and guaranteed occurance of '-':
				if (
					childId.substring(0, childId.indexOf('-')) === 'chatMessage' &&
					parent.substring(0, childId.indexOf('-')) !== 'chatMessage'
				) {
					continue;
				}
				childNodeIds.add(childId);
			}
		}

		// Find the root nodes by checking if their IDs are not in the child node IDs set
		const rootNodes = Array.from(this.adjacencyList.keys()).filter(
			(nodeId) => !childNodeIds.has(nodeId),
		);

		return rootNodes;
	}
}
