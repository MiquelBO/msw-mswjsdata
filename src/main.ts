import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { worker } from './mocks/browser';

if (environment.production) {
  enableProdMode();
}

if (!environment.production) {
  worker.start();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
