export default [
  {
    path: '',
    children: [
      {
        path: '',
        loadComponent: () => import('./client-list/client-list').then((m) => m.ClientList),
      },
      {
        path: 'create',
        loadComponent: () => import('./client-create/client-create').then((m) => m.ClientCreate),
        title: 'Créer un client',
      },
      {
        path: ':id',
        loadComponent: () => import('./client-details/client-details').then((m) => m.ClientDetails),
      },
      {
        path: ':id/edit',
        loadComponent: () => import('./client-edit/client-edit').then((m) => m.ClientEdit),
      },
    ],
  },
];
