import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { Module } from 'src/app/models/module.model';

import { AuthService } from 'src/app/services/auth.service';
import { CryptoService } from 'src/app/services/crypto.service';

@Component({
  selector: 'app-menubar',
  templateUrl: './menubar.component.html',
  styleUrls: ['./menubar.component.css']
})
export class MenubarComponent implements OnInit {

  items: MenuItem[] = [];
  constructor(private router: Router, private authService: AuthService, private cryptoService: CryptoService, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.loadMenuItems();
  }

  loadMenuItems(){
    let itemsTemp: MenuItem[] = [];
    const currentUser = this.authService.currentUser();
    this.authService.getModules(currentUser).subscribe((data : Module[]) => {
      let localMod: Module = {sisModId:0, nombre:'Inicio', url: 'home', imagen: 'pi pi-fw pi-home'};
      data.splice(0, 0, localMod);

      data.forEach((mod: Module) => {
          itemsTemp.push(
            {
              id: '' + mod.sisModId,
              label: mod.nombre,
              icon: mod.imagen,
              command: ()=>{
                this.router.navigate([mod.url], {relativeTo: this.activatedRoute});
              }
            }
          );
      });
      this.items = itemsTemp;

      const cryptModules = this.cryptoService.encrypt(JSON.stringify(data));
      localStorage.setItem('sisMods', cryptModules);
    }, (err) => {
      console.log(err);
    });
  }

  logOff(){
    this.authService.clearLoginData();
    this.router.navigateByUrl('/login');
  }

}
