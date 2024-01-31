import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AlertNotificationsService } from 'src/app/services/alert-notifications.service';

@Component({
  selector: 'app-cronjob-runner',
  templateUrl: './cronjob-runner.component.html',
  styleUrls: ['./cronjob-runner.component.scss']
})
export class CronjobRunnerComponent implements OnInit {

  fromDateFilter: string = ''

  constructor(private http: HttpClient,
    private alertNotificationService: AlertNotificationsService) { }

  ngOnInit(): void {
  }

  dailyLeadReportCron() {
    if (this.fromDateFilter) {
      this.alertNotificationService.alertApprove()
        .then(res => {
          if (res.isConfirmed) {
            this.http.get('/api/v2/dailyLeadReportCron/' + this.fromDateFilter).toPromise()
              .then(res => {
                this.alertNotificationService.toastAlertSuccess('Success')
              }).catch(err => this.alertNotificationService.alertError(err))
          }
        })
    } else {
      this.alertNotificationService.alertInfo('Select Date')
    }
  }
  dailyLeadTatReportCron() {
    if (this.fromDateFilter) {
      this.alertNotificationService.alertApprove()
        .then(res => {
          if (res.isConfirmed) {
            this.http.get('/api/v2/dailyLeadTatReportCron/' + this.fromDateFilter).toPromise()
              .then(res => {
                this.alertNotificationService.toastAlertSuccess('Success')
              }).catch(err => this.alertNotificationService.alertError(err))
          }
        })
    } else {
      this.alertNotificationService.alertInfo('Select Date')
    }
  }
  dailyOnboardingTATCron() {
    if (this.fromDateFilter) {
      this.alertNotificationService.alertApprove()
        .then(res => {
          if (res.isConfirmed) {
            this.http.get('/api/v2/dailyOnboardingTATCron/' + this.fromDateFilter).toPromise()
              .then(res => {
                this.alertNotificationService.toastAlertSuccess('Success')
              }).catch(err => this.alertNotificationService.alertError(err))
          }
        })
    } else {
      this.alertNotificationService.alertInfo('Select Date')
    }
  }
  dailyUpcomingPaymentsCron() {
    if (this.fromDateFilter) {
      this.alertNotificationService.alertApprove()
        .then(res => {
          if (res.isConfirmed) {
            this.http.get('/api/v2/dailyUpcomingPaymentsCron/' + this.fromDateFilter).toPromise()
              .then(res => {
                this.alertNotificationService.toastAlertSuccess('Success')
              }).catch(err => this.alertNotificationService.alertError(err))
          }
        })
    } else {
      this.alertNotificationService.alertInfo('Select Date')
    }
  }
  dailyUpcomingProductExpiringCron() {
    if (this.fromDateFilter) {
      this.alertNotificationService.alertApprove()
        .then(res => {
          if (res.isConfirmed) {
            this.http.get('/api/v2/dailyUpcomingProductExpiringCron/' + this.fromDateFilter).toPromise()
              .then(res => {
                this.alertNotificationService.toastAlertSuccess('Success')
              }).catch(err => this.alertNotificationService.alertError(err))
          }
        })
    } else {
      this.alertNotificationService.alertInfo('Select Date')
    }
  }
  fortnightPaymentDues() {
    if (this.fromDateFilter) {
      this.alertNotificationService.alertApprove()
        .then(res => {
          if (res.isConfirmed) {
            this.http.get('/api/v2/fortnightPaymentDues/' + this.fromDateFilter).toPromise()
              .then(res => {
                this.alertNotificationService.toastAlertSuccess('Success')
              }).catch(err => this.alertNotificationService.alertError(err))
          }
        })
    } else {
      this.alertNotificationService.alertInfo('Select Date')
    }
  }
  weeklyLeadTatReportCron() {
    if (this.fromDateFilter) {
      this.alertNotificationService.alertApprove()
        .then(res => {
          if (res.isConfirmed) {
            this.http.get('/api/v2/weeklyLeadTatReportCron/' + this.fromDateFilter).toPromise()
              .then(res => {
                this.alertNotificationService.toastAlertSuccess('Success')
              }).catch(err => this.alertNotificationService.alertError(err))
          }
        })
    } else {
      this.alertNotificationService.alertInfo('Select Date')
    }
  }
  weeklyDataMismatchCron() {
    if (this.fromDateFilter) {
      this.alertNotificationService.alertApprove()
        .then(res => {
          if (res.isConfirmed) {
            this.http.get('/api/v2/weeklyDataMismatchCron/' + this.fromDateFilter).toPromise()
              .then(res => {
                this.alertNotificationService.toastAlertSuccess('Success')
              }).catch(err => this.alertNotificationService.alertError(err))
          }
        })
    } else {
      this.alertNotificationService.alertInfo('Select Date')
    }
  }

  NSEBhabCopySync() {
    if (this.fromDateFilter) {
      this.alertNotificationService.alertApprove()
        .then(res => {
          if (res.isConfirmed) {
            this.http.get('/api/v2/NSEbhavcopySync/' + this.fromDateFilter).toPromise()
              .then(res => {
                this.alertNotificationService.toastAlertSuccess('Success')
              }).catch(err => this.alertNotificationService.alertError(err))
          }
        })
    } else {
      this.alertNotificationService.alertInfo('Select Date')
    }
  }

  BSEBhabCopySync() {
    if (this.fromDateFilter) {
      this.alertNotificationService.alertApprove()
        .then(res => {
          if (res.isConfirmed) {
            this.http.get('/api/v2/BSEbhavcopySync/' + this.fromDateFilter).toPromise()
              .then(res => {
                this.alertNotificationService.toastAlertSuccess('Success')
              }).catch(err => this.alertNotificationService.alertError(err))
          }
        })
    } else {
      this.alertNotificationService.alertInfo('Select Date')
    }
  }

  NSEStockNameSync() {
    this.alertNotificationService.alertApprove()
      .then(res => {
        if (res.isConfirmed) {
          this.http.get('/api/v2/stock-instruments').toPromise()
            .then(res => {
              this.alertNotificationService.toastAlertSuccess('Success')
            }).catch(err => this.alertNotificationService.alertError(err))
        }
      })
  }

  batchdata = {
    oldbatch:'',
    newbatch:'',
    invid: ''
  }

  batchchange() {

    this.alertNotificationService.alertApprove()
      .then(res => {
        if (res.isConfirmed) {
          this.http.post('/api/v2/course-batch-change',this.batchdata).toPromise()
            .then(res => {
              this.batchdata = {
                oldbatch: '',
                newbatch: '',
                invid: ''
              }
              this.alertNotificationService.alertInfo(JSON.stringify(res, undefined, 2));
            }).catch(err => this.alertNotificationService.alertError(err))
        }
      })
  }

}
