import { Component, inject } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { GetClientService } from '../../shared/services/client/get-client-service';
import { InvoiceForm } from '../ui/invoice-form/invoice-form';
import { GetCarPartsService } from '../../shared/services/car-part/get-car-parts-service';

@Component({
  selector: 'app-invoice-create',
  imports: [ReactiveFormsModule, InvoiceForm, ButtonModule],
  templateUrl: './invoice-create.html',
  styleUrl: './invoice-create.scss',
})
export class InvoiceCreate {
  readonly #getClientService = inject(GetClientService);
  readonly #getCarPartsService = inject(GetCarPartsService);
  clients = this.#getClientService.getClients();
  carParts = this.#getCarPartsService.getCarParts();
  createInvoiceForm = new FormGroup({});

  onSubmit() {
    console.log(this.createInvoiceForm.value);
  }
}
