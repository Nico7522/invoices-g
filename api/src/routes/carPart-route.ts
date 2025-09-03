import { Router } from "express";
import { authenticateUser } from "../middlewares/auth";
import { GetCarParts } from "../controllers/carPart-controller";

const carPartRoute = Router();

carPartRoute.get("/", authenticateUser, GetCarParts);

export default carPartRoute;
