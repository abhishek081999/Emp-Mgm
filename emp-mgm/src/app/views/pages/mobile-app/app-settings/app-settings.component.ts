import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AppVersionSettings } from 'src/app/model/appsettings.model';
import { AlertNotificationsService } from 'src/app/services/alert-notifications.service';
import { MobileAppService } from 'src/app/services/mobile-app.service';

@Component({
  selector: 'app-app-settings',
  templateUrl: './app-settings.component.html',
  styleUrls: ['./app-settings.component.scss']
})
export class AppSettingsComponent implements OnInit {
  appSettings: AppVersionSettings = {
    name: 'Android Settings',
    current_version: 0,
    minimum_supported_version: 0,
    is_maintainance: false,
    notify_title: '',
    notify_description: '',
    isSSFeatureEnable: false
  }
  constructor(
    private mobileAppServices: MobileAppService,
    private alertNotificationService: AlertNotificationsService
  ) { }

  ngOnInit() {
    this.mobileAppServices.getDevicesSettings().toPromise()
      .then(res => {
        this.appSettings = res as AppVersionSettings;
      }).catch(err => { this.alertNotificationService.alertError(err) })
  }

  postDevicesSettings(settingForm: NgForm) {
    var data = {
      name: 'Android Settings',
      current_version: this.appSettings.current_version,
      minimum_supported_version: this.appSettings.minimum_supported_version,
      is_maintainance: this.appSettings.is_maintainance,
      notify_title: this.appSettings.notify_title,
      notify_description: this.appSettings.notify_description,
      isSSFeatureEnable: this.appSettings.isSSFeatureEnable
    }
    this.mobileAppServices.postDevicesSettings(data).toPromise()
      .then(res => this.alertNotificationService.toastAlertSuccess('Submited'))
      .catch(err => this.alertNotificationService.alertError(err))
  }
}
