import { Router } from "express";
import {
  createClient,
  getClientById,
  getClients,
} from "../controllers/client-controller";

const ClientRouter = Router();

ClientRouter.get("/", getClients);
ClientRouter.get("/:id", getClientById);
ClientRouter.post("/", createClient);

export default ClientRouter;
