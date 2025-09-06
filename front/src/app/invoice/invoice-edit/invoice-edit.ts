import { Component, effect, inject, input } from '@angular/core';
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
@Component({
  selector: 'app-invoice-edit',
  imports: [InvoiceForm, ReactiveFormsModule, ButtonModule],
  templateUrl: './invoice-edit.html',
  styleUrl: './invoice-edit.scss',
})
export class InvoiceEdit {
  readonly #invoiceService = inject(InvoiceService);
  readonly #getClientService = inject(GetClientService);
  readonly #carPartsService = inject(GetCarPartsService);

  id = input.required<string>();
  invoice = this.#invoiceService.getInvoiceDetails(this.id);
  clients = this.#getClientService.getClients();
  carParts = this.#carPartsService.carParts;
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

  onSubmit() {}

  ngOnInit() {}

  constructor() {
    effect(() => {
      let carParts = this.editInvoiceForm.get('invoice')?.get('carParts') as FormArray;
      this.editInvoiceForm.patchValue({
        invoice: {
          clientId: this.invoice.value()?.clientId,
          laborCostExclTax: this.invoice.value()?.laborCostExclTax,
          otherFeesExclTax: this.invoice.value()?.otherFeesExclTax,
        },
      });
      if (this.invoice.hasValue()) {
        while (carParts.controls.length < this.invoice.value().carPartsInvoice.length) {
          carParts.push(
            new FormGroup({
              partId: new FormControl(''),
              quantity: new FormControl(''),
            })
          );
        }
        this.editInvoiceForm;
        carParts.patchValue(
          this.invoice.value().carPartsInvoice.map((carPart) => ({
            partId: carPart.id,
            quantity: carPart.quantity,
          }))
        );
      }
    });
  }
}
