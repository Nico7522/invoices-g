import { Injectable } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { invoiceSchema } from '../../shared/schemas/invoice-schema';
import { Client } from '../../shared/models/client-interfaces';
import { clientSchema } from '../../shared/schemas/client-schema';
import { Invoice } from '../../shared/models/invoice-interface';

@Injectable({
  providedIn: 'root',
})
export class HomeService {
  /**
   * Retrieve all clients and return the last 5
   * @returns A httpResourceRef with the last 5 invoices
   */
  lastInvoices = httpResource<Invoice[]>(() => 'api/invoices', {
    parse: (response) => {
      return invoiceSchema
        .array()
        .parse((response as { data: Invoice[] }).data)
        .slice(0, 5);
    },
  });

  /**
   * Retrieve all clients and return the last 5
   * @returns A httpResourceRef with the last 5 clients
   */
  lastClients = httpResource<Client[]>(() => 'api/clients', {
    parse: (response) => {
      return clientSchema
        .array()
        .parse((response as { data: Client[] }).data)
        .slice(0, 5);
    },
  });
}
