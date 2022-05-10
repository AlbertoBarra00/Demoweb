import { Component, OnInit } from '@angular/core';
import { Insurance } from 'src/app/models/insurance.model';
import { Customer } from 'src/app/models/customer.model';
import { InsuranceService } from 'src/app/services/insurance.service';

import {formatDate} from '@angular/common';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { Permission } from 'src/app/models/permission.model';
import { CryptoService } from 'src/app/services/crypto.service';

@Component({
  selector: 'app-insurance',
  templateUrl: './insurance.component.html',
  providers: [MessageService]
})
export class InsuranceComponent implements OnInit {

insurances: Insurance[] = [];
columNames: any[] = [];

  constructor(private insuranceService: InsuranceService, private messageService: MessageService,
    private authService: AuthService, private activatedRoute: ActivatedRoute, private cryptoService: CryptoService) { }

  ngOnInit(): void {
    this.columNames = [
      { field: 'cliente', header: 'Cliente', class: '', classParent: '' },
      { field: 'poliza', header: 'Poliza', class: '', classParent: '' },
      { field: 'noAutorizacion', header: 'No. autorizacion', class: 'p-d-none p-d-md-inline-flex', classParent: 'resizeColDown' },
      { field: 'fecha', header: 'Fecha', class: 'p-d-none p-d-md-inline-flex', classParent: 'resizeColDown' },
      { field: 'formaPago', header: 'Forma de pago', class: 'p-d-none p-d-md-inline-flex', classParent: 'resizeColDown' },
      { field: 'periodoPago', header: 'Periodo de pago', class: 'p-d-none p-d-md-inline-flex', classParent: 'resizeColDown' }
    ];

    const mod = this.activatedRoute.routeConfig?.path;
    const listPermissions = this.authService.existPermission(mod ? mod : '');
    if(listPermissions){
      this.getPermissions(listPermissions);
    } else {
      const currentModule = this.authService.existModule(mod ? mod : '');
      const sisModId = currentModule?.sisModId ? currentModule?.sisModId : 0;
      const currentUser = this.authService.currentUser();

      this.authService.getPermission(sisModId, currentUser).subscribe((data: Permission[])=>{
        const cryptPermissions = this.cryptoService.encrypt(JSON.stringify(data));
        localStorage.setItem(mod+'Pers', cryptPermissions);
        this.getPermissions(data);
      },(err)=>{
        console.log(err);
      });
    }

    this.getCustomersAll();
  }

  getPermissions(data: Permission[]){
    console.log('TODO: implementar permisos');
  }

  getCustomersAll() {
    this.insuranceService.getCustomersAll().subscribe((data: Customer[])=>{
      let idx: number = 0;
      let today: Date = new Date();
      data = data.sort((a, b) => (a.nombre.toUpperCase() > b.nombre.toUpperCase()) ? 1 : -1);
      let insurancesTemp: Insurance[] = [];
      data.forEach((customer: Customer) => {
        idx++;
        let rand: number = Math.floor(Math.random() * 10) + 1;
        let insurance: Insurance =  {
          cliente: customer.nombre,
          poliza: 'POL' + today.getFullYear() + '0000' + idx,
          noAutorizacion: idx.toString(),
          fecha: formatDate(today, 'dd/MM/yyyy', 'en-US'),
          formaPago: ((rand % 2) == 0) ? 'Efectivo' : 'TDC',
          periodoPago: ((rand % 2) == 0) ? 'Trimestral' : 'Mensual'
        }
        insurancesTemp.push(insurance);
      });
      this.insurances = insurancesTemp;

    },(err) => {
      console.log(err);
      this.withError(err, 'Error consultar las polizas');
    });
  }

  private withError(err: any, msgError: string) {
    let messageError = '';
    if (err.status && err.status == 400) {
      messageError = msgError;
    } else {
      messageError = 'Error inesperado intente mas tarde';
    }
    this.showMessage('error', 'Error', messageError);
  }

  private showMessage(severity: string, summary: string, detail: string) {
    this.messageService.add({ severity: severity, summary: summary, detail: detail, life: 3000 });
  }

}
