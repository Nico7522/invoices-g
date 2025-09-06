import { NextFunction, Request, Response } from "express";
import CustomError from "../errors/custom-error";

export default function errorHandler(
  error: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (error instanceof CustomError) {
    res.status(error.statusCode).json({
      error: {
        message: error.message,
        code: error.code,
      },
    });
    return;
  }

  res.status(500).json({
    error: {
      message: "An error occurred. Please view logs for more details",
    },
  });
  next();
}
