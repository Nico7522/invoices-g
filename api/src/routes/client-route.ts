import { Router } from "express";
import {
  createClient,
  getClientById,
  getClients,
} from "../controllers/client-controller";
import { authenticateUser } from "../middlewares/auth";

const ClientRouter = Router();

ClientRouter.get("/", authenticateUser, getClients);
ClientRouter.get("/:id", authenticateUser, getClientById);
ClientRouter.post("/", authenticateUser, createClient);

export default ClientRouter;
