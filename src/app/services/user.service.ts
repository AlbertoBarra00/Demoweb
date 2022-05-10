import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user.model';
import { environment } from './../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClient) {}

  createUsers(user: User): Observable<User> {
    return this.http.post<User>(`${environment.URL_API}/user/create`, user);
  }

  getCustomersAll(): Observable<User[]> {
    return this.http.get<User[]>(`${environment.URL_API}/user/all`);
  }

  getusersById(idUsuario: number): Observable<User> {
    return this.http.get<User>(`${environment.URL_API}/user/byid/${idUsuario}`);
  }

  updateUsers(user: User): Observable<User> {
    return this.http.put<User>(`${environment.URL_API}/user/update`, user);
  }

  deleteUsers(idUsuario: number): Observable<User> {
    return this.http.delete<User>(`${environment.URL_API}/user/delete/${idUsuario}`);
  }
}
