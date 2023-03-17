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
}
