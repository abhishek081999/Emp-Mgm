import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InvesmentorRoutingModule } from './invesmentor-routing.module';
import { InvesmentorComponent } from './invesmentor.component';
import { AddInvesmentorComponent } from './add-invesmentor/add-invesmentor.component';
import { InvesmentorListComponent } from './invesmentor-list/invesmentor-list.component';
import { NgbModalModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { FeahterIconModule } from 'src/app/core/feather-icon/feather-icon.module';
import { InvesmentorRegistrationComponent } from './invesmentor-registration/invesmentor-registration.component';


@NgModule({
  declarations: [InvesmentorComponent, AddInvesmentorComponent, InvesmentorListComponent, InvesmentorRegistrationComponent],
  imports: [
    CommonModule,
    InvesmentorRoutingModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    NgbModule,
    FeahterIconModule,
    FormsModule,
    NgSelectModule,
    NgbModalModule
  ]
})
export class InvesmentorModule { }
