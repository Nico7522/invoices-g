import { Component, effect, inject, input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ClientForm } from '../../shared/ui/client-form/client-form';
import { ButtonModule } from 'primeng/button';
import { ClientService } from '../services/client-service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-client-edit',
  imports: [ClientForm, ReactiveFormsModule, ButtonModule, RouterModule],
  templateUrl: './client-edit.html',
  styleUrl: './client-edit.scss',
})
export class ClientEdit {
  readonly #clientService = inject(ClientService);
  id = input.required<string>();
  client = this.#clientService.getClient(this.id);
  clientEditForm = new FormGroup({});

  onSubmit() {
    console.log(this.clientEditForm.value);
  }

  constructor() {
    effect(() => {
      this.clientEditForm.patchValue({
        client: this.client.value(),
      });
    });
  }
}
