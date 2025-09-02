import { Injectable, Signal } from '@angular/core';
import { Invoice, InvoiceDetails } from '../models/invoice-interface';
import { httpResource } from '@angular/common/http';
import z from 'zod';

@Injectable({
  providedIn: 'root',
})
export class InvoiceService {
  /**
   * Get all invoices
   * @returns A resourceResponse of invoice array
   */
  getInvoices() {
    return httpResource<Invoice[]>(
      () => ({
        url: 'api/invoices',
      }),
      {
        defaultValue: [] as Invoice[],
        parse: (response) => {
          return this.#invoiceSchema.array().parse((response as { data: Invoice[] }).data);
        },
      }
    );
  }

  readonly #invoiceSchema = z.object({
    id: z.string(),
    totalExclTax: z.number(),
    createdAt: z.string(),
    totalInclTax: z.number(),
  });

  /**
   * Get invoice details
   * @param id - The id of the invoice
   * @returns A resourceResponse with the invoice details
   */
  getInvoiceDetails(id: Signal<string>) {
    return httpResource<InvoiceDetails>(() => (id() ? `api/invoices/${id()}` : undefined), {
      parse: (response) => {
        return (response as { data: InvoiceDetails }).data;
      },
    });
  }
}
