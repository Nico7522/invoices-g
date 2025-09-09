import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Injectable, Signal } from '@angular/core';
import { Client } from '../../shared/models/client-interfaces';
import { clientSchema } from '../../shared/schemas/client-schema';

@Injectable({
  providedIn: 'root',
})
export class ClientService {
  readonly #httpClient = inject(HttpClient);

  /**
   * Get a client by id
   * @param id - The id of the client
   * @returns A resourceResponse with the client
   */
  getClient(id: Signal<string>) {
    return httpResource<Client>(() => (id() ? `clients/${id()}` : undefined), {
      parse: (response) => {
        return clientSchema.parse((response as { data: Client }).data);
      },
    });
  }

  /**
   * Create a client
   * @param client - The client to create
   * @returns A Observable with the response of the request
   */
  createClient(client: Partial<Client>) {
    return this.#httpClient.post<unknown>('clients', client);
  }

  /**
   * Update a client
   * @param id - The id of the client
   * @param client - The client to update
   * @returns A Observable with the response of the request
   */
  updateClient(id: string, client: Partial<Client>) {
    return this.#httpClient.put<unknown>(`clients/${id}`, client);
  }

  /**
   * Delete a client
   * @param id - The id of the client
   * @returns A Observable with the response of the request
   */
  deleteClient(id: string) {
    return this.#httpClient.delete<unknown>(`clients/${id}`);
  }
}
