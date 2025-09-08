import { httpResource } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Client } from '../../models/client-interfaces';
import { clientSchema } from '../../schemas/client-schema';

@Injectable({
  providedIn: 'root',
})
export class GetClientService {
  /**
   * Retrieve all clients
   * httpResource in shared folder because it is used in both client and invoice
   * @returns A httpResourceRef of client array
   */
  clients = httpResource<Client[]>(
    () => ({
      url: 'api/clients',
    }),
    {
      defaultValue: [] as Client[],
      parse: (response) => {
        return clientSchema.array().parse((response as { data: Client[] }).data);
      },
    }
  );
}
