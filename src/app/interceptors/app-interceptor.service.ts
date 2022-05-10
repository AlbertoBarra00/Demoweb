import { HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppInterceptorService implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    let reqClone:any;

    if (!req.url.endsWith('api/auth/login')) {
      const token = localStorage.getItem('idToken');
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });

      reqClone = req.clone({ headers });
    } else {
      reqClone = req.clone();
    }
    return next.handle(reqClone);
  }
}
