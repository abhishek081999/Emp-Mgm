import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReferalSettingsComponent } from './referal-settings/referal-settings.component';
import { ReferralDetailsComponent } from './referral-details/referral-details.component';
import { ReferralTransactionComponent } from './referral-transaction/referral-transaction.component';
import { ReferralComponent } from './referral.component';

const routes: Routes = [
  {
    path:'',
    component: ReferralComponent,
    children:[
      {
        path: 'referral-details',
        component: ReferralDetailsComponent
      },
      {
        path: 'referral-transaction',
        component: ReferralTransactionComponent
      },
      {
        path: 'referral-transaction/:id',
        component: ReferralTransactionComponent
      },
      {
        path: 'referal-settings',
        component: ReferalSettingsComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReferralRoutingModule { }
