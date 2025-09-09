import express from "express";
import cookieParser from "cookie-parser";
import clientRoutes from "./routes/client-route";
import authRoutes from "./routes/auth-route";
import dotenv from "dotenv";
import errorHandler from "./middlewares/error-handler";
import invoiceRouter from "./routes/invoice-route";
import carPartRoute from "./routes/carPart-route";
import cors from "cors";
dotenv.config();

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    origin: [process.env.AUTHORIZED_DOMAIN || "http://localhost:4200"],
    credentials: true,
  })
);
app.use("/api/clients", clientRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/invoices", invoiceRouter);
app.use("/api/car-parts", carPartRoute);
app.use(errorHandler);

export default app;
