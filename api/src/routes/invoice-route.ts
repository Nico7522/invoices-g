import { Router } from "express";
import {
  convertToPdf,
  getInvoiceDetails,
  getInvoices,
} from "../controllers/invoice-controller";
import { authenticateUser } from "../middlewares/auth";

const invoiceRouter = Router();

invoiceRouter.get("/", authenticateUser, getInvoices);
invoiceRouter.get("/:id", authenticateUser, getInvoiceDetails);
invoiceRouter.post("/pdf", authenticateUser, convertToPdf);
export default invoiceRouter;
