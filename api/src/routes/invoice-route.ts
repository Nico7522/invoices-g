import { Router } from "express";
import { getInvoices } from "../controllers/invoice-controller";
import { authenticateUser } from "../middlewares/auth";

const invoiceRouter = Router();

invoiceRouter.get("/", authenticateUser, getInvoices);

export default invoiceRouter;
