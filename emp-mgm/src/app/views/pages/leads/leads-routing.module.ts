import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CallbackListComponent } from './callback-list/callback-list.component';
import { CampaignLeadsEcReportComponent } from './campaign-leads-ec-report/campaign-leads-ec-report.component';
import { CampaignLeadsReportComponent } from './campaign-leads-report/campaign-leads-report.component';
import { CampaignPerformanceComponent } from './campaign-performance/campaign-performance.component';
import { DailyCampaignReportComponent } from './daily-campaign-report/daily-campaign-report.component';
import { DailyLeadReportComponent } from './daily-lead-report/daily-lead-report.component';
import { IndividualLeadReportComponent } from './individual-lead-report/individual-lead-report.component';
import { LeadAudienceReportComponent } from './lead-audience-report/lead-audience-report.component';
import { LeadDisplayBaseComponent } from './lead-display-base/lead-display-base.component';
import { LeadManagementComponent } from './lead-management/lead-management.component';
import { LeadSettingsComponent } from './lead-settings/lead-settings.component';
import { LeadStagesComponent } from './lead-stages/lead-stages.component';
import { LeadTatReportComponent } from './lead-tat-report/lead-tat-report.component';
import { LeadTempUploadComponent } from './lead-temp-upload/lead-temp-upload.component';
import { LeadUploadLogComponent } from './lead-upload-log/lead-upload-log.component';
import { LeadsComponent } from './leads.component';
import { OnboardingListComponent } from './onboarding-list/onboarding-list.component';
import { OnboardingReportComponent } from './onboarding-report/onboarding-report.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { TeamLeadReportComponent } from './team-lead-report/team-lead-report.component';
import { TeamMemLeadReportComponent } from './team-mem-lead-report/team-mem-lead-report.component';
import { LeadsTatLogsComponent } from './leads-tat-logs/leads-tat-logs.component';
import { LeadsLookupComponent } from './leads-lookup/leads-lookup.component';
import { FreshLeadAssignCountComponent } from './fresh-lead-assign-count/fresh-lead-assign-count.component';

const routes: Routes = [
  {
    path: '',
    component: LeadsComponent,
    children: [
      {
        path: '',
        redirectTo: 'leads',
        pathMatch: 'full'
      },
      {
        path: 'leads',
        component: LeadManagementComponent
      },
      {
        path: 'lead-details',
        component: LeadDisplayBaseComponent
      },
      {
        path: 'lead-settings',
        component: LeadSettingsComponent
      },
      {
        path: 'call-backs',
        component: CallbackListComponent
      },
      {
        path: 'onboarding-list',
        component: OnboardingListComponent
      },
      {
        path: 'onboarding-report',
        component: OnboardingReportComponent
      },
      {
        path: 'individual-lead-report',
        component: IndividualLeadReportComponent
      },
      {
        path: 'team-lead-report',
        component: TeamLeadReportComponent
      },
      {
        path: 'team-mem-lead-report',
        component: TeamMemLeadReportComponent
      },
      {
        path: 'audience-lead-report',
        component: LeadAudienceReportComponent
      },
      {
        path: 'campaign-lead-report',
        component: CampaignLeadsReportComponent
      },
      {
        path: 'daily-campaign-lead-report',
        component: DailyCampaignReportComponent
      },
      {
        path: 'staff-campaign-lead-report',
        component: CampaignLeadsEcReportComponent
      },
      {
        path: 'performance-campaign-lead-report',
        component: CampaignPerformanceComponent
      },
      {
        path: 'daily-lead-report',
        component: DailyLeadReportComponent
      },
      {
        path: 'demo-class-schedule',
        component: ScheduleComponent
      },
      {
        path: 'lead-tat-report',
        component: LeadTatReportComponent
      },
      {
        path: 'lead-lookup',
        component: LeadTempUploadComponent
      },
      {
        path: 'leads-lookup-1',
        component: LeadsLookupComponent
      },
      {
        path: 'lead-upload-log',
        component: LeadUploadLogComponent
      },
      {
        path: 'lead-tat-log',
        component: LeadsTatLogsComponent
      },
      {
        path: 'lead-assign-count',
        component: FreshLeadAssignCountComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LeadsRoutingModule { }
