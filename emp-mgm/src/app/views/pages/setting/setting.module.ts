import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingRoutingModule } from './setting-routing.module';
import { SettingComponent } from './setting.component';
import { BusinessHourComponent } from './business-hour/business-hour.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { SupportSlaPolicyComponent } from './support-sla-policy/support-sla-policy.component';
import { SupportSlaComponent } from './support-sla/support-sla.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';



@NgModule({
  declarations: [
    SettingComponent,
    BusinessHourComponent,
    SupportSlaPolicyComponent,
    SupportSlaComponent,
  
    
  ],
  imports: [
    CommonModule,
    SettingRoutingModule,
    ReactiveFormsModule,
    NgSelectModule,
    FormsModule, 
    MatSnackBarModule
    
  ]
})
export class SettingModule { }
