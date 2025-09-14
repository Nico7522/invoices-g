import { Router } from "express";
import {
  convertToPdf,
  createInvoice,
  deleteInvoice,
  getInvoiceDetails,
  getInvoices,
  updateInvoice,
} from "../controllers/invoice-controller";
import { authenticateUser } from "../middlewares/auth";

// Invoice routes
const invoiceRouter = Router();

// Get all invoices
invoiceRouter.get("/", authenticateUser, getInvoices);

// Get an invoice by id
invoiceRouter.get("/:id", authenticateUser, getInvoiceDetails);

// Create an invoice
invoiceRouter.post("/", authenticateUser, createInvoice);

// Update an invoice
invoiceRouter.put("/:id", authenticateUser, updateInvoice);

// Delete an invoice
invoiceRouter.delete("/:id", authenticateUser, deleteInvoice);

// Convert an invoice to pdf
invoiceRouter.post("/pdf", authenticateUser, convertToPdf);
export default invoiceRouter;
