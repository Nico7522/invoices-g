import { Component, DestroyRef, inject } from '@angular/core';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { RouterModule } from '@angular/router';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ConfirmationService, MessageService } from 'primeng/api';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { GetClientService } from '../../shared/services/client/get-client-service';
import { ClientService } from '../services/client-service';
@Component({
  selector: 'app-client-list',
  imports: [TableModule, ButtonModule, RouterModule, ConfirmPopupModule],
  templateUrl: './client-list.html',
  styleUrl: './client-list.scss',
  providers: [ConfirmationService],
})
export class ClientList {
  readonly #clientService = inject(ClientService);
  readonly #getClientService = inject(GetClientService);
  readonly #confirmationService = inject(ConfirmationService);
  readonly #messageService = inject(MessageService);
  readonly #destroyRef = inject(DestroyRef);
  clients = this.#getClientService.clients;

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
        this.#clientService
          .deleteClient(id)
          .pipe(takeUntilDestroyed(this.#destroyRef))
          .subscribe({
            next: () => {
              this.#messageService.add({
                severity: 'success',
                summary: 'Supprimé',
                detail: 'Client supprimé avec succès',
              });
            },
          });
        this.clients.reload();
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
