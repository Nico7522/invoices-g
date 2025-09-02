import {
  Component,
  input,
  computed,
  ViewChild,
  ElementRef,
  viewChild,
  inject,
  effect,
  ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { DividerModule } from 'primeng/divider';
import { Invoice } from '../models/invoice-interface';
import { InvoiceService } from '../services/invoice-service';
import { ErrorCard } from '../../shared/ui/error-card/error-card';
import { LoadingCard } from '../../shared/ui/loading-card/loading-card';

interface LineItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

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
  ],
  templateUrl: './invoice-details.html',
  styleUrl: './invoice-details.scss',
})
export class InvoiceDetails {
  readonly #invoiceService = inject(InvoiceService);
  id = input.required<string>();
  invoice = this.#invoiceService.getInvoiceDetails(this.id);
  readonly invoicePrint = viewChild.required<ElementRef<HTMLElement>>('invoicePrint');
  showOtherFees = false;

  subtotal = computed(() => {
    return this.invoice
      .value()
      ?.carPartsInvoice.reduce((sum, item) => sum + item.totalPriceExclTax, 0);
  });

  toggleOtherFees(): void {
    this.showOtherFees = !this.showOtherFees;
  }

  printInvoice(): void {
    const printElement = this.invoicePrint().nativeElement;
    if (!printElement) {
      console.error('Élément de facture non trouvé');
      return;
    }
    window.print();
  }
}
