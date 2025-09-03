import { Component, input, computed, ElementRef, viewChild, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { DividerModule } from 'primeng/divider';
import { InvoiceService } from '../services/invoice-service';
import { ErrorCard } from '../../shared/ui/error-card/error-card';
import { LoadingCard } from '../../shared/ui/loading-card/loading-card';
import { InvoiceDetails as InvoiceDetailsType } from '../models/invoice-interface';
import { generatePdfHtml } from '../../shared/utils/generate-pdf';
import { take } from 'rxjs';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
@Component({
  selector: 'app-invoice-details',
  imports: [
    CommonModule,
    RouterModule,
    ButtonModule,
    CardModule,
    TableModule,
    TagModule,
    DividerModule,
    ErrorCard,
    LoadingCard,
    ProgressSpinnerModule,
  ],
  templateUrl: './invoice-details.html',
  styleUrl: './invoice-details.scss',
})
export class InvoiceDetails {
  readonly #invoiceService = inject(InvoiceService);
  pdfLoading = signal(false);
  id = input.required<string>();
  invoice = this.#invoiceService.getInvoiceDetails(this.id);
  readonly invoicePrint = viewChild.required<ElementRef<HTMLElement>>('invoicePrint');
  showOtherFees = signal(false);

  subtotal = computed(() => {
    return this.invoice
      .value()
      ?.carPartsInvoice.reduce((sum, item) => sum + item.totalPriceExclTax, 0);
  });

  toggleOtherFees() {
    this.showOtherFees.update((prev) => !prev);
  }

  printInvoice() {
    const printElement = this.invoicePrint().nativeElement;
    console.log(printElement);
    if (!printElement) {
      return;
    }
    window.print();
  }

  generatePdf() {
    const htmlContent = generatePdfHtml(this.invoice.value() as InvoiceDetailsType);
    this.pdfLoading.set(true);
    this.#invoiceService
      .generatePdf(htmlContent, this.invoice.value()?.id.toString())
      .pipe(take(1))
      .subscribe({
        complete: () => {
          this.pdfLoading.set(false);
        },
        error: () => {
          this.pdfLoading.set(false);
        },
      });
  }
}
