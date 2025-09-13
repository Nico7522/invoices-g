import {
  InjectionToken,
  isDevMode,
  makeEnvironmentProviders,
  provideAppInitializer,
} from '@angular/core';

interface CustomConfig {
  production: boolean;
  apiUrl: string;
}

export const CONFIG = new InjectionToken<CustomConfig>('CONFIG');

export function provideConfig() {
  let config: CustomConfig;

  return makeEnvironmentProviders([
    provideAppInitializer(async () => {
      let url = isDevMode() ? 'assets/config-dev.json' : '/assets/config-prod.json';
      config = await fetch(url)
        .then((res) => {
          return res.json();
        })
        .catch((err) => console.log(err));
    }),
    { provide: CONFIG, useFactory: () => config },
  ]);
}
