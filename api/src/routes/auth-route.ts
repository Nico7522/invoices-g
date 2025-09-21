import { Router } from "express";
import { getUser, login, logout } from "../controllers/auth-controller";
import { authenticateUser } from "../middlewares/auth";

// Auth routes
const AuthRouter = Router();

// Login
AuthRouter.post("/login", login);

// Logout
AuthRouter.post("/logout", authenticateUser, logout);

// Get the authenticated user
AuthRouter.get("/user", authenticateUser, getUser);

export default AuthRouter;
