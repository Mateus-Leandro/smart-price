import { ApplicationConfig, LOCALE_ID, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { MatPaginatorIntlPtBr } from './shared/helpers/mat-paginator-intl-pt-br';
import { provideNgxMask } from 'ngx-mask';
import localePt from '@angular/common/locales/pt';
import { DatePipe, registerLocaleData } from '@angular/common';

registerLocaleData(localePt);

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideNgxMask(),
    { provide: MatPaginatorIntl, useClass: MatPaginatorIntlPtBr },
    { provide: LOCALE_ID, useValue: 'pt-BR' },
    DatePipe,
  ],
};
