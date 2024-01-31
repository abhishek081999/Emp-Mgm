import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SalesRoutingModule } from './sales-routing.module';
import { SalesComponent } from './sales.component';
import { CouponsComponent } from './coupons/coupons.component';
import { ConvertionListComponent } from './convertion-list/convertion-list.component';
import { IndividualSalesReportComponent } from './individual-sales-report/individual-sales-report.component';
import { TeamsSalesReportComponent } from './teams-sales-report/teams-sales-report.component';
import { TeamMemberSalesReportComponent } from './team-member-sales-report/team-member-sales-report.component';
import { NgbAlertModule, NgbDropdownModule, NgbModalModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { FeahterIconModule } from 'src/app/core/feather-icon/feather-icon.module';
import { ClipboardModule } from 'ngx-clipboard';
import { PendingPaymentListComponent } from './pending-payment-list/pending-payment-list.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SalesProjectionComponent } from './sales-projection/sales-projection.component';
import { AddSalesProjectionComponent } from './add-sales-projection/add-sales-projection.component';
import { IndividualSalesProjectionComponent } from './individual-sales-projection/individual-sales-projection.component';


@NgModule({
  declarations: [SalesComponent, CouponsComponent, ConvertionListComponent, IndividualSalesReportComponent, TeamsSalesReportComponent, TeamMemberSalesReportComponent, PendingPaymentListComponent, SalesProjectionComponent, AddSalesProjectionComponent, IndividualSalesProjectionComponent],
  imports: [
    CommonModule,
    SalesRoutingModule,
    NgbTooltipModule,
    NgSelectModule,
    NgbAlertModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    NgbDropdownModule,
    FeahterIconModule,
    ClipboardModule,
    NgbModalModule,
    MatCheckboxModule
  ]
})
export class SalesModule { }