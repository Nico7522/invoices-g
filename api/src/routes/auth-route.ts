import { Router } from "express";
import { getUser, login, logout } from "../controllers/auth-controller";
import { authenticateUser } from "../middlewares/auth";

const AuthRouter = Router();

AuthRouter.post("/login", login);
AuthRouter.post("/logout", authenticateUser, logout);

AuthRouter.get("/user", getUser);

export default AuthRouter;
