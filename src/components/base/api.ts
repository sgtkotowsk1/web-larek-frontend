export type ApiListResponse<Type> = {
	total: number;
	items: Type[];
};

export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export default class Api {
	readonly baseUrl: string;
	protected options: RequestInit;

	constructor(baseUrl: string, options: RequestInit = {}) {
		this.baseUrl = baseUrl;
		this.options = {
			headers: {
				'Content-Type': 'application/json',
				...((options.headers as object) ?? {}),
			},
		};
	}

	protected async handleResponse(response: Response): Promise<object> {
		if (response.ok) {
			return response.json();
		} else {
			const data = await response.json();
			throw new Error(data.error ?? response.statusText);
		}
	}

	async get(uri: string): Promise<object> {
		const response = await fetch(this.baseUrl + uri, {
			...this.options,
			method: 'GET',
		});
		return this.handleResponse(response);
	}

	async post(
		uri: string,
		data: object,
		method: ApiPostMethods = 'POST'
	): Promise<object> {
		const response = await fetch(this.baseUrl + uri, {
			...this.options,
			method,
			body: JSON.stringify(data),
		});
		return this.handleResponse(response);
	}
}
