import { httpResource } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Client } from '../models/client';
import { z } from 'zod';

@Injectable({
  providedIn: 'root',
})
export class ClientService {
  getClients() {
    return httpResource<Client[]>(
      () => ({
        url: 'api/clients',
      }),
      {
        defaultValue: [] as Client[],
        parse: (response) => {
          return this.#clientScema.parse((response as { data: Client[] }).data);
        },
      }
    );
  }

  #clientScema = z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      surname: z.string(),
      email: z.string(),
      phoneNumber: z.number(),
    })
  );
}
