import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from './../../environments/environment';
import { Observable } from 'rxjs';
import { Customer } from '../models/customer.model';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  constructor(private http: HttpClient) {}

  createCustomers(customer: Customer): Observable<Customer> {
    return this.http.post<Customer>(`${environment.URL_API}/client/create`, customer);
  }

  getCustomersAll(): Observable<Customer[]> {
    return this.http.get<Customer[]>(`${environment.URL_API}/client/all`);
  }

  getCustomersById(idCliente: number): Observable<Customer> {
    return this.http.get<Customer>(`${environment.URL_API}/client/byid/${idCliente}`);
  }

  updateCustomers(customer: Customer): Observable<Customer> {
    return this.http.put<Customer>(`${environment.URL_API}/client/update`, customer);
  }

  deleteCustomers(idCliente: number): Observable<Customer> {
    return this.http.delete<Customer>(`${environment.URL_API}/client/delete/${idCliente}`);
  }
}
