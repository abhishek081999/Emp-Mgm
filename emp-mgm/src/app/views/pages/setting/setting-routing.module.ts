import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SettingComponent } from './setting.component';
import { BusinessHourComponent } from './business-hour/business-hour.component';
import { SupportSlaPolicyComponent } from './support-sla-policy/support-sla-policy.component';
import { SupportSlaComponent } from './support-sla/support-sla.component';


const routes: Routes = [
  {
    path: '',
    component: SettingComponent,
    children: [
      {
        path: "business-hour",
        component: BusinessHourComponent
      },
      {
        path:"support-sla-policy",
        component:SupportSlaPolicyComponent
      },
      { path: 'support-sla', component: SupportSlaComponent },
      { path: 'support-sla/:id', component: SupportSlaComponent },
    ]
  },
 
 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingRoutingModule { }
