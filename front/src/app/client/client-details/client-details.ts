import { Component, computed, DestroyRef, inject, input, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ClientService } from '../services/client-service';
import { toSignal } from '@angular/core/rxjs-interop';
import { Client } from '../models/client';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { RouterModule } from '@angular/router';
import { map } from 'rxjs';
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
  readonly #route = inject(ActivatedRoute);
  readonly #destroyRef = inject(DestroyRef);
  id = input.required<string>();
  client = this.#clientService.getClient(this.id);
}
