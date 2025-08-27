import { Component, inject, signal } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Menubar } from 'primeng/menubar';
import { AuthService } from '../../../auth/services/auth-service';
import { Button } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { TokenService } from '../../services/token/token-service';

@Component({
  selector: 'app-header',
  imports: [Menubar, Button, CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  readonly #authService = inject(AuthService);
  readonly #tokenService = inject(TokenService);
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

  isLoggedIn = this.#tokenService.isLoggedIn;

  logout() {
    this.#authService.logout();
  }
}
