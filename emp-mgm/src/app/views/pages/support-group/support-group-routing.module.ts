import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SupportGroupComponent } from './support-group.component';
import { CreateGroupComponent } from './create-group/create-group.component';

const routes: Routes = [
  {
    path: '',
    component:SupportGroupComponent,
    children:[
      {
        path:"create-group",
        component:CreateGroupComponent
      }
    ] 
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SupportGroupRoutingModule { }
