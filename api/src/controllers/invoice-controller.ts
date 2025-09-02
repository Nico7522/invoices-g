import { Request, Response } from "express";
import {
  getInvoiceDetailsService,
  getInvoicesService,
} from "../services/invoice-service";

export const getInvoices = async (req: Request, res: Response) => {
  const invoices = await getInvoicesService(req.supabase);
  return res
    .status(200)
    .json({ message: "Invoices fetched successfully", data: invoices });
};

export const getInvoiceDetails = async (req: Request, res: Response) => {
  const { id } = req.params;
  const invoiceDetails = await getInvoiceDetailsService(id, req.supabase);
  return res
    .status(200)
    .json({
      message: "Invoice details fetched successfully",
      data: invoiceDetails,
    });
};
