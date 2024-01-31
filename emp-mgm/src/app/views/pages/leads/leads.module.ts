import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LeadsRoutingModule } from './leads-routing.module';
import { LeadsComponent } from './leads.component';
import { FormsModule } from '@angular/forms';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LeadManagementComponent } from './lead-management/lead-management.component';
import { ImportXlsxLeadComponent } from './import-xlsx-lead/import-xlsx-lead.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { NgSelectModule } from '@ng-select/ng-select';
import { LeadDisplayBaseComponent } from './lead-display-base/lead-display-base.component';
import { LeadDisplayComponent } from './lead-display/lead-display.component';
import { SelectServiceComponent } from './select-service/select-service.component';
import { SelectPriceComponent } from './select-price/select-price.component';
import { LeadStagesComponent } from './lead-stages/lead-stages.component';
import { CallbackListComponent } from './callback-list/callback-list.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { OnboardingListComponent } from './onboarding-list/onboarding-list.component';
import { FeahterIconModule } from 'src/app/core/feather-icon/feather-icon.module';
import { LeadHistoryComponent } from './lead-history/lead-history.component';
import { LeadAudienceReportComponent } from './lead-audience-report/lead-audience-report.component';
import { TeamMemLeadReportComponent } from './team-mem-lead-report/team-mem-lead-report.component';
import { TeamLeadReportComponent } from './team-lead-report/team-lead-report.component';
import { IndividualLeadReportComponent } from './individual-lead-report/individual-lead-report.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { LeadChangeLogComponent } from './lead-change-log/lead-change-log.component';
import { CampaignLeadsReportComponent } from './campaign-leads-report/campaign-leads-report.component';
import { DailyLeadReportComponent } from './daily-lead-report/daily-lead-report.component';
import { LeadSettingsComponent } from './lead-settings/lead-settings.component';
import { OnboardingReportComponent } from './onboarding-report/onboarding-report.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { CampaignLeadsEcReportComponent } from './campaign-leads-ec-report/campaign-leads-ec-report.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { ClipboardModule } from 'ngx-clipboard';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { LeadTatReportComponent } from './lead-tat-report/lead-tat-report.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { LeadTempUploadComponent } from './lead-temp-upload/lead-temp-upload.component';
import { DailyCampaignReportComponent } from './daily-campaign-report/daily-campaign-report.component';
import { CampaignPerformanceComponent } from './campaign-performance/campaign-performance.component';
import { LeadUploadLogComponent } from './lead-upload-log/lead-upload-log.component';
import { LeadsTatLogsComponent } from './leads-tat-logs/leads-tat-logs.component';
import { LeadsLookupComponent } from './leads-lookup/leads-lookup.component';
import { FreshLeadAssignCountComponent } from './fresh-lead-assign-count/fresh-lead-assign-count.component';


@NgModule({
  declarations: [LeadsComponent, LeadManagementComponent, ImportXlsxLeadComponent, LeadDisplayBaseComponent, LeadDisplayComponent, SelectServiceComponent, SelectPriceComponent, LeadStagesComponent, CallbackListComponent, OnboardingListComponent, LeadHistoryComponent, LeadAudienceReportComponent, TeamMemLeadReportComponent, TeamLeadReportComponent, IndividualLeadReportComponent, LeadChangeLogComponent, CampaignLeadsReportComponent, DailyLeadReportComponent, LeadSettingsComponent, OnboardingReportComponent, ScheduleComponent, CampaignLeadsEcReportComponent, LeadTatReportComponent, LeadTempUploadComponent, DailyCampaignReportComponent, CampaignPerformanceComponent, LeadUploadLogComponent, LeadsTatLogsComponent, LeadsLookupComponent, FreshLeadAssignCountComponent],
  imports: [
    CommonModule,
    LeadsRoutingModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    FormsModule,
    NgbModule,
    MatCheckboxModule,
    NgSelectModule,
    MatButtonToggleModule,
    FeahterIconModule,
    NgApexchartsModule,
    FullCalendarModule,
    ClipboardModule,
    DragDropModule,
    MatExpansionModule
  ]
})
export class LeadsModule { }
