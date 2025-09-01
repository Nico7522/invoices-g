import { Request, Response } from "express";
import { getInvoicesService } from "../services/invoice-service";

export const getInvoices = async (req: Request, res: Response) => {
  const invoices = await getInvoicesService(req.supabase);
  return res
    .status(200)
    .json({ message: "Invoices fetched successfully", data: invoices });
};
