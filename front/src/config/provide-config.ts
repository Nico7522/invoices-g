import { InjectionToken, makeEnvironmentProviders, provideAppInitializer } from '@angular/core';

interface CustomConfig {
  production: boolean;
  apiUrl: string;
}

export const CONFIG = new InjectionToken<CustomConfig>('CONFIG');

export function provideConfig() {
  let config: CustomConfig;

  return makeEnvironmentProviders([
    provideAppInitializer(async () => {
      config = await fetch('assets/config.json')
        .then((res) => {
          return res.json();
        })
        .catch((err) => console.log(err));
    }),
    { provide: CONFIG, useFactory: () => config },
  ]);
}
