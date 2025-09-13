import { Component, inject, input, effect } from '@angular/core';
import { ClientService } from '../services/client-service';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { RouterModule } from '@angular/router';
import { ErrorCard } from '../../shared/ui/error-card/error-card';
import { LoadingCard } from '../../shared/ui/loading-card/loading-card';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-client-details',
  imports: [CardModule, ButtonModule, RouterModule, LoadingCard, ErrorCard],
  templateUrl: './client-details.html',
  styleUrl: './client-details.scss',
})
export class ClientDetails {
  readonly #clientService = inject(ClientService);
  readonly #title = inject(Title);

  id = input.required<string>();
  client = this.#clientService.getClient(this.id);

  constructor() {
    effect(() => {
      if (this.client.hasValue()) {
        this.#title.setTitle(
          `Détails du client | ${this.client.value().name} ${this.client.value().surname}`
        );
      }
    });
  }
}
