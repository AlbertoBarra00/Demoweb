import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { LoginResponse } from '../models/loginresponse.model';
import { environment } from './../../environments/environment';

import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Module } from '../models/module.model';
import { Permission } from '../models/permission.model';
import { CryptoService } from './crypto.service';
import { JwtHelperService } from "@auth0/angular-jwt";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private cryptoService: CryptoService) { }

  getValidateLogin(user: User): Observable<LoginResponse> {
    return this.userLogin(user).pipe(
      map(resp => {
      this.saveLoginData(resp);
      return resp;
    })/*,
    catchError(err =>{
      return throwError(err);
    })*/
  );
  }

  userLogin(user: User): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${environment.URL_API}/auth/login`, {username: user.usuario, password: user.contrasena});
  }

  getModules(idUsuario: number): Observable<Module[]> {
    return this.http.get<Module[]>(`${environment.URL_API}/auth/modules/${environment.SISMODPADREID}/${idUsuario}`);
  }

  getPermission(idSistema: number, idUsuario: number): Observable<Permission[]> {
    return this.http.get<Permission[]>(`${environment.URL_API}/auth/permission/${idSistema}/${idUsuario}`);
  }

  private saveLoginData(loginResponse: LoginResponse) {
    localStorage.setItem('idToken', loginResponse.idToken ?.toString());
  }

  getLoginData(item: string): string | null {
    return localStorage.getItem(item);
  }

  hasLoginDataItem(item: string): boolean {
    return (!this.getLoginData(item)) ? false : true;
  }

  userHasSession(): boolean {
    const helper = new JwtHelperService();
    const idToken = localStorage.getItem('idToken');
    return !helper.isTokenExpired(idToken?.toString());
  }

  existModule(mod: string): Module | undefined {
    const cryptModules = localStorage.getItem('sisMods');
    if(cryptModules){
      const stringModules = this.cryptoService.decrypt(cryptModules? cryptModules : '');
      const listModules: Module[] = JSON.parse(stringModules);
      return listModules.find(element => element.url === mod);
    } else if(mod === 'home'){
      return {sisModId:0, nombre:'Inicio', url: 'home', imagen: 'pi pi-fw pi-home'};
    }
    return undefined;
  }

  existPermission(mod: string): Permission[] | undefined {
    const cryptPermissions = localStorage.getItem(mod+'Pers');
    if(cryptPermissions){
      const stringPermissions = this.cryptoService.decrypt(cryptPermissions? cryptPermissions : '');
      return JSON.parse(stringPermissions);
    }
    return undefined;
  }

  currentUser(): number{
    const helper = new JwtHelperService();
    const idToken = localStorage.getItem('idToken');
    const decodeToken = helper.decodeToken(idToken?.toString());
    return Number(decodeToken.iss);
  }

  clearLoginData() {
    localStorage.clear();
  }
}
