import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { MatPaginatorIntlPtBr } from './shared/helpers/mat-paginator-intl-pt-br';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    { provide: MatPaginatorIntl, useClass: MatPaginatorIntlPtBr },
  ],
};
