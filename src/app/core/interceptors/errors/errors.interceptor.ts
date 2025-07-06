import { HttpInterceptorFn } from '@angular/common/http';

export const errorsInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req);
};
