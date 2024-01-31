import { Component, OnInit } from '@angular/core';
import { Department, Employee, Team } from 'src/app/model/employee.model';
import { onboardingTaskSettings } from 'src/app/model/onboarding.model';
import { AlertNotificationsService } from 'src/app/services/alert-notifications.service';
import { EmployeeService } from 'src/app/services/employee.service';
import { OnboardingService } from 'src/app/services/onboarding.service';

@Component({
  selector: 'app-create-onboardingsetting',
  templateUrl: './create-onboardingsetting.component.html',
  styleUrls: ['./create-onboardingsetting.component.scss']
})
export class CreateOnboardingsettingComponent implements OnInit {

  departments: Department[] = [];
  employees: Employee[] = [];
  showEditButton = false;
  showDeleteButton = false;
  currentDocumentId: string = '';
  selectedOnBoardingSetting: onboardingTaskSettings;
  selectedOffBoardingSetting: onboardingTaskSettings;

  showUpdateButton: boolean = false;
  OnBoardingTaskSettings: onboardingTaskSettings = {
    _id: '',
    department: '',
    taskname: '',
    isOnboarding: false,
    tasktype: '',
    priority: '',
    order: null,
    taskOwner: '',
    verificationOwner: ''
  }

  TaskType = [
    'Physical Asset',
    'Software Asset',
    'Certification',
    'General',
    'Profile'
  ]

  Priority = [
    'High',
    'Medium',
    'Low'
  ]
  isdepartmentsAvailable = false;
  OnBoardingtaskOwner;
  OnBoardingverificationOwner;
  OnBoardingtasktype;
  OnBoardingpriority;
  OnBoardingtaskname;
  dept_emp: any;

  OffBoardingtaskOwner;
  OffBoardingverificationOwner;
  OffBoardingtasktype;
  OffBoardingtaskname;
  OffBoardingpriority;

  OnBoardingdepartments;
  departmentfilter = null;
  TaskOwnerfilter = null;
  getAllOnBoardingSetting = [];
  verificationOwnerfilter = null;
  tasktypefilter = null;

  totalSize: number
  currentPage: number = 1
  pageSize: number = 16
  status;

  constructor(
    private employeeService: EmployeeService,
    private alertNotificationService: AlertNotificationsService,
    private onboardingService: OnboardingService
  ) { }

  async ngOnInit(): Promise<void> {
    await this.employeeService.getAllDepartment('all').toPromise()
      .then(res => {
        this.departments = res;
        this.isdepartmentsAvailable = true;
        this.dept_emp = this.departments[0]
        console.log('Departments fetched successfully:', this.departments);

      }).catch(err => this.alertNotificationService.alertError(err))

    await this.employeeService.getAllEmployees('all', null, null).toPromise()
      .then(res => {
        this.employees = res;
        this.employees = this.employees.filter(e => e.isActive);
        console.log('Employees fetched successfully:', this.employees);

      }).catch(err => this.alertNotificationService.alertError(err));
    this.refresh()

  }


  refresh() {
    this.OnBoarding();
  }

  onDeptSelect(row) {
    if (row) {
      this.dept_emp = row
      this.OnBoarding();
    }

  }


  StaffSearchFn(term: string, item: Employee) {
    term = term.toLowerCase();
    return item.fullName.toLowerCase().indexOf(term) > -1 || item.invid.toLowerCase().indexOf(term) > -1;
  }


  submitOnBoarding() {
    var data = {
      taskOwner: this.OnBoardingtaskOwner,
      verificationOwner: this.OnBoardingverificationOwner,
      priority: this.OnBoardingpriority,
      taskname: this.OnBoardingtaskname,
      department: this.dept_emp._id,
      isOnboarding: true,
      tasktype: this.OnBoardingtasktype
    }
    this.onboardingService.postOnboardingSetting(data).toPromise()
      .then(res => {
        this.alertNotificationService.toastAlertSuccess("On-Boarding Setting Saved Successfully")
        this.refresh()
        this.OnBoardingtaskOwner = '',
          this.OnBoardingverificationOwner = '',
          this.OnBoardingpriority = '',
          this.OnBoardingtasktype = '',
          this.OnBoardingtaskname = ''
      }).catch(err => this.alertNotificationService.alertError(err))

  }

  submitOffBoarding() {
    var data = {
      taskOwner: this.OffBoardingtaskOwner,
      verificationOwner: this.OffBoardingverificationOwner,
      priority: this.OffBoardingpriority,
      taskname: this.OffBoardingtaskname,
      department: this.dept_emp._id,
      isOnboarding: false,
      tasktype: this.OffBoardingtasktype
    }
    console.log('Data to be submitted:', data);

    this.onboardingService.postOnboardingSetting(data).toPromise()
      .then(res => {
        this.alertNotificationService.toastAlertSuccess("Off-Boarding Setting Saved Successfully")
        this.refresh()
        this.OffBoardingtaskOwner = '',
          this.OffBoardingverificationOwner = '',
          this.OffBoardingpriority = '',
          this.OffBoardingtasktype = '',
          this.OffBoardingtaskname = ''
      }).catch(err => this.alertNotificationService.alertError(err))

  }


  deleteOnBoardingSetting(row) {
    this.alertNotificationService.alertCustomMsg('Are you sure you want to delete this Task Setting ?')
      .then(result => {
        if (result.isConfirmed) {
          var id = row._id
          this.onboardingService.deleteOnBoardingSetting(id).toPromise()
            .then(res => {
              this.alertNotificationService.toastAlertSuccess('Task Setting Deleted Successfully');
              this.refresh()
              this.OffBoarding()
            }).catch(err => this.alertNotificationService.alertError(err))
        }
      })
  }
  editOnBoardingSetting(item: onboardingTaskSettings) {
    this.selectedOnBoardingSetting = { ...item };

    this.showUpdateButton = true;
    // Set the form field values based on the selected item
    this.OnBoardingtaskname = this.selectedOnBoardingSetting.taskname;
    this.OnBoardingtaskOwner = this.selectedOnBoardingSetting.taskOwner;
    this.OnBoardingverificationOwner = this.selectedOnBoardingSetting.verificationOwner;
    this.OnBoardingtasktype = this.selectedOnBoardingSetting.tasktype;
    this.OnBoardingpriority = this.selectedOnBoardingSetting.priority;

    this.selectedOffBoardingSetting = { ...item }

    this.OffBoardingtaskname = this.selectedOffBoardingSetting.taskname;
    this.OffBoardingtaskOwner = this.selectedOffBoardingSetting.taskOwner;
    this.OffBoardingverificationOwner = this.selectedOffBoardingSetting.verificationOwner;
    this.OffBoardingtasktype = this.selectedOffBoardingSetting.tasktype;
    this.OffBoardingpriority = this.selectedOffBoardingSetting.priority;


  }

  updateOnBoarding(item: any) {
    const id = item._id;
    const updatedData = {
      taskOwner: this.OnBoardingtaskOwner,
      verificationOwner: this.OnBoardingverificationOwner,
      priority: this.OnBoardingpriority,
      taskname: this.OnBoardingtaskname,
      department: this.dept_emp._id,
      isOnboarding: true,
      tasktype: this.OnBoardingtasktype
    };
    this.onboardingService.updateOnboardingSetting(id, updatedData).toPromise()
      .then(res => {
        this.alertNotificationService.toastAlertSuccess("on-Boarding Setting update Successfully")
        this.refresh()
        this.OnBoardingtaskOwner = '',
          this.OnBoardingverificationOwner = '',
          this.OnBoardingpriority = '',
          this.OnBoardingtasktype = '',
          this.OnBoardingtaskname = ''
        this.showUpdateButton = false;
      })
      .catch(err => {
        console.error('Error updating Onboarding Setting', err);
      });

  }
  updateOffBoarding(item: any) {
    const id = item._id;
    const updatedData = {
      taskOwner: this.OffBoardingtaskOwner,
      verificationOwner: this.OffBoardingverificationOwner,
      priority: this.OffBoardingpriority,
      taskname: this.OffBoardingtaskname,
      department: this.dept_emp._id,
      isOnboarding: false,
      tasktype: this.OffBoardingtasktype
    };
    this.onboardingService.updateOffboardingSetting(id, updatedData).toPromise()
      .then(res => {
        this.alertNotificationService.toastAlertSuccess("off-Boarding Setting update Successfully")
        this.refresh()
        this.OffBoarding()
        this.OffBoardingtaskOwner = '',
        this.OffBoardingverificationOwner = '',
        this.OffBoardingpriority = '',
        this.OffBoardingtasktype = '',
        this.OffBoardingtaskname = ''

        this.showUpdateButton = false;
      })
      .catch(err => {
        console.error('Error updating Offboarding Setting', err);
      });
  }


  FilterSearch(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.getAllOnBoardingSetting = this.getAllOnBoardingSetting.filter(item =>
      item.taskname.toLowerCase().includes(filterValue)
    );
  }


  OnBoarding() {
    this.status = 'Onboarding';
    this.onboardingService.getAllonboardingsetting(this.dept_emp._id, this.status).toPromise()
      .then(res => {
        this.getAllOnBoardingSetting = res;
      }).catch(err => this.alertNotificationService.alertError(err))
  }

  OffBoarding() {
    this.status = 'Offboarding';
    this.onboardingService.getAllonboardingsetting(this.dept_emp._id, this.status).toPromise()
      .then(res => {
        this.getAllOnBoardingSetting = res;
      }).catch(err => this.alertNotificationService.alertError(err))
  }



  pagechange() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }
  toggleButtons() {
    this.showEditButton = !this.showEditButton;
    this.showDeleteButton = !this.showDeleteButton;
  }

}
