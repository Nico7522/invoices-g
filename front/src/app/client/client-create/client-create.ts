import { Component, DestroyRef, inject } from '@angular/core';
import { ClientForm } from '../../shared/ui/client-form/client-form';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ClientService } from '../services/client-service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Client } from '../../shared/models/client-interfaces';
import { MessageService } from 'primeng/api';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-client-create',
  imports: [ClientForm, ReactiveFormsModule, ButtonModule, RouterModule],
  templateUrl: './client-create.html',
  styleUrl: './client-create.scss',
})
export class ClientCreate {
  readonly #clientService = inject(ClientService);
  readonly #destroyRef = inject(DestroyRef);
  readonly #messageService = inject(MessageService);
  readonly #router = inject(Router);
  readonly createClientForm = new FormGroup({});

  onSubmit() {
    if (this.createClientForm.valid) {
      const clientValue = this.createClientForm.get('client')?.value;
      if (clientValue) {
        const client: Client = clientValue as Client;

        this.#clientService
          .createClient(client)
          .pipe(takeUntilDestroyed(this.#destroyRef))
          .subscribe({
            next: (res) => {
              this.#messageService.add({
                severity: 'success',
                summary: 'Succès',
                detail: 'Client créé avec succès',
              });
              this.#router.navigate(['/clients']);
            },
          });
      }
    }
  }
}
