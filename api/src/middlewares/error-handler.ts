import { NextFunction, Request, Response } from "express";
import CustomError from "../errors/custom-error";

export default function errorHandler(
  error: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (error instanceof CustomError) {
    res.status(error.status).json({
      error: {
        type: error.type,
        title: error.title,
        detail: error.detail,
        instance: error.instance,
        status: error.status,
      },
    });
    return;
  }

  res.status(500).json({
    error: {
      type: "about:blank",
      title: "Server Error",
      detail: "An error occurred. Please try again later.",
      instance: req.url,
      status: 500,
    },
  });
  next();
}
