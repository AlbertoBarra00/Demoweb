import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [MessageService]
})
export class LoginComponent implements OnInit {

  user!: User;

  constructor(private router: Router, private authService: AuthService, private messageService: MessageService) { }

  ngOnInit(): void {
    this.user = { usuarioId: 0, rolId: 0, tipoUsuarioId: 0, estatusUsuarioId: 0, personaFisicaId: 0, usuario: '', iniciales: '', contrasena: '', puesto: '', area: '', intentos: 0, fechaAlta: new Date(), fechaUltimoAcceso: new Date(), foto: '' };
    this.authService.clearLoginData();
  }

  loginIn(form: NgForm) {
    if (form.invalid) {
      return;
    }

    this.showLoading();
    this.authService.getValidateLogin(this.user).subscribe(
      (data) => {
        Swal.close();
        this.router.navigateByUrl('/main');
      }, (err) => {
        console.log(err);
        //setTimeout(()=>{
        this.withError(err, 'Usuario o contraseña no validos');
        //}, 3000);
      });
  }

  private withError(err: any, msgError: string) {
    Swal.close();
    let messageError = '';
    if (err.status && err.status == 401) {
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
