import { Component } from '@angular/core';
import { ClientForm } from '../../shared/ui/client-form/client-form';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-client-create',
  imports: [ClientForm, ReactiveFormsModule, ButtonModule],
  templateUrl: './client-create.html',
  styleUrl: './client-create.scss',
})
export class ClientCreate {
  createClientForm = new FormGroup({});

  onSubmit() {
    console.log(this.createClientForm.value);
  }
}
