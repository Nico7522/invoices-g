import { Router } from "express";
import {
  getInvoiceDetails,
  getInvoices,
} from "../controllers/invoice-controller";
import { authenticateUser } from "../middlewares/auth";

const invoiceRouter = Router();

invoiceRouter.get("/", authenticateUser, getInvoices);
invoiceRouter.get("/:id", authenticateUser, getInvoiceDetails);
export default invoiceRouter;
