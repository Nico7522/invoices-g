import { Routes } from '@angular/router';
import { Auth } from './auth/auth';
import { Home } from './home/home';
import { loginGuard } from './shared/guards/login-guard';

export const routes: Routes = [
  {
    path: '',
    component: Home,
    canActivate: [loginGuard],
  },
  {
    path: 'auth/login',
    component: Auth,
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
