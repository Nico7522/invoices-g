import { getAuthClient } from "../config/supabase";
import CustomError from "../errors/custom-error";
import { invoiceToInvoiceDto } from "../mappers/invoice-mapper";
import { InvoiceDetails, InvoiceModel } from "../models/invoice";
import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();
export const getInvoicesService = async (
  supabase: ReturnType<typeof getAuthClient>
) => {
  const { data, error } = await supabase.from("invoices").select(`*`);

  if (error)
    throw new CustomError({
      message: "Error fetching invoices",
      code: "BAD_REQUEST",
      statusCode: 400,
    });

  return data.map(invoiceToInvoiceDto);
};

export const getInvoiceDetailsService = async (
  id: string,
  supabase: ReturnType<typeof getAuthClient>
) => {
  const { data, error } = await supabase
    .from("invoices")
    .select(
      `*,car_parts_invoices (car_part_id, quantity, total_price_excl_tax, car_parts (id, name, price )), clients (id, name, surname, phone_number)`
    )
    .eq("id", id)
    .single();

  if (error)
    throw new CustomError({
      message: "Error fetching invoice details",
      code: "BAD_REQUEST",
      statusCode: 400,
    });

  // TODO: faire un mapper
  let invoiceDetails: InvoiceDetails = {
    ...invoiceToInvoiceDto(data),
    clientId: data.client_id,
    taxAmount: data.tax_amount,
    taxRate: data.tax_rate,
    laborCostExclTax: data.labor_cost_excl_tax,
    otherFeesExclTax: data.other_fees_excl_tax,
    updatedAt: data.updated_at,
    clientInfo: {
      name: data.clients?.name,
      surname: data.clients?.surname,
      phoneNumber: data.clients?.phone_number,
    },
    carPartsInvoice: data.car_parts_invoices.map((carPartInvoice) => ({
      id: carPartInvoice.car_part_id,
      name: carPartInvoice.car_parts?.name,
      price: carPartInvoice.car_parts?.price,
      quantity: carPartInvoice.quantity,
      totalPriceExclTax: carPartInvoice.total_price_excl_tax,
    })),
  };
  return invoiceDetails;
};

export const createInvoiceService = async (
  invoice: InvoiceModel,
  supabase: ReturnType<typeof getAuthClient>
) => {
  // Total price for car parts
  let totalCarPartsPriceExclTax = 0;
  let parts = [];
  for (const item of invoice.carParts) {
    const { data: carPart, error } = await supabase
      .from("car_parts")
      .select("price")
      .eq("id", item.partId)
      .single();

    if (error || !carPart) {
      throw new CustomError({
        message: `Error fetching car parts`,
        code: "BAD_REQUEST",
        statusCode: 400,
      });
    }
    parts.push({
      car_part_id: item.partId,
      quantity: item.quantity,
      total_price_excl_tax: carPart.price * item.quantity,
    });
    totalCarPartsPriceExclTax += carPart.price * item.quantity;
  }

  // Total price excl tax
  const totalExclTax =
    totalCarPartsPriceExclTax +
    invoice.laborCostExclTax +
    (invoice.otherFeesExclTax || 0);

  // Total price incl tax
  const taxRate = 1.21; // 20% tax rate
  const totalInclTax = totalExclTax * taxRate;
  const taxAmount = totalInclTax - totalExclTax;
  const { data, error } = await supabase.rpc("insert_invoice_with_parts", {
    p_client_id: invoice.clientId,
    p_labor_cost_excl_tax: invoice.laborCostExclTax,
    p_other_fees_excl_tax: invoice.otherFeesExclTax || 0,
    p_tax_amount: taxAmount,
    p_total_excl_tax: totalExclTax,
    p_total_incl_tax: totalInclTax,
    p_parts: parts,
  });

  if (error)
    throw new CustomError({
      message: "Error creating invoice",
      code: "BAD_REQUEST",
      statusCode: 400,
    });

  return data;
};

export const updateInvoiceService = async (
  id: string,
  invoice: InvoiceModel,
  supabase: ReturnType<typeof getAuthClient>
) => {
  // Total price for car parts
  let totalCarPartsPriceExclTax = 0;
  let parts = [];
  for (const item of invoice.carParts) {
    const { data: carPart, error } = await supabase
      .from("car_parts")
      .select("price")
      .eq("id", item.partId)
      .single();

    if (error || !carPart) {
      throw new CustomError({
        message: `Error fetching car parts`,
        code: "BAD_REQUEST",
        statusCode: 400,
      });
    }
    parts.push({
      car_part_id: item.partId,
      quantity: item.quantity,
      total_price_excl_tax: carPart.price * item.quantity,
    });
    totalCarPartsPriceExclTax += carPart.price * item.quantity;
  }

  // Total price excl tax
  const totalExclTax =
    totalCarPartsPriceExclTax +
    invoice.laborCostExclTax +
    (invoice.otherFeesExclTax || 0);

  // Total price incl tax
  const taxRate = 1.21; // 20% tax rate
  const totalInclTax = totalExclTax * taxRate;
  const taxAmount = totalInclTax - totalExclTax;
  const { error } = await supabase.rpc("update_invoice_with_parts", {
    p_invoice_id: id,
    p_client_id: invoice.clientId,
    p_labor_cost_excl_tax: invoice.laborCostExclTax,
    p_other_fees_excl_tax: invoice.otherFeesExclTax || 0,
    p_tax_amount: taxAmount,
    p_total_excl_tax: totalExclTax,
    p_total_incl_tax: totalInclTax,
    p_parts: parts,
  });

  if (error)
    throw new CustomError({
      message: "Error updating invoice",
      code: "BAD_REQUEST",
      statusCode: 400,
    });
};

export const convertToPdfService = async (
  content: string,
  supabase: ReturnType<typeof getAuthClient>
): Promise<Buffer> => {
  const isLogedIn = await supabase.auth.getUser();
  if (!isLogedIn.data.user) {
    throw new CustomError({
      message: "Unauthorized",
      code: "UNAUTHORIZED",
      statusCode: 401,
    });
  }

  // Check if the content is already a complete HTML document
  const isCompleteHtml =
    content.trim().toLowerCase().startsWith("<!doctype html") ||
    content.trim().toLowerCase().startsWith("<html");

  const response = await fetch(`${process.env.PDF_SHIFT_URL}`, {
    method: "POST",
    headers: {
      "X-API-Key": `${process.env.PDF_SHIFT_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      // Use the content as-is if it's already a complete HTML document
      source: content,
      // Use portrait mode for invoices (better for A4 format)
      landscape: false,
      // Set proper margins for professional invoices
      margin: {
        top: "10mm",
        right: "15mm",
        bottom: "10mm",
        left: "15mm",
      },
      // Set A4 paper format
      format: "A4",
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("PDFShift error:", errorText);
    throw new CustomError({
      message: `Error converting to PDF: ${response.statusText}`,
      code: "BAD_REQUEST",
      statusCode: 400,
    });
  }

  // Convertir la réponse en buffer
  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
};
