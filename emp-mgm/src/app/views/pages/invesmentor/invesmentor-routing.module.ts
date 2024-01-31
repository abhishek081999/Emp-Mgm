import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InvesmentorComponent } from './invesmentor.component';
import { AddInvesmentorComponent } from './add-invesmentor/add-invesmentor.component';
import { InvesmentorListComponent } from './invesmentor-list/invesmentor-list.component';
import { InvesmentorRegistrationComponent } from './invesmentor-registration/invesmentor-registration.component';

const routes: Routes = [
  { path: '', component: InvesmentorComponent,
    children:[
      {
        path:'add-invesmentor',
        component: AddInvesmentorComponent
      },
      {
        path:'invesmentor-list',
        component: InvesmentorListComponent
      },
      {
        path: 'edit-invesmentor/:id',
        component: AddInvesmentorComponent
      },
      {
        path: 'invesmentor-registration',
        component: InvesmentorRegistrationComponent
      }
    ]

  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InvesmentorRoutingModule { }
