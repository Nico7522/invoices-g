import { Component, DestroyRef, inject } from '@angular/core';
import { InvoiceService } from '../services/invoice-service';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { RouterModule } from '@angular/router';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ConfirmationService, MessageService } from 'primeng/api';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-invoice-list',
  imports: [TableModule, ButtonModule, RouterModule, ConfirmPopupModule],
  templateUrl: './invoice-list.html',
  styleUrl: './invoice-list.scss',
  providers: [ConfirmationService],
})
export class InvoiceList {
  readonly #invoiceService = inject(InvoiceService);
  readonly #confirmationService = inject(ConfirmationService);
  readonly #destroyRef = inject(DestroyRef);
  readonly #messageService = inject(MessageService);
  invoices = this.#invoiceService.getInvoices();

  confirmDelete(event: Event, id: string) {
    this.#confirmationService.confirm({
      target: event.currentTarget as EventTarget,
      message: 'Êtes-vous sûr de vouloir supprimer ce client ?',
      icon: 'pi pi-exclamation-triangle',
      rejectButtonProps: {
        label: 'Annuler',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Supprimer',
        severity: 'danger',
        icon: 'pi pi-trash',
      },
      accept: () => {
        this.#invoiceService
          .deleteInvoice(id)
          .pipe(takeUntilDestroyed(this.#destroyRef))
          .subscribe({
            next: () => {
              this.#messageService.add({
                severity: 'success',
                summary: 'Supprimé',
                detail: 'Client supprimé avec succès',
              });
              this.invoices.reload();
            },
          });
      },
      reject: () => {
        this.#messageService.add({
          severity: 'error',
          summary: 'Annulé',
          detail: 'Client non supprimé',
        });
      },
    });
  }
}
