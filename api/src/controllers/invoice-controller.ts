import { Request, Response } from "express";
import {
  convertToPdfService,
  createInvoiceService,
  deleteInvoiceService,
  getInvoiceDetailsService,
  getInvoicesService,
  updateInvoiceService,
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
  return res.status(200).json({
    message: "Invoice details fetched successfully",
    data: invoiceDetails,
  });
};

export const convertToPdf = async (req: Request, res: Response) => {
  const { content, invoiceId } = req.body;

  if (!content) {
    return res.status(400).json({ error: "Content is required" });
  }

  const pdfBuffer = await convertToPdfService(content, req.supabase);

  // Generate filename with invoice ID if provided, otherwise use timestamp
  const filename = invoiceId
    ? `facture_${invoiceId}_${new Date().toISOString().split("T")[0]}.pdf`
    : `facture_${new Date().getTime()}.pdf`;

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
  res.setHeader("Content-Length", pdfBuffer.length.toString());

  return res.status(200).send(pdfBuffer);
};

export const createInvoice = async (req: Request, res: Response) => {
  const invoice = req.body.invoice;
  if (!invoice) {
    return res.status(400).json({ error: "Invoice data is required" });
  }

  const id = await createInvoiceService(invoice, req.supabase);
  return res
    .status(201)
    .json({ message: "Invoice created successfully", data: id });
};

export const updateInvoice = async (req: Request, res: Response) => {
  const { id } = req.params;
  const invoice = req.body.invoice;
  if (!invoice || !id) {
    return res.status(400).json({ error: "Invoice data is required" });
  }

  await updateInvoiceService(id, invoice, req.supabase);
  return res.status(200).json({ message: "Invoice updated successfully" });
};

export const deleteInvoice = async (req: Request, res: Response) => {
  const { id } = req.params;
  console.log(id);

  if (!id) {
    return res.status(400).json({ error: "Invoice ID is required" });
  }
  await deleteInvoiceService(id, req.supabase);
  return res.status(200).json({ message: "Invoice deleted successfully" });
};
