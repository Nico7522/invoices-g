import { Component, input, computed, ViewChild, ElementRef, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { DividerModule } from 'primeng/divider';
import { Invoice } from '../models/invoice-interface';

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
  ],
  templateUrl: './invoice-details.html',
  styleUrl: './invoice-details.scss',
})
export class InvoiceDetails {
  readonly invoicePrint = viewChild.required<ElementRef<HTMLElement>>('invoicePrint');
  invoice = input<Invoice>();
  showOtherFees = false;

  // Mock client data (since we don't have client details in invoice interface)
  mockClient = {
    name: 'Dupont',
    surname: 'Jean',
    phoneNumber: '06 12 34 56 78',
  };

  // Mock line items for car parts
  lineItems: LineItem[] = [
    { description: 'Filtre à huile', quantity: 1, unitPrice: 25.5, total: 25.5 },
    { description: 'Huile moteur 5W30', quantity: 4, unitPrice: 8.75, total: 35.0 },
    { description: "Bougie d'allumage", quantity: 4, unitPrice: 12.9, total: 51.6 },
    { description: 'Plaquette de frein avant', quantity: 2, unitPrice: 45.0, total: 90.0 },
  ];

  lineItemsTotal = computed(() => this.lineItems.reduce((sum, item) => sum + item.total, 0));

  subtotal = computed(() => {
    return this.lineItemsTotal() + (this.invoice()?.laborCostExclPrice || 0);
  });

  taxAmount = computed(() => {
    return this.subtotal() * ((this.invoice()?.taxRate || 0) / 100);
  });

  totalWithTax = computed(() => {
    return this.subtotal() + this.taxAmount();
  });

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  }

  toggleOtherFees(): void {
    this.showOtherFees = !this.showOtherFees;
  }

  printInvoice(): void {
    const printElement = this.invoicePrint().nativeElement;
    window.print();
  }
}
