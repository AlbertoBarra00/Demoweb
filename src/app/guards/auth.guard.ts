import { Injectable } from '@angular/core';
import { Router, CanActivate, CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

import {AuthService} from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild {

  constructor(private router: Router, private authService: AuthService, ){}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      return this.validateSession();
  }

  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      const currentModule = childRoute.routeConfig?.path;
      const currentMod = this.authService.existModule(currentModule ? currentModule : '');
      return currentMod ? this.validateSession() : false;
  }

  private validateSession(): boolean {
    const hasToken = this.authService.userHasSession();
    if(!hasToken){
      this.authService.clearLoginData();
      this.router.navigateByUrl('/login');
    }
    return hasToken;
  }

}
