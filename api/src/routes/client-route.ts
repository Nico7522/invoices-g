import { Router } from "express";
import {
  createClient,
  deleteClient,
  getClientById,
  getClientInvoices,
  getClients,
  updateClient,
} from "../controllers/client-controller";
import { authenticateUser } from "../middlewares/auth";

// Client routes

const ClientRouter = Router();

// Get all clients
ClientRouter.get("/", authenticateUser, getClients);

// Get a client by id
ClientRouter.get("/:id", authenticateUser, getClientById);

// Create a client
ClientRouter.post("/", authenticateUser, createClient);

// Update a client
ClientRouter.put("/:id", authenticateUser, updateClient);

// Delete a client
ClientRouter.delete("/:id", authenticateUser, deleteClient);

// Get invoices of a client
ClientRouter.get("/:id/invoices", authenticateUser, getClientInvoices);

export default ClientRouter;
