import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { EmailRegex } from 'src/app/Enums/staticdata';
import { AlertNotificationsService } from 'src/app/services/alert-notifications.service';
import { EmployeeService } from 'src/app/services/employee.service';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.scss']
})
export class ForgetPasswordComponent implements OnInit, OnDestroy {

  constructor(
    private employeeService: EmployeeService,
    private route: ActivatedRoute,
    private router: Router,
    private alertNotificationService: AlertNotificationsService) { }


  model = {
    email: '',
    password: '',
    repassword: ''
  };
  emailRegex = EmailRegex
  serverErrorMessages: string;
  showserverErrorMessages = false;
  showSuccess = false;
  reset = true;
  showResetSuccess = false;
  id;
  token;

  querysub: Subscription
  ngOnInit() {
    if (this.employeeService.isLoggedIn())
      this.router.navigateByUrl('/admin/dashboard');
    this.querysub = this.route.queryParamMap.subscribe(query => {
      this.id = query.get('id');
      this.token = query.get('token');
      if (this.token && this.id) { this.reset = false; }
    })
  }

  ngOnDestroy(): void {
    if (this.querysub) {
      this.querysub.unsubscribe()
    }
  }

  onSubmit(form: NgForm) {
    this.employeeService.forgetPassword(form.value).toPromise()
      .then(res => {
        this.alertNotificationService.alertInfo('Please Check Your Mail. Password Reset Link is sent to your Registered Mail')
        this.showSuccess = true;
      }).catch(err => this.alertNotificationService.alertError(err))
  }

  onReset(form: NgForm) {
    this.employeeService.resetPassword(form.value, this.id, this.token).toPromise()
      .then(res => {
        this.showResetSuccess = true;
        this.alertNotificationService.toastAlertSuccess('Password Reset Successfull')
        setTimeout(() => {
          this.router.navigateByUrl('/auth/login');
        }, 5000);
      }).catch(err => this.alertNotificationService.alertError(err))
  }

}
