import errorCodes from '../constant/errorCodes'

export function success(data: any[], message: string | undefined) {
	return {
		...errorCodes.SUCCESS,
		data,
		...(message ? { message } : {}),
	}
}

export function fail(code: number | null, message: string = 'error') {
	return {
		...errorCodes.SUCCESS,
		data: null,
		code,
		message,
	}
}
