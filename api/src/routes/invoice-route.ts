import { Router } from "express";
import {
  convertToPdf,
  createInvoice,
  getInvoiceDetails,
  getInvoices,
  updateInvoice,
} from "../controllers/invoice-controller";
import { authenticateUser } from "../middlewares/auth";

const invoiceRouter = Router();

invoiceRouter.get("/", authenticateUser, getInvoices);
invoiceRouter.get("/:id", authenticateUser, getInvoiceDetails);
invoiceRouter.post("/", authenticateUser, createInvoice);
invoiceRouter.put("/:id", authenticateUser, updateInvoice);
invoiceRouter.post("/pdf", authenticateUser, convertToPdf);
export default invoiceRouter;
