import customError from "./custom-error";

class BadRequestError extends customError<ErrorCode> {}
export default BadRequestError;
