import { TitleCasePipe, UpperCasePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AlertNotificationsService } from 'src/app/services/alert-notifications.service';
import { ChatService } from 'src/app/services/chat.service';

@Component({
  selector: 'app-support-settings',
  templateUrl: './support-settings.component.html',
  styleUrls: ['./support-settings.component.scss'],
  providers: [TitleCasePipe, UpperCasePipe]
})
export class SupportSettingsComponent implements OnInit {

  constructor(
    private titlecasePipe: TitleCasePipe,
    private chatService: ChatService,
    private alertNotificationService: AlertNotificationsService,
    private uppercasePipe: UpperCasePipe
  ) { }

  newcategory: string = null
  newcategory_short: string = null
  categorySettings = {
    name: 'Support Category',
    lists: []
  }

  supportSettings = {
    name: 'Support Settings',
    isLiveMarketChatActive: false,
    reason: null
  }


  ngOnInit(): void {
    this.chatService.GetSettings().toPromise()
      .then(res => {
        this.categorySettings = res['category']
        this.supportSettings = res['settings']
      }).catch(err => this.alertNotificationService.alertError(err))
  }

  createcategory() {
    var data = {
      type: "Live Market Support",
      name: this.titlecasePipe.transform(this.newcategory.trim()),
      short_name: this.uppercasePipe.transform(this.newcategory_short.trim()),
      isActive: false
    }
    this.chatService.newCategory(data).toPromise()
      .then(res => {
        this.categorySettings.lists.push(data)
        this.newcategory = null
        this.newcategory_short = null
        this.alertNotificationService.toastAlertSuccess('Category Added')
      }).catch(err => this.alertNotificationService.alertError(err))
  }

  saveSettings() {
    this.chatService.saveSettings(this.supportSettings).toPromise()
      .then(res => {
        this.alertNotificationService.toastAlertSuccess('Settings Saved')
      }).catch(err => this.alertNotificationService.alertError(err))
  }

  updatestatus(data) {
    this.chatService.updateCategory(data).toPromise()
      .then(res => {
        this.alertNotificationService.toastAlertSuccess('Category Updated')
      }).catch(err => this.alertNotificationService.alertError(err))
  }
}
