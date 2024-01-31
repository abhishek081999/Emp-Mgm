import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { Routes, RouterModule } from '@angular/router';
import { AuthComponent } from './auth.component';
import { FormsModule } from '@angular/forms';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';

const routes: Routes = [
  {
    path: '',
    component: AuthComponent,
    children: [
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
      },
      {
        path: 'login',
        component: LoginComponent
      },
     /* {
        path: 'register',
        component: RegisterComponent
      },*/
      {
        path: 'forget-password',
        component: ForgetPasswordComponent
      }
    ]
  },
]

@NgModule({
  declarations: [LoginComponent, RegisterComponent, AuthComponent, ForgetPasswordComponent],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    NgbAlertModule
  ]
})
export class AuthModule { }
