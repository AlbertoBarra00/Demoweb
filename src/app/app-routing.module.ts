import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';

import { AuthGuard } from './guards/auth.guard';
import { CustomerComponent } from './components/customer/customer.component';
import { InsuranceComponent } from './components/insurance/insurance.component';
import { UserComponent } from './components/user/user.component';
import { MenubarComponent } from './components/menubar/menubar.component';


const APP_ROUTES: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'main', component: MenubarComponent, children: [
      { path: 'home', component: HomeComponent },
      { path: 'customer', component: CustomerComponent },
      { path: 'insurance', component: InsuranceComponent },
      { path: 'user', component: UserComponent },
      { path: '**', pathMatch: 'full', redirectTo: 'home' }
    ], canActivate: [AuthGuard], canActivateChild: [AuthGuard]
  },
  { path: '**', pathMatch: 'full', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(APP_ROUTES, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
