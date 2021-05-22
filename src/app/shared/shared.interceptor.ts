import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
// tslint:disable-next-line:import-blacklist
import { Observable } from 'rxjs';
@Injectable()
export class Interceptor implements HttpInterceptor {
  user: any;
  constructor() { }
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // tslint:disable-next-line:prefer-const
    let q;
    // q = request.headers.set("Content-Type", "application/json");
    if (localStorage.getItem('authToken') !== null) {
    q = request.headers.set('Authorization', 'Bearer ' + localStorage.getItem('authToken'));
    }
    const authReq = request.clone({
      headers: q
    });
    return next.handle(authReq);
  }
}
