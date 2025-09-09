import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import { errorInterceptor } from './shared/interceptors/error-interceptor';
import { MessageService } from 'primeng/api';
import { definePreset } from '@primeuix/themes';
import { provideConfig } from '../config/provide-config';
import { urlInterceptor } from './shared/interceptors/url-interceptor';

// , {
//   components: {
//     datatable: {
//       colorScheme: {
//         dark: {
//           row: {
//             background: '#262626',
//           },
//           headerCell: {
//             background: '#1a1a1a',
//             color: '#4caf50',
//           },
//         },
//       },
//       headerCell: {
//         padding: '1rem',
//         borderColor: '2px solid #4caf50',
//       },
//       columnTitle: {
//         fontWeight: '600',
//       },
//     },
//   },
// })
export const CustomPreset = definePreset(Aura);
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(withFetch(), withInterceptors([urlInterceptor, errorInterceptor])),
    provideConfig(),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: CustomPreset,
        options: {
          darkModeSelector: '.app-dark',
        },
      },
    }),
    MessageService,
  ],
};
