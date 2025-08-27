import { Routes } from '@angular/router';
import { Auth } from './auth/auth';
import { Home } from './home/home';
import { loginGuard } from './shared/guards/login-guard';
import { redirectGuard } from './shared/guards/redirect-guard';

export const routes: Routes = [
  {
    path: '',
    component: Home,
    canActivate: [loginGuard],
  },
  {
    path: 'auth/login',
    component: Auth,
    canActivate: [redirectGuard],
  },
  {
    path: 'invoices',
    loadChildren: () => import('./invoice/invoice.routes'),
    canActivate: [loginGuard],
  },
  {
    path: 'clients',
    loadChildren: () => import('./client/client.routes'),
    canActivate: [loginGuard],
  },
];
