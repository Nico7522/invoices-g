export default [
  {
    path: '',
    children: [
      {
        path: '',
        loadComponent: () => import('./invoice-list/invoice-list').then((m) => m.InvoiceList),
      },
      {
        path: ':id',
        loadComponent: () =>
          import('./invoice-details/invoice-details').then((m) => m.InvoiceDetails),
      },
    ],
  },
];
