import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertNotificationsService } from 'src/app/services/alert-notifications.service';
import { EmployeeService } from 'src/app/services/employee.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  returnUrl: any;
  model = {
    email: '',
    password: ''
  };

  constructor(
    private employeeService: EmployeeService, 
    private route: ActivatedRoute, 
    private router: Router,
    private alertNotificationService: AlertNotificationsService) { }


  ngOnInit(): void {
    if (this.employeeService.isLoggedIn())
      this.router.navigateByUrl('/admin/dashboard');
  }
  login(form: NgForm) {
    this.employeeService.login(this.model).toPromise()
      .then(res => {
        this.employeeService.setToken(res['token']);
        //this.router.navigateByUrl('/dashboard');
        let returnUrl = this.employeeService.redirectedurl;
        this.router.navigate([returnUrl || '/admin/dashboard']);
        this.alertNotificationService.toastAlertSuccess('Welcome to Invesmate')
      }).catch(err => this.alertNotificationService.alertError(err))

  }
}
