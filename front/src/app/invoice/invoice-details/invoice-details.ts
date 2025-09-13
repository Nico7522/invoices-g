import {
  Component,
  input,
  computed,
  ElementRef,
  viewChild,
  inject,
  signal,
  effect,
} from '@angular/core';
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
import { generatePdfHtml } from '../../shared/utils/generate-pdf';
import { InvoiceDetails as InvoiceDetailsType } from '../../shared/models/invoice-interface';
import { take } from 'rxjs';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { Title } from '@angular/platform-browser';
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
  // customDataTable = {
  //   colorScheme: {
  //     dark: {
  //       row: {
  //         background: '#262626',
  //       },
  //       headerCell: {
  //         background: '#1a1a1a',
  //         color: '#4caf50',
  //         fontWeight: '600',
  //       },
  //     },
  //   },
  // };
  readonly #invoiceService = inject(InvoiceService);
  readonly #title = inject(Title);
  pdfLoading = signal(false);
  id = input.required<string>();
  invoice = this.#invoiceService.getInvoiceDetails(this.id);
  showOtherFees = signal(false);

  subtotal = computed(() => {
    return this.invoice
      .value()
      ?.carPartsInvoice.reduce((sum, item) => sum + item.totalPriceExclTax, 0);
  });

  constructor() {
    effect(() => {
      if (this.invoice.hasValue()) {
        this.#title.setTitle(
          `Détails de la facture | ${this.invoice.value().clientInfo.name} ${
            this.invoice.value().clientInfo.surname
          }`
        );
      }
    });
  }

  toggleOtherFees() {
    this.showOtherFees.update((prev) => !prev);
  }

  printInvoice() {
    const invoice = this.invoice.value();
    if (!invoice) {
      return;
    }

    // Créer une nouvelle fenêtre avec le style PDF pour l'impression
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      return;
    }

    const htmlContent = generatePdfHtml(invoice);
    printWindow.document.writeln(htmlContent);
    printWindow.document.close();

    // Attendre que le contenu soit chargé puis imprimer
    printWindow.onload = () => {
      printWindow.print();
      printWindow.close();
    };
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
