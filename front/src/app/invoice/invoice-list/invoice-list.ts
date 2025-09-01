import { Component, inject } from '@angular/core';
import { InvoiceService } from '../services/invoice-service';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { RouterModule } from '@angular/router';
import { ConfirmPopupModule } from 'primeng/confirmpopup';

@Component({
  selector: 'app-invoice-list',
  imports: [TableModule, ButtonModule, RouterModule],
  templateUrl: './invoice-list.html',
  styleUrl: './invoice-list.scss',
})
export class InvoiceList {
  readonly #invoiceService = inject(InvoiceService);
  invoices = this.#invoiceService.getInvoices();
}
