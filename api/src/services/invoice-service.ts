/**
 * Retreive all invoices
 */

import { getAuthClient } from "../config/supabase";
import CustomError from "../errors/custom-error";
import { invoiceToInvoiceDto } from "../mappers/invoice-mapper";

export const getInvoicesService = async (
  supabase: ReturnType<typeof getAuthClient>
) => {
  const { data, error } = await supabase.from("invoices").select("*");
  if (error)
    throw new CustomError({
      message: "Error fetching invoices",
      code: "BAD_REQUEST",
      statusCode: 400,
    });

  return data.map(invoiceToInvoiceDto);
};
