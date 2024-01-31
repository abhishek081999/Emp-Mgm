import { Component, OnInit } from '@angular/core';
import { Purchases, ReferralSetting } from 'src/app/model/referral.model';
import { AlertNotificationsService } from 'src/app/services/alert-notifications.service';
import { ReferralService } from 'src/app/services/referral.service';

@Component({
  selector: 'app-referal-settings',
  templateUrl: './referal-settings.component.html',
  styleUrls: ['./referal-settings.component.scss']
})
export class ReferalSettingsComponent implements OnInit {
  referralSettings: ReferralSetting = {
    name: '',
    referee_joining_bonus: 0,
    referrer_joining_bonus: 0,
    purchases: []
  }
  Purchases: Purchases[] = []
  numPattern = /([1-9][0-9]*)|0/;

  constructor(
    private referralService: ReferralService,
    private alertNotificationService: AlertNotificationsService,
  ) { }

  async ngOnInit() {
    await this.referralService.getReferralSettings().toPromise()
      .then(res => {
        this.referralSettings = res as ReferralSetting;
        this.Purchases = this.referralSettings.purchases as Purchases[];
      }).catch(err => this.alertNotificationService.alertError(err))
  }
  postReferralSettings(e: Event) {
    this.referralSettings.purchases = this.Purchases;
    this.referralService.postReferralSettings(this.referralSettings).toPromise()
      .then(res => {
        this.alertNotificationService.toastAlertSuccess('Submit Succesfully')
      }).catch(err => this.alertNotificationService.alertError(err));
    e.preventDefault();
  }

  removeForm(index) {
    this.Purchases.splice(index, 1);
  }

  addForm() {
    var c = new Purchases();
    c.referee_eligible = false
    c.referrer_eligible = false
    this.Purchases.push(c);
  }
}
