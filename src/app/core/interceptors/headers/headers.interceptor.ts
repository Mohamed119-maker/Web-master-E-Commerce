import { HttpInterceptorFn } from "@angular/common/http";

export const headersInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('userToken');
  console.log('INTERCEPTOR TOKEN:', token);
  if (token) {
    const cloned = req.clone({
      setHeaders: {
        Authorization: `${token}`,
      },
    });
    console.log('FINAL HEADERS:', cloned.headers);
    return next(cloned);
  }
  return next(req);
};