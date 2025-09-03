export default [
  {
    path: '',
    children: [
      {
        path: '',
        loadComponent: () => import('./invoice-list/invoice-list').then((m) => m.InvoiceList),
      },
      {
        path: 'create',
        loadComponent: () => import('./invoice-create/invoice-create').then((m) => m.InvoiceCreate),
      },
      {
        path: ':id',
        loadComponent: () =>
          import('./invoice-details/invoice-details').then((m) => m.InvoiceDetails),
      },
    ],
  },
];
