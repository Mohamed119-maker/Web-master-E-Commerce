import { isPlatformBrowser } from '@angular/common';
import { HttpInterceptorFn } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';

export const headersInterceptor: HttpInterceptorFn = (req, next) => {
  const pLATFORM_ID = inject(PLATFORM_ID)
  if (isPlatformBrowser(pLATFORM_ID)) {
    if (localStorage.getItem('userToken')) {
      req = req.clone({
        setHeaders: {
          userToken: localStorage.getItem('userToken')!
        }
      })
    }

  }

  return next(req);
};
