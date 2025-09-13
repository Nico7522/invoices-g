import { Component, effect, inject, input, signal, untracked } from '@angular/core';
import { InvoiceForm } from '../ui/invoice-form/invoice-form';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { GetClientService } from '../../shared/services/client/get-client-service';
import { GetCarPartsService } from '../../shared/services/car-part/get-car-parts-service';
import { ButtonModule } from 'primeng/button';
import { InvoiceService } from '../services/invoice-service';
import {
  InvoiceFormGroup,
  InvoiceForm as InvoiceFormInterface,
} from '../models/invoice-form-interface';
import { InvoiceDetails } from '../../shared/models/invoice-interface';
import { take } from 'rxjs';
import { MessageService } from 'primeng/api';
import { Router, RouterModule } from '@angular/router';
import { Title } from '@angular/platform-browser';
@Component({
  selector: 'app-invoice-edit',
  imports: [InvoiceForm, ReactiveFormsModule, ButtonModule, RouterModule],
  templateUrl: './invoice-edit.html',
  styleUrl: './invoice-edit.scss',
})
export class InvoiceEdit {
  readonly #invoiceService = inject(InvoiceService);
  readonly #getClientService = inject(GetClientService);
  readonly #carPartsService = inject(GetCarPartsService);
  readonly #messageService = inject(MessageService);
  readonly #router = inject(Router);
  readonly #title = inject(Title);
  id = input.required<string>();
  invoice = this.#invoiceService.getInvoiceDetails(this.id);
  clients = this.#getClientService.clients;
  carParts = this.#carPartsService.carParts;
  initialized = signal(false);
  editInvoiceForm = new FormGroup<InvoiceFormInterface>({
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
    if (this.editInvoiceForm.valid) {
      this.#invoiceService
        .updateInvoice(this.id(), this.editInvoiceForm.value as Partial<InvoiceDetails>)
        .pipe(take(1))
        .subscribe({
          next: () => {
            this.#messageService.add({
              severity: 'success',
              summary: 'Succès',
              detail: 'Facture mise à jour avec succès',
            });
            this.#router.navigate(['/invoices', this.id()]);
          },
          error: () => {},
        });
    }
  }

  constructor() {
    const effectRef = effect(
      () => {
        const initialized = untracked(() => this.initialized);

        if (initialized()) {
          effectRef.destroy();
        }

        if (this.invoice.hasValue()) {
          this.initialized.set(true);

          this.#title.setTitle(
            `Modifier la facture | ${this.invoice.value().clientInfo.name} ${
              this.invoice.value().clientInfo.surname
            }`
          );

          let carParts = this.editInvoiceForm.get('invoice')?.get('carParts') as FormArray;
          this.editInvoiceForm.patchValue({
            invoice: {
              clientId: this.invoice.value().clientId,
              laborCostExclTax: this.invoice.value().laborCostExclTax,
              otherFeesExclTax: this.invoice.value().otherFeesExclTax,
            },
          });
          if (this.invoice.hasValue()) {
            while (carParts.controls.length < this.invoice.value().carPartsInvoice?.length) {
              carParts.push(
                new FormGroup({
                  partId: new FormControl('', {
                    nonNullable: true,
                    validators: Validators.required,
                  }),
                  quantity: new FormControl(0, {
                    nonNullable: true,
                    validators: [Validators.required, Validators.min(1)],
                  }),
                })
              );
            }

            carParts.patchValue(
              this.invoice.value().carPartsInvoice.map((carPart) => ({
                partId: carPart.id,
                quantity: carPart.quantity,
              }))
            );
          }
        }
      },
      { manualCleanup: true }
    );
  }
}
