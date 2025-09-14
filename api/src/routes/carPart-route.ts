import { Router } from "express";
import { authenticateUser } from "../middlewares/auth";
import { GetCarParts } from "../controllers/carPart-controller";

// Car part routes
const carPartRoute = Router();

// Get all car parts
carPartRoute.get("/", authenticateUser, GetCarParts);

export default carPartRoute;
