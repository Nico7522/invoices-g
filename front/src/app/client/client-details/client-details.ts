import { Component, inject, input } from '@angular/core';
import { ClientService } from '../services/client-service';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { RouterModule } from '@angular/router';
import { ErrorCard } from '../../shared/ui/error-card/error-card';
import { LoadingCard } from '../../shared/ui/loading-card/loading-card';

@Component({
  selector: 'app-client-details',
  imports: [CardModule, ButtonModule, RouterModule, LoadingCard, ErrorCard],
  templateUrl: './client-details.html',
  styleUrl: './client-details.scss',
})
export class ClientDetails {
  readonly #clientService = inject(ClientService);

  id = input.required<string>();
  client = this.#clientService.getClient(this.id);
}
