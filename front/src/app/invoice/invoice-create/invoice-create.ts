import { Component, DestroyRef, inject } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { GetClientService } from '../../shared/services/client/get-client-service';
import { InvoiceForm } from '../ui/invoice-form/invoice-form';
import { GetCarPartsService } from '../../shared/services/car-part/get-car-parts-service';
import { InvoiceService } from '../services/invoice-service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  InvoiceFormGroup,
  InvoiceForm as InvoiceFormInterface,
} from '../models/invoice-form-interface';
import { InvoiceDetails } from '../models/invoice-interface';

@Component({
  selector: 'app-invoice-create',
  imports: [ReactiveFormsModule, InvoiceForm, ButtonModule],
  templateUrl: './invoice-create.html',
  styleUrl: './invoice-create.scss',
})
export class InvoiceCreate {
  readonly #getClientService = inject(GetClientService);
  readonly #getCarPartsService = inject(GetCarPartsService);
  readonly #invoiceService = inject(InvoiceService);
  readonly #router = inject(Router);
  readonly #messageService = inject(MessageService);
  readonly #destroyRef = inject(DestroyRef);
  clients = this.#getClientService.clients;
  carParts = this.#getCarPartsService.carParts;
  createInvoiceForm = new FormGroup<InvoiceFormInterface>({
    invoice: new FormGroup<InvoiceFormGroup>({
      clientId: new FormControl('', { nonNullable: true, validators: Validators.required }),
      carParts: new FormArray([
        new FormGroup({
          partId: new FormControl('', { nonNullable: true, validators: Validators.required }),
          quantity: new FormControl(0, {
            nonNullable: true,
            validators: [Validators.required, Validators.min(1)],
          }),
        }),
      ]),
      laborCostExclTax: new FormControl(0, {
        nonNullable: true,
        validators: [Validators.required, Validators.min(1)],
      }),
      otherFeesExclTax: new FormControl(0),
    }),
  });

  onSubmit() {
    this.#invoiceService
      .createInvoice(this.createInvoiceForm.value as InvoiceDetails)
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe({
        next: (response) => {
          this.#router.navigate(['/invoices', response.id]);
          this.#messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Invoice created successfully',
          });
        },
        error: (error) => {},
      });
  }
}
