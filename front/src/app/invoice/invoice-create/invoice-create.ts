import { Component, DestroyRef, inject } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { GetClientService } from '../../shared/services/client/get-client-service';
import { InvoiceForm } from '../ui/invoice-form/invoice-form';
import { GetCarPartsService } from '../../shared/services/car-part/get-car-parts-service';
import { InvoiceService } from '../services/invoice-service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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
  clients = this.#getClientService.getClients();
  carParts = this.#getCarPartsService.getCarParts();
  createInvoiceForm = new FormGroup({});

  onSubmit() {
    this.#invoiceService
      .createInvoice(this.createInvoiceForm.value)
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
