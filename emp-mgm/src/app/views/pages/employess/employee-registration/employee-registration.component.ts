import { Component, OnInit } from '@angular/core';
import { Department, Employee } from 'src/app/model/employee.model';
import { AlertNotificationsService } from 'src/app/services/alert-notifications.service';
import { EmployeeService } from 'src/app/services/employee.service';

@Component({
  selector: 'app-employee-registration',
  templateUrl: './employee-registration.component.html',
  styleUrls: ['./employee-registration.component.scss']
})
export class EmployeeRegistrationComponent implements OnInit {
  showPassword: boolean = false;
  confirmPassword = null;
  signup: Employee = {
    email: '',
    password: null,
    fullName: '',
    telephone: '',
    alternatenum: '',
    department: ''
  }
  departments: Department[];
  employee_dep;
  constructor(private employeeService: EmployeeService,
    private alertNotificationService: AlertNotificationsService) { }

  ngOnInit(): void {
    this.employeeService.getAllDepartment('all').toPromise()
      .then(res => {
        this.departments = res as Department[];
      }).catch(err => this.alertNotificationService.alertError(err))
  }
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
  passwordsMatch() {
    return this.signup.password === this.confirmPassword;
  }
  isSubmit = false
  signupres = new Employee()
  submit() {
    this.employeeService.newEmployee(this.signup).toPromise()
      .then(res => {
        this.signupres = res;
        this.isSubmit = true;
        this.getemployeedeptdata();
        this.alertNotificationService.toastAlertSuccess("Employee Account Created And On-boarding Started");
      }).catch(err => this.alertNotificationService.alertError(err))
  }

  getemployeedeptdata(){
    this.employeeService.getemployeedepartments(this.signupres.department_id).toPromise()
    .then(res => {
      this.employee_dep = res as Department[];
    }).catch(err => this.alertNotificationService.alertError(err))
  }
}
