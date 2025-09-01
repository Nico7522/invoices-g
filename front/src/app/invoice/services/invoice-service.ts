import { Injectable } from '@angular/core';
import { Invoice } from '../models/invoice-interface';
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
          console.log(response);

          return this.#invoiceSchema.array().parse((response as { data: Invoice[] }).data);
        },
      }
    );
  }

  readonly #invoiceSchema = z.object({
    id: z.string(),
    clientId: z.string(),
    totalExclPrice: z.number(),
    taxAmount: z.number(),
    taxRate: z.number(),
    totalInclPrice: z.number(),
    laborCostExclPrice: z.number(),
    otherFeesExclPrice: z.number(),
    createdAt: z.string(),
    updatedAt: z.string(),
  });
}
