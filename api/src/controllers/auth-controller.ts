import { Request, Response } from "express";
import { loginService } from "../services/auth-service";

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const session = await loginService(email, password);
  return res.status(200).json({ session: session.token, user: session.user });
};
