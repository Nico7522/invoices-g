import { inject, Injectable, Signal } from '@angular/core';
import { HttpClient, httpResource } from '@angular/common/http';
import { Invoice, InvoiceDetails } from '../../shared/models/invoice-interface';
import { invoiceSchema } from '../../shared/schemas/invoice-schema';
import { map, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class InvoiceService {
  readonly #httpclient = inject(HttpClient);
  /**
   * Get all invoices
   * @returns A resourceResponse of invoice array
   */
  getInvoices() {
    return httpResource<Invoice[]>(
      () => ({
        url: 'invoices',
      }),
      {
        defaultValue: [] as Invoice[],
        parse: (response) => {
          return invoiceSchema.array().parse((response as { data: Invoice[] }).data);
        },
      }
    );
  }

  /**
   * Get invoice details
   * @param id - The id of the invoice
   * @returns A resourceResponse with the invoice details
   */
  getInvoiceDetails(id: Signal<string>) {
    return httpResource<InvoiceDetails>(() => (id() ? `invoices/${id()}` : undefined), {
      parse: (response) => {
        return (response as { data: InvoiceDetails }).data;
      },
    });
  }

  createInvoice(data: Partial<InvoiceDetails>) {
    return this.#httpclient.post<{ data: string }>('invoices', data).pipe(
      map((res) => {
        return { id: res.data };
      })
    );
  }

  updateInvoice(id: string, data: Partial<InvoiceDetails>) {
    return this.#httpclient.put(`invoices/${id}`, data);
  }

  deleteInvoice(id: string) {
    return this.#httpclient.delete(`invoices/${id}`);
  }

  generatePdf(html: string, invoiceId?: string): Observable<Blob> {
    return this.#httpclient
      .post('invoices/pdf', { content: html, invoiceId }, { responseType: 'blob' })
      .pipe(
        tap((response) => {
          const url = window.URL.createObjectURL(response);
          const a = document.createElement('a');
          a.href = url;
          // The filename will be set by the backend based on invoiceId
          a.download = invoiceId ? `facture_${invoiceId}.pdf` : 'invoice.pdf';
          a.click();
          window.URL.revokeObjectURL(url);
        })
      );
  }
}
