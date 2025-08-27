import { CanActivateFn, Router } from '@angular/router';
import { TokenService } from '../services/token/token-service';
import { inject } from '@angular/core';

export const redirectGuard: CanActivateFn = (route, state) => {
  const tokenService = inject(TokenService);
  const router = inject(Router);
  return tokenService.isLoggedIn() ? router.navigate(['/']) : true;
};
