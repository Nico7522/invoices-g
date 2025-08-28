import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { MessageService } from 'primeng/api';
import { catchError, EMPTY, of, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const messageService = inject(MessageService);
  return next(req).pipe(
    catchError((err) => {
      switch (err.status) {
        case 400:
          messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: 'Requête invalide',
          });
          break;
        case 401:
          messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: 'Non autorisé',
          });
          break;
        default:
          messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: 'Une erreur est survenue',
          });
          break;
      }
      return EMPTY;
    })
  );
};
