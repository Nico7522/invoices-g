import CustomError from "./custom-error";

class UnauthorizedError extends CustomError<ErrorCode> {}
export default UnauthorizedError;
