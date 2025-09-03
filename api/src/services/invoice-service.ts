import { getAuthClient } from "../config/supabase";
import CustomError from "../errors/custom-error";
import { invoiceToInvoiceDto } from "../mappers/invoice-mapper";
import { InvoiceDetails } from "../models/invoice";
global.btoa = (b) => Buffer.from(b).toString("base64");
import fetch from "node-fetch";
import dotenv from "dotenv";
import fs from "fs";
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
      source: isCompleteHtml
        ? content
        : '<!DOCTYPE html><html><head><meta charset="utf-8"><title>Document</title></head><body>' +
          content +
          "</body></html>",
      // Use portrait mode for invoices (better for A4 format)
      landscape: false,
      // Set proper margins for professional invoices
      margin: {
        top: "30mm",
        right: "15mm",
        bottom: "30mm",
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
