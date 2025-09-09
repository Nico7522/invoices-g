import { HttpInterceptorFn } from '@angular/common/http';
import { CONFIG } from '../../../config/provide-config';
import { inject } from '@angular/core';

export const urlInterceptor: HttpInterceptorFn = (req, next) => {
  const config = inject(CONFIG);
  let newReq = req.clone({
    url: `${config.apiUrl}${req.url}`,
    credentials: 'include',
  });

  return next(newReq);
};
