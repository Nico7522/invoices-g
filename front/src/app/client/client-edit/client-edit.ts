import { Component, DestroyRef, effect, inject, input, model, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ClientForm } from '../ui/client-form/client-form';
import { ButtonModule } from 'primeng/button';
import { ClientService } from '../services/client-service';
import { Router, RouterModule } from '@angular/router';
import { Client } from '../client';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MessageService } from 'primeng/api';
import {
  ClientFormGroup,
  ClientForm as ClientFormInterface,
} from '../models/client-form-interface';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-client-edit',
  imports: [ClientForm, ReactiveFormsModule, ButtonModule, RouterModule],
  templateUrl: './client-edit.html',
  styleUrl: './client-edit.scss',
})
export class ClientEdit {
  test2 = '';
  readonly #clientService = inject(ClientService);
  readonly #destroyRef = inject(DestroyRef);
  readonly #messageService = inject(MessageService);
  readonly #router = inject(Router);
  readonly #title = inject(Title);
  id = input.required<string>();
  client = this.#clientService.getClient(this.id);
  clientEditForm = new FormGroup({} as ClientFormInterface);
  loading = signal(false);
  onSubmit() {
    if (this.clientEditForm.valid) {
      let phoneNumber = this.clientEditForm
        .getRawValue()
        .client.phoneNumber.toString()
        .replace(/\s/g, '');
      const clientValue = {
        ...this.clientEditForm.getRawValue().client,
        phoneNumber,
      };

      this.loading.set(true);
      this.#clientService
        .updateClient(this.id(), clientValue as Partial<Client>)
        .pipe(takeUntilDestroyed(this.#destroyRef))
        .subscribe({
          next: (res) => {
            this.loading.set(false);
            this.#messageService.add({
              severity: 'success',
              summary: 'Succès',
              detail: 'Client modifié avec succès',
            });
            this.#router.navigate(['/clients', this.id()]);
          },
          error: (err) => {
            this.loading.set(false);
          },
        });
    }
  }

  constructor() {
    effect(() => {
      if (this.client.hasValue()) {
        this.#title.setTitle(
          `Modifier le client | ${this.client.value().name} ${this.client.value().surname}`
        );
        this.clientEditForm.patchValue({
          client: this.client.value() as Client,
        });
      }
    });
  }
}
