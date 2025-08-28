import express from "express";
import cookieParser from "cookie-parser";
import clientRoutes from "./routes/client-route";
import authRoutes from "./routes/auth.route";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cookieParser());
app.use(express.json());

app.use("/api/clients", clientRoutes);
app.use("/api/auth", authRoutes);

export default app;
