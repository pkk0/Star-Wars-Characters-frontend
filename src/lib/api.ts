import type { HttpMethod } from '@sveltejs/kit/types/internal';

const API_ENDPOINT_URL = 'https://swapi.dev/api/';

const supervisedFetch = async (
	input: RequestInfo,
	options: RequestInit & { attemptTimeout: number; maxAttempts: number }
): Promise<{
	error: boolean;
	response?: Response;
}> => {
	let attemptsCounter = 0;
	let error = false;
	let response: Response | undefined;

	do {
		attemptsCounter++;

		const controller = new AbortController();
		const timeout = setTimeout(() => controller.abort(), options.attemptTimeout);

		try {
			response = await fetch(input, {
				...options,
				signal: controller.signal
			});
			error = false;
		} catch {
			error = true;
			response = undefined;
			continue;
		} finally {
			clearTimeout(timeout);
		}

		if (!response || !response.ok) {
			error = true;
			response = undefined;
			continue;
		}

		break;
	} while (attemptsCounter <= options.maxAttempts - 1);

	return {
		error,
		response
	};
};

const callAPI = async <Type>(
	method: HttpMethod,
	resource: string
): Promise<{
	error: boolean;
	responseJSON?: Type;
}> => {
	const { error, response } = await supervisedFetch(API_ENDPOINT_URL+resource, {
		method,
		headers: {
			'Content-Type': 'application/json',
			Accept: 'application/json'
		},
		attemptTimeout: 30000,
		maxAttempts: 3
	});

	if (error || !response) {
		return { error };
	}

	return {
		error,
		responseJSON: await response.json()
	};
};

export const callPaginatedAPI = async <Type>(
	method: HttpMethod,
	resource: string
): Promise<{
	error: boolean;
	cumulatedResponseJSON?: Array<Type>;
}> => {
	const cumulatedResponseJSON: Array<Type> = [];
	let allLoaded = false;
	let page = 1;

	do {
		const { error, responseJSON } = await callAPI<{
			next: string;
			results: Array<Type>;
		}>(method, `${resource}/?page=${page}`);

		if (error || !responseJSON || !responseJSON['results']) {
			return { cumulatedResponseJSON, error: true };
		}

		if (!responseJSON['next']) 
			allLoaded = true;

		cumulatedResponseJSON.push(...responseJSON['results']);

		page++;
	} while (!allLoaded);

	return {
		error: false,
		cumulatedResponseJSON
	};
};