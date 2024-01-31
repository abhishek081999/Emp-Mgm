import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReferralRoutingModule } from './referral-routing.module';
import { ReferralDetailsComponent } from './referral-details/referral-details.component';
import { ReferralComponent } from './referral.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { NgbModalModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FeahterIconModule } from 'src/app/core/feather-icon/feather-icon.module';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { FullCalendarModule } from '@fullcalendar/angular';
import { ClipboardModule } from 'ngx-clipboard';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { NgApexchartsModule } from 'ng-apexcharts';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatExpansionModule } from '@angular/material/expansion';
import { ReferralTransactionComponent } from './referral-transaction/referral-transaction.component';
import { ReferalSettingsComponent } from './referal-settings/referal-settings.component';

@NgModule({
  declarations: [
    ReferralComponent,
    ReferralDetailsComponent,
    ReferralTransactionComponent,
    ReferalSettingsComponent,

  ],
  imports: [
    CommonModule,
    ReferralRoutingModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    NgbModule,
    FeahterIconModule,
    FormsModule,
    NgSelectModule,
    ClipboardModule,
    NgbModalModule,
    MatCheckboxModule,
  ]
})
export class ReferralModule { }
