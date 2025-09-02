/**
 * Retreive all invoices
 */

import { getAuthClient } from "../config/supabase";
import CustomError from "../errors/custom-error";
import { invoiceToInvoiceDto } from "../mappers/invoice-mapper";
import { InvoiceDetails } from "../models/invoice";

export const getInvoicesService = async (
  supabase: ReturnType<typeof getAuthClient>
) => {
  const { data, error } = await supabase.from("invoices").select(`*`);
  console.log(error);

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
      `*,car_parts_invoices (car_part_id, quantity, total_price_excl_tax, car_parts (id, name, price ))`
    )
    .eq("id", id)
    .single();

  if (error)
    throw new CustomError({
      message: "Error fetching invoice details",
      code: "BAD_REQUEST",
      statusCode: 400,
    });
  let invoiceDetails: InvoiceDetails = {
    ...invoiceToInvoiceDto(data),
    clientId: data.client_id,
    taxAmount: data.tax_amount,
    taxRate: data.tax_rate,
    laborCostExclTax: data.labor_cost_excl_tax,
    otherFeesExclTax: data.other_fees_excl_tax,
    updatedAt: data.updated_at,
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
