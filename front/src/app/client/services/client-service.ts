import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Injectable, Signal } from '@angular/core';
import { Client } from '../models/client';
import { z } from 'zod';

@Injectable({
  providedIn: 'root',
})
export class ClientService {
  readonly #httpClient = inject(HttpClient);
  /**
   * Get all clients
   * @returns A resourceResponse of client array
   */
  getClients() {
    return httpResource<Client[]>(
      () => ({
        url: 'api/clients',
      }),
      {
        defaultValue: [] as Client[],
        parse: (response) => {
          return this.#clientSchema.array().parse((response as { data: Client[] }).data);
        },
      }
    );
  }
  /**
   * Get a client by id
   * @param id - The id of the client
   * @returns A resourceResponse with the client
   */
  getClient(id: Signal<string>) {
    return httpResource<Client>(
      () => ({
        url: `api/clients/${id()}`,
      }),
      {
        parse: (response) => {
          return this.#clientSchema.parse((response as { data: Client }).data);
        },
      }
    );
  }

  /**
   * Create a client
   * @param client - The client to create
   * @returns A Observable with the response of the request
   */
  createClient(client: Partial<Client>) {
    return this.#httpClient.post<unknown>('api/clients', client);
  }

  #clientSchema = z.object({
    id: z.string(),
    name: z.string(),
    surname: z.string(),
    email: z.string(),
    phoneNumber: z.number(),
  });
}
