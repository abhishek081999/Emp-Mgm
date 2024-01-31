import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReportsComponent } from './reports.component';
import { InsigniaReportJComponent } from './insignia-report-j/insignia-report-j.component';
import { BcmbReportAComponent } from './bcmb-report-a/bcmb-report-a.component';
import { InsigniaReportAComponent } from './insignia-report-a/insignia-report-a.component';
import { InsigniaReportBComponent } from './insignia-report-b/insignia-report-b.component';
import { InsigniaReportCComponent } from './insignia-report-c/insignia-report-c.component';
import { InsigniaReportDComponent } from './insignia-report-d/insignia-report-d.component';
import { InsigniaReportEComponent } from './insignia-report-e/insignia-report-e.component';
import { InsigniaReportFComponent } from './insignia-report-f/insignia-report-f.component';
import { InsigniaReportGComponent } from './insignia-report-g/insignia-report-g.component';
import { InsigniaReportHComponent } from './insignia-report-h/insignia-report-h.component';
import { InsigniaReportIComponent } from './insignia-report-i/insignia-report-i.component';
import { IVRReportComponent } from './ivr-report/ivr-report.component';
import { AppReportAComponent } from './app-report-a/app-report-a.component';
import { IvrReportAComponent } from './ivr-report-a/ivr-report-a.component';
import { IvrReportBComponent } from './ivr-report-b/ivr-report-b.component';

const routes: Routes = [{
  path: '',
  component: ReportsComponent,
  children: [
    {
      path: 'ivr-report',
      component: IVRReportComponent
    },
    {
      path: 'ivr-report-1',
      component: IvrReportAComponent
    },
    {
      path: 'ivr-report-2',
      component: IvrReportBComponent
    },
    {
      path: 'insignia-report-1',
      component: InsigniaReportAComponent
    },
    {
      path: 'insignia-report-2',
      component: InsigniaReportBComponent
    },
    {
      path: 'insignia-report-3',
      component: InsigniaReportCComponent
    },
    {
      path: 'insignia-report-4',
      component: InsigniaReportDComponent
    },
    {
      path: 'insignia-report-5',
      component: InsigniaReportEComponent
    },
    {
      path: 'insignia-report-6',
      component: InsigniaReportFComponent
    },
    {
      path: 'insignia-report-7',
      component: InsigniaReportGComponent
    },
    {
      path: 'insignia-report-8',
      component: InsigniaReportHComponent
    },
    {
      path: 'insignia-report-9',
      component: InsigniaReportIComponent
    },
    {
      path: 'insignia-report-10',
      component: InsigniaReportJComponent
    },
    {
      path: 'bcmb-report-1',
      component: BcmbReportAComponent
    },
    {
      path: 'app-report-1',
      component: AppReportAComponent
    },
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule { }
