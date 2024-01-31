import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportsRoutingModule } from './reports-routing.module';
import { ReportsComponent } from './reports.component';
import { InsigniaReportJComponent } from './insignia-report-j/insignia-report-j.component';
import { BcmbReportAComponent } from './bcmb-report-a/bcmb-report-a.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { FormsModule } from '@angular/forms';
import { InsigniaReportAComponent } from './insignia-report-a/insignia-report-a.component';
import { InsigniaReportBComponent } from './insignia-report-b/insignia-report-b.component';
import { InsigniaReportCComponent } from './insignia-report-c/insignia-report-c.component';
import { InsigniaReportDComponent } from './insignia-report-d/insignia-report-d.component';
import { InsigniaReportEComponent } from './insignia-report-e/insignia-report-e.component';
import { InsigniaReportFComponent } from './insignia-report-f/insignia-report-f.component';
import { InsigniaReportGComponent } from './insignia-report-g/insignia-report-g.component';
import { InsigniaReportHComponent } from './insignia-report-h/insignia-report-h.component';
import { InsigniaReportIComponent } from './insignia-report-i/insignia-report-i.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { IVRReportComponent } from './ivr-report/ivr-report.component';
import { AppReportAComponent } from './app-report-a/app-report-a.component';
import { IvrReportAComponent } from './ivr-report-a/ivr-report-a.component';
import { IvrReportBComponent } from './ivr-report-b/ivr-report-b.component';
import { FeahterIconModule } from 'src/app/core/feather-icon/feather-icon.module';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    ReportsComponent,
    InsigniaReportJComponent,
    InsigniaReportAComponent,
    InsigniaReportCComponent,
    InsigniaReportBComponent,
    InsigniaReportDComponent,
    InsigniaReportEComponent,
    InsigniaReportFComponent,
    InsigniaReportGComponent,
    InsigniaReportHComponent,
    InsigniaReportIComponent,
    BcmbReportAComponent,
    IVRReportComponent,
    AppReportAComponent,
    IvrReportAComponent,
    IvrReportBComponent],
  imports: [
    CommonModule,
    ReportsRoutingModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    FormsModule,
    NgSelectModule,
    FeahterIconModule,
    NgbTooltipModule
  ]
})
export class ReportsModule { }
