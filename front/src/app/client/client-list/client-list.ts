import { Component, inject } from '@angular/core';
import { ClientService } from '../services/client-service';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-client-list',
  imports: [TableModule, ButtonModule],
  templateUrl: './client-list.html',
  styleUrl: './client-list.scss',
})
export class ClientList {
  readonly #clientService = inject(ClientService);

  clients = this.#clientService.getClients();
}
