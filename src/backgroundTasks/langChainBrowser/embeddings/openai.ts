import { Configuration, OpenAIApi, CreateEmbeddingRequest, ConfigurationParameters } from 'openai';

import { Embeddings, EmbeddingsParams } from './base.js';
import { chunkArray } from '../util/index.js';

interface ModelParams {
	modelName: string;
}

// Configure retry options
const retryOptions = {
	retries: 5, // Maximum number of retries
	factor: 2, // Exponential factor
	minTimeout: 1000, // Minimum time between retries in milliseconds
	maxTimeout: 60000, // Maximum time between retries in milliseconds
};

function sleep(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

export class OpenAIEmbeddings extends Embeddings implements ModelParams {
	modelName = 'text-embedding-ada-002';

	/**
	 * The maximum number of documents to embed in a single request. This is
	 * limited by the OpenAI API to a maximum of 2048.
	 */
	batchSize = 512;

	/**
	 * Whether to strip new lines from the input text. This is recommended by
	 * OpenAI, but may not be suitable for all use cases.
	 */
	stripNewLines = true;

	private client!: OpenAIApi;

	private clientConfig: ConfigurationParameters;

	constructor(
		fields?: Partial<ModelParams> &
			EmbeddingsParams & {
				verbose?: boolean;
				batchSize?: number;
				openAIApiKey?: string;
				stripNewLines?: boolean;
			},
		configuration?: ConfigurationParameters,
	) {
		super(fields ?? {});

		const apiKey = fields?.openAIApiKey ?? process.env.OPENAI_API_KEY;
		if (!apiKey) {
			throw new Error('OpenAI API key not found');
		}

		this.modelName = fields?.modelName ?? this.modelName;
		this.batchSize = fields?.batchSize ?? this.batchSize;
		this.stripNewLines = fields?.stripNewLines ?? this.stripNewLines;

		this.clientConfig = {
			apiKey,
			...configuration,
		};
	}

	async embedDocuments(texts: string[]): Promise<number[][]> {
		const subPrompts = chunkArray(
			this.stripNewLines ? texts.map((t) => t.replaceAll('\n', ' ')) : texts,
			this.batchSize,
		);

		const embeddings: number[][] = [];

		for (let i = 0; i < subPrompts.length; i += 1) {
			const input = subPrompts[i];
			const response = await this.embeddingWithRetry({
				model: this.modelName,
				input,
			});
			if (!response) {
				throw new Error('No data returned from API');
			}
			for (let j = 0; j < input.length; j += 1) {
				embeddings.push(response.data.data[j].embedding);
			}
		}

		return embeddings;
	}

	async embedQuery(text: string): Promise<number[]> {
		const response = await this.embeddingWithRetry({
			model: this.modelName,
			input: this.stripNewLines ? text.replaceAll('\n', ' ') : text,
		});
		if (!response) {
			throw new Error('No data returned from API');
		}
		return response.data.data[0].embedding;
	}

	private async embeddingWithRetry(request: CreateEmbeddingRequest) {
		if (!this.client) {
			const clientConfig = new Configuration({
				...this.clientConfig,
				baseOptions: {
					...this.clientConfig.baseOptions,
				},
			});
			this.client = new OpenAIApi(clientConfig);
		}

		let currentAttempt = 0;

		while (currentAttempt <= retryOptions.retries) {
			try {
				return this.caller.call(this.client.createEmbedding.bind(this.client), request);
			} catch (error: any) {
				console.error('Error during API call:', error);
				// If the error is not related to rate limits or server errors, don't retry.
				if (![429, 500, 502, 503, 504].includes(error.status)) {
					throw error;
				}

				currentAttempt++;
				if (currentAttempt <= retryOptions.retries) {
					const timeout = Math.min(
						retryOptions.minTimeout * retryOptions.factor ** (currentAttempt - 1),
						retryOptions.maxTimeout,
					);
					await sleep(timeout);
				} else {
					throw new Error('Max retries reached');
				}
			}
		}
		return null;
	}
}
