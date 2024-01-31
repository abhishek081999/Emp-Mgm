import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppSettingsComponent } from './app-settings/app-settings.component';
import { DevicesComponent } from './devices/devices.component';
import { LoginHistoryComponent } from './login-history/login-history.component';
import { MobileAppComponent } from './mobile-app.component';

const routes: Routes = [
  {
    path: '',
    component: MobileAppComponent,
    children: [
      {
        path: 'devices',
        component: DevicesComponent
      },
      {
        path: 'devices/:id',
        component: DevicesComponent
      },
      {
        path: 'app-settings',
        component: AppSettingsComponent
      },
      {
        path: 'login-history',
        component: LoginHistoryComponent
      },
      {
        path: 'login-history/:id',
        component: LoginHistoryComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MobileAppRoutingModule { }
