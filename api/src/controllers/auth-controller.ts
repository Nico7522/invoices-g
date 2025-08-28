import { Request, Response } from "express";
import {
  getUserService,
  loginService,
  logoutService,
} from "../services/auth-service";

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }
    const session = await loginService(email, password);
    if (!session) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    res.cookie("sb-access-token", session.token.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 1000 * 60 * 60, // 1 heure
    });

    res.cookie("sb-refresh-token", session.token.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 1000 * 60 * 60 * 24 * 7, // 1 semaine
    });
    res.status(200).json({ user: session.user });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    await logoutService(req.supabase);
    res.clearCookie("sb-access-token");
    res.clearCookie("sb-refresh-token");
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const getUser = async (req: Request, res: Response) => {
  try {
    if (!req.cookies["sb-access-token"]) {
      return res.status(200).json({ user: null });
    }

    const { id, email } = await getUserService(req.cookies["sb-access-token"]);
    return res.status(200).json({ user: { id, email } });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};
