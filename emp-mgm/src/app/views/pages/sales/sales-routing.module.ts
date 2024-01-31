import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddSalesProjectionComponent } from './add-sales-projection/add-sales-projection.component';
import { ConvertionListComponent } from './convertion-list/convertion-list.component';
import { CouponsComponent } from './coupons/coupons.component';
import { IndividualSalesProjectionComponent } from './individual-sales-projection/individual-sales-projection.component';
import { IndividualSalesReportComponent } from './individual-sales-report/individual-sales-report.component';
import { PendingPaymentListComponent } from './pending-payment-list/pending-payment-list.component';
import { SalesProjectionComponent } from './sales-projection/sales-projection.component';
import { SalesComponent } from './sales.component';
import { TeamMemberSalesReportComponent } from './team-member-sales-report/team-member-sales-report.component';
import { TeamsSalesReportComponent } from './teams-sales-report/teams-sales-report.component';

const routes: Routes = [
  {
    path: '',
    component: SalesComponent,
    children: [
      {
        path: 'coupons',
        component: CouponsComponent
      },
      {
        path: 'convertion-list',
        component: ConvertionListComponent
      },
      {
        path: 'sales-report',
        component: IndividualSalesReportComponent
      },
      {
        path: 'team-sales-report',
        component: TeamsSalesReportComponent
      },
      {
        path: 'team-members-sales-report',
        component: TeamMemberSalesReportComponent
      },
      {
        path: 'pending-payments',
        component: PendingPaymentListComponent
      },
      {
        path: 'sales-projection-report',
        component: SalesProjectionComponent
      },
      {
        path: 'sales-projection',
        component: AddSalesProjectionComponent
      },
      {
        path: 'individual-sales-projection-report',
        component: IndividualSalesProjectionComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SalesRoutingModule { }
