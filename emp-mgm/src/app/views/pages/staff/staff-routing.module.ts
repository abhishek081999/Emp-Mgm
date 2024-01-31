import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RoleManagementComponent } from './role-management/role-management.component';
import { StaffComponent } from './staff.component';

const routes: Routes = [
  {
    path: '',
    component: StaffComponent,
    children: [
      {
        path: 'role-management',
        component: RoleManagementComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StaffRoutingModule { }
