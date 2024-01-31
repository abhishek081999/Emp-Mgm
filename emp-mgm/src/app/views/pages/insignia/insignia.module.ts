import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InsigniaRoutingModule } from './insignia-routing.module';
import { AddInsigniaComponent } from './add-insignia/add-insignia.component';
import { InsigniaComponent } from './insignia.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { NgbModalModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FeahterIconModule } from 'src/app/core/feather-icon/feather-icon.module';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { FullCalendarModule } from '@fullcalendar/angular';
import { ClipboardModule } from 'ngx-clipboard';
import { InsigniaListComponent } from './insignia-list/insignia-list.component';
import { InsigniaRegistrationComponent } from './insignia-registration/insignia-registration.component';


@NgModule({
  declarations: [
    InsigniaComponent,
    AddInsigniaComponent,
    InsigniaListComponent,
    InsigniaRegistrationComponent,
  ],
  imports: [
    CommonModule,
    InsigniaRoutingModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    NgbModule,
    FeahterIconModule,
    FormsModule,
    NgSelectModule,
    FullCalendarModule,
    ClipboardModule,
    NgbModalModule
  ]
})
export class InsigniaModule { }
