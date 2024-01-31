import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MobileAppRoutingModule } from './mobile-app-routing.module';
import { MobileAppComponent } from './mobile-app.component';
import { DevicesComponent } from './devices/devices.component';
import { FormsModule } from '@angular/forms';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppSettingsComponent } from './app-settings/app-settings.component';
import { LoginHistoryComponent } from './login-history/login-history.component';
import { NgSelectModule } from '@ng-select/ng-select';


@NgModule({
  declarations: [MobileAppComponent, DevicesComponent, AppSettingsComponent, LoginHistoryComponent],
  imports: [
    CommonModule,
    MobileAppRoutingModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    FormsModule,
    NgbModule,
    NgSelectModule,
  ]
})
export class MobileAppModule { }
