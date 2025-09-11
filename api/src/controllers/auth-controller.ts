import { Request, Response } from "express";
import {
  getUserService,
  loginService,
  logoutService,
} from "../services/auth-service";

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password required" });
  }
  const session = await loginService(email, password);

  res.cookie("sb-access-token", session.token.accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    maxAge: 1000 * 60 * 60,
  });

  res.cookie("sb-refresh-token", session.token.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    maxAge: 1000 * 60 * 60 * 24 * 7,
  });

  res.status(200).json({ user: session.user });
};
export const logout = async (req: Request, res: Response) => {
  await logoutService(req.supabase);
  res.clearCookie("sb-access-token");
  res.clearCookie("sb-refresh-token");
  return res.status(200).json({ message: "Logged out successfully" });
};

export const getUser = async (req: Request, res: Response) => {
  const accessToken = req.cookies["sb-access-token"];
  const { id, email } = await getUserService(accessToken);
  return res.status(200).json({ user: { id, email } });
};
