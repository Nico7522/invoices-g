import { Request, Response, NextFunction } from "express";
import { getAnonClient, getAuthClient } from "../config/supabase";

// Extends Express Request to include supabase client
declare global {
  namespace Express {
    interface Request {
      supabase: ReturnType<typeof getAuthClient>;
      user?: any;
    }
  }
}

/**
 * Middleware to authenticate user using Supabase
 * It checks for access and refresh tokens in cookies,
 * @param req Request
 * @param res Response
 * @param next NextFunction

 */
export const authenticateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Récupérer le token depuis les cookies

    const accessToken = req.cookies["sb-access-token"];
    const refreshToken = req.cookies["sb-refresh-token"];

    if (!accessToken) {
      return res.status(401).json({
        error: {
          type: "about:blank",
          title: "Unauthorized",
          detail: "No access token provided",
          instance: "/",
          status: 401,
        },
      });
    }

    // Créer un client avec le token de l'utilisateur
    const supabase = getAuthClient(accessToken);

    // Vérifier la session et rafraîchir si nécessaire
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(accessToken);

    if (error || !user) {
      // Tenter de rafraîchir avec le refresh token
      if (refreshToken) {
        const anonClient = getAnonClient();
        const { data: refreshData, error: refreshError } =
          await anonClient.auth.refreshSession({ refresh_token: refreshToken });

        if (!refreshError && refreshData.session) {
          // Mettre à jour les cookies avec les nouveaux tokens
          res.cookie("sb-access-token", refreshData.session.access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
            maxAge: 1000 * 60 * 60, // 1 heure
          });

          res.cookie("sb-refresh-token", refreshData.session.refresh_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
            maxAge: 1000 * 60 * 60 * 24 * 7, // 1 semaine
          });

          // Créer un nouveau client avec le token rafraîchi
          req.supabase = getAuthClient(refreshData.session.access_token);
          req.user = refreshData.user;
          return next();
        }
      }

      return res.status(401).json({
        error: {
          type: "about:blank",
          title: "Unauthorized",
          detail: "Invalid or expired token",
          instance: "/",
          status: 401,
        },
      });
    }

    // Attacher le client et l'utilisateur à la requête
    req.supabase = supabase;
    req.user = user;

    next();
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(500).json({
      error: {
        type: "about:blank",
        title: "Server Error",
        detail: "Internal server error",
        instance: "/",
        status: 500,
      },
    });
  }
};
