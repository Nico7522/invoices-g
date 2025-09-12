import { Routes } from '@angular/router';
import { Auth } from './auth/auth';
import { Home } from './home/home';
import { NotFound } from './shared/ui/not-found/not-found';
import { loginGuard } from './shared/guards/login-guard';

export const routes: Routes = [
  {
    path: '',
    component: Home,
    canActivate: [loginGuard],
    title: 'Acceuil',
  },
  {
    path: 'auth/login',
    component: Auth,
    title: 'Connexion',
  },
  {
    path: 'invoices',
    loadChildren: () => import('./invoice/invoice.routes'),
    canActivate: [loginGuard],
    title: 'Listes des factures',
  },
  {
    path: 'clients',
    loadChildren: () => import('./client/client.routes'),
    canActivate: [loginGuard],
    title: 'Listes des clients',
  },
  {
    path: '**',
    component: NotFound,
  },
];
