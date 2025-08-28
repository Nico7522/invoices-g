import { Component, inject, signal } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Menubar } from 'primeng/menubar';
import { AuthService } from '../../../auth/services/auth-service';
import { Button } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user/user-service';
import { take, tap } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [Menubar, Button, CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  readonly #authService = inject(AuthService);
  readonly #userService = inject(UserService);
  readonly #router = inject(Router);
  items = signal<MenuItem[]>([
    {
      label: 'Accueil',
      icon: 'pi pi-home',
      routerLink: '/',
    },
    {
      label: 'Clients',
      icon: 'pi pi-users',
      routerLink: '/clients',
    },

    {
      label: 'Factures',
      icon: 'pi pi-receipt',
      routerLink: '/invoices',
    },
  ]);

  isLoggedIn = this.#userService.userInfo;

  logout() {
    this.#authService
      .logout()
      .pipe(
        take(1),
        tap(() => {
          this.#router.navigate(['/auth/login']);
        })
      )
      .subscribe();
  }
}
