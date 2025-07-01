import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { provideToastr } from 'ngx-toastr';
import { provideAnimations } from '@angular/platform-browser/animations';
import {
  provideHttpClient,
  withInterceptors,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(),
    NgbModule,
    provideAnimations(),
    provideToastr({
      positionClass: 'toast-center-center', // 👈 Show toast in center
      // timeOut: 5000,
      closeButton: true,
      // progressBar: true,
      // preventDuplicates: true,
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
