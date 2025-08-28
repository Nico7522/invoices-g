import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { UserService } from '../services/user/user-service';
import { map } from 'rxjs';

export const redirectGuard: CanActivateFn = (route, state) => {
  const userService = inject(UserService);
  const router = inject(Router);
  return userService.getUser().pipe(
    map((user) => {
      if (user) {
        return true;
      } else {
        return true;
      }
    })
  );
};
