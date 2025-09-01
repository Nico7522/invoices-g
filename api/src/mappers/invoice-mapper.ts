import { Database } from "../models/database.types";

export function invoiceToInvoiceDto(
  invoice: Database["public"]["Tables"]["invoices"]["Row"]
) {
  return {
    id: invoice.id,
    clientId: invoice.client_id,
    totalExclPrice: invoice.total_excl_tax,
    taxAmount: invoice.tax_amount,
    taxRate: invoice.tax_rate,
    totalInclPrice: invoice.total_incl_tax,
    laborCostExclPrice: invoice.labor_cost_excl_tax,
    otherFeesExclPrice: invoice.other_fees_excl_tax,
    createdAt: new Date(invoice.created_at).toLocaleDateString(),
    updatedAt: new Date(invoice.updated_at).toLocaleDateString(),
  };
}
