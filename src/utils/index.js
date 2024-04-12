export class ExpressError extends Error {
	constructor(message, statusCode) {
		super();
		this.message = message;
		this.statusCode = statusCode;
	}
}

export const wrapAsync = (f) => {
	return (req, res, next) => {
		f(req, res, next).catch(next);
	};
};
