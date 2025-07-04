import {
  provideHttpClient,
  withInterceptors
} from '@angular/common/http';
import { ApplicationConfig } from '@angular/core';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { provideToastr } from 'ngx-toastr';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(),
    NgbModule,
    provideAnimations(),
    provideToastr({
      positionClass: 'toast-top-right',
      timeOut: 3000,
      closeButton: true,
      progressBar: true,
      preventDuplicates: true,
    }),
    provideHttpClient(
      withInterceptors([
        (req, next) => {
          const modifiedReq = req.clone({
            withCredentials: true,
            headers: req.headers
              .set('Content-Type', 'application/json')
              .set('Accept', 'application/json'),
          });
          return next(modifiedReq);
        },
      ])
    ),
  ],
};
