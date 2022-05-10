import { Component, OnInit } from '@angular/core';
import {UserService} from '../../services/user.service';
import {User} from '../../models/user.model';

import { ConfirmationService, MessageService } from 'primeng/api';

import Swal from 'sweetalert2';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { Permission } from 'src/app/models/permission.model';
import { CryptoService } from 'src/app/services/crypto.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  providers: [MessageService, ConfirmationService]
})
export class UserComponent implements OnInit {

  users: User[] = [];
  userNew!: User;
  showDialog: boolean = false;
  isCreate: boolean = true;
  userEmpty: User = { usuarioId: 0, rolId: 3, tipoUsuarioId: 1, estatusUsuarioId: 1, personaFisicaId: 0, usuario: '', iniciales: 'MLC', contrasena: '', puesto: 'USER', area: 'DEMO_MLC', intentos: 0, fechaAlta: new Date(), fechaUltimoAcceso: new Date(), foto: 'Empty' };
  sisModId: string = '';

  canCreate: boolean = false;
  canUpdate: boolean = false;
  canDelete: boolean = false;

  constructor(private userService: UserService, private messageService: MessageService, private confirmationService: ConfirmationService,
    private authService: AuthService, private activatedRoute: ActivatedRoute, private cryptoService: CryptoService) { }

  ngOnInit(): void {
    this.userService.getCustomersAll().subscribe((data:User[])=>{
      data.sort((a, b) => (a.usuario.toUpperCase() > b.usuario.toUpperCase()) ? 1 : -1);
      this.users = data;
    });

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

  }

  getPermissions(data: Permission[]){
    this.canCreate = data.find(element => element.permisoId === 1) ? true : false;
    this.canUpdate = data.find(element => element.permisoId === 2) ? true : false;
    this.canDelete = data.find(element => element.permisoId === 3) ? true : false;
  }

  openNew(form: NgForm) {
    form.resetForm();
    this.userNew = {...this.userEmpty};
    this.showDialog = true;
    this.isCreate = true;
  }

  hideDialog() {
    this.showDialog = false;
  }

  editUser(user: User) {
    this.userNew = { ...user };
    this.showDialog = true;
    this.isCreate = false;
  }

  deleteUser(user: User) {
    this.confirmationService.confirm({
      message: '¿Esta seguro de eliminar a ' + user.usuario + '?',
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Si',
      acceptButtonStyleClass: 'p-button-primary',
      rejectLabel: 'No',
      rejectButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.showLoading();
        this.userService.deleteUsers(user.usuarioId).subscribe((data: User) => {
          this.users = this.users.filter((val: User) => val.usuarioId !== data.usuarioId);
          this.withSuccess('Usuario eliminado');
        }, (err) => {
          this.withError(err, 'Error al elimnar ' + user.usuario);
          console.log(err);
        });
      }
    });
  }

  saveOrUpdateUser() {
    if(!this.userNew.usuario || !this.userNew.contrasena){
      return;
    }

    if (this.userNew.usuario.trim()) {
      if (this.userNew.usuarioId && this.userNew.usuarioId > 0) {
        this.updateUser(this.userNew);
      } else {
        this.createUser(this.userNew);
      }
    }
  }

  private createUser(user: User) {
    this.showLoading();
    this.userService.createUsers(user).subscribe((data: User) => {
      this.users.push(data);
      this.users.sort((a, b) => (a.usuario.toUpperCase() > b.usuario.toUpperCase()) ? 1 : -1);
      this.withSuccess(data.usuario + ' creado');
    },(err) => {
      this.withError(err, 'El usuario ya existe');
      console.log(err);
    });
  }

  private updateUser(user: User) {
    this.showLoading();
    this.userService.updateUsers(user).subscribe((data: User) => {
      this.users[this.findIndexById(data.usuarioId)] = data;
      this.users.sort((a, b) => (a.usuario.toUpperCase() > b.usuario.toUpperCase()) ? 1 : -1);
      this.withSuccess(data.usuario + ' actualizado');
    },(err) => {
      this.withError(err, 'Error al actualizar');
      console.log(err);
    });
  }

  private findIndexById(idUsuario: number): number {
    let index = -1;
    for (let i = 0; i < this.users.length; i++) {
      if (this.users[i].usuarioId === idUsuario) {
        index = i;
        break;
      }
    }
    return index;
  }

  private withSuccess(message: string){
    Swal.close();
    this.showDialog = false;
    this.userNew = {...this.userEmpty};
    this.showMessage('success', 'Exito', message);
  }

  private withError(err: any, msgError: string) {
    this.showDialog = false;
    Swal.close();
    let messageError = '';
    if (err.status && err.status == 400) {
      messageError = msgError;
    } else {
      messageError = 'Error inesperado intente mas tarde';
    }
    this.showMessage('error', 'Error', messageError);
  }

  private showLoading() {
    Swal.fire({
      allowOutsideClick: false,
      icon: 'info',
      text: 'Espere por favor...'
    });
    Swal.showLoading();
  }

  private showMessage(severity: string, summary: string, detail: string) {
    this.messageService.add({ severity: severity, summary: summary, detail: detail, life: 3000 });
  }

}
