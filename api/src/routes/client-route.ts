import { Router } from "express";
import {
  createClient,
  deleteClient,
  getClientById,
  getClients,
  updateClient,
} from "../controllers/client-controller";
import { authenticateUser } from "../middlewares/auth";

const ClientRouter = Router();

ClientRouter.get("/", authenticateUser, getClients);
ClientRouter.get("/:id", authenticateUser, getClientById);
ClientRouter.post("/", authenticateUser, createClient);
ClientRouter.put("/:id", authenticateUser, updateClient);
ClientRouter.delete("/:id", authenticateUser, deleteClient);

export default ClientRouter;
