import express from "express";
import clientRoutes from "./routes/client-route";
import authRoutes from "./routes/auth.route";

const app = express();

app.use(express.json());
app.use("/api/clients", clientRoutes);
app.use("/api/auth", authRoutes);

export default app;
