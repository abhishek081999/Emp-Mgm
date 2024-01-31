import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddInsigniaComponent } from './add-insignia/add-insignia.component';
import { InsigniaListComponent } from './insignia-list/insignia-list.component';
import { InsigniaRegistrationComponent } from './insignia-registration/insignia-registration.component';
import { InsigniaComponent } from './insignia.component';

const routes: Routes = [
  {
    path:'',
    component: InsigniaComponent,
    children:[
      {
        path: 'add-insignia',
        component: AddInsigniaComponent
      },
      {
        path: 'insignia-list',
        component: InsigniaListComponent
      },
      {
        path: 'edit-insignia/:id',
        component: AddInsigniaComponent
      },
      {
        path: 'insignia-registrations',
        component: InsigniaRegistrationComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InsigniaRoutingModule { }
