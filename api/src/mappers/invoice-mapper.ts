import { Database } from "../models/database.types";
import { Invoice } from "../models/invoice";

export function invoiceToInvoiceDto(
  invoice: Database["public"]["Tables"]["invoices"]["Row"]
): Invoice {
  return {
    id: invoice.id,
    totalExclTax: invoice.total_excl_tax,
    totalInclTax: invoice.total_incl_tax,
    createdAt: new Date(invoice.created_at).toLocaleDateString(),
  };
}
