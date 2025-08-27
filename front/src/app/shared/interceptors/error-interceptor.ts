import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { MessageService } from 'primeng/api';
import { catchError, EMPTY, of } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const messageService = inject(MessageService);
  return next(req).pipe(
    catchError((err) => {
      switch (err.status) {
        case 401:
          messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: 'Identifiants invalides',
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
