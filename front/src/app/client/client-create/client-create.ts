import { Component, DestroyRef, inject } from '@angular/core';
import { ClientForm } from '../../shared/ui/client-form/client-form';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ClientService } from '../services/client-service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-client-create',
  imports: [ClientForm, ReactiveFormsModule, ButtonModule],
  templateUrl: './client-create.html',
  styleUrl: './client-create.scss',
})
export class ClientCreate {
  readonly #clientService = inject(ClientService);
  readonly #destroyRef = inject(DestroyRef);
  createClientForm = new FormGroup({});

  onSubmit() {
    if (this.createClientForm.valid) {
      this.#clientService
        .createClient(this.createClientForm.value)
        .pipe(takeUntilDestroyed(this.#destroyRef))
        .subscribe((res) => console.log(res));
    }
  }
}
