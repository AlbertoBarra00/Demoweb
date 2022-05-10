import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Customer } from '../models/customer.model';
import { CustomerService } from './customer.service';

@Injectable({
  providedIn: 'root'
})
export class InsuranceService {

  constructor(private customerService: CustomerService) { }

  getCustomersAll(): Observable<Customer[]> {
    return this.customerService.getCustomersAll();
  }
}
