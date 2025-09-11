import { HttpErrorResponse, HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { catchError, throwError, tap } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const messageService = inject(MessageService);
  const router = inject(Router);
  return next(req).pipe(
    tap({
      error: (err: HttpErrorResponse) => {
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
          case 404:
            messageService.add({
              severity: 'error',
              summary: 'Erreur',
              detail: 'Non trouvé',
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
        if (err.status === 401) {
          router.navigate(['/auth/login']);
        }
      },
    }),
    catchError((err) => {
      return throwError(() => err);
    })
  );
};
