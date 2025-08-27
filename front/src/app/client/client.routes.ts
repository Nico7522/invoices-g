export default [
  {
    path: '',
    children: [
      {
        path: '',
        loadComponent: () => import('./client-list/client-list').then((m) => m.ClientList),
      },
      {
        path: ':id',
        loadComponent: () => import('./client-details/client-details').then((m) => m.ClientDetails),
      },
    ],
  },
];
