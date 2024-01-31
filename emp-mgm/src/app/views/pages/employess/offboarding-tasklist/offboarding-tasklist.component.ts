import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertNotificationsService } from 'src/app/services/alert-notifications.service';
import { EmployeeService } from 'src/app/services/employee.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Department, Employee, Policy } from 'src/app/model/employee.model';
import { OnboardingService } from 'src/app/services/onboarding.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-offboarding-tasklist',
  templateUrl: './offboarding-tasklist.component.html',
  styleUrls: ['./offboarding-tasklist.component.scss']
})
export class OffboardingTasklistComponent implements OnInit {
  getAllOffBoarding: any;
  sort: MatSort;
  isavailable: boolean;
  taskOwnerData: any;
  _id: any;
  // department_id: any;
  employee_id: any;
  selectstatus: any;
  verificationcomment: any;
  empPersonalDetails: Employee;


  constructor(
    private alertNotificationService: AlertNotificationsService,
    private employeeService: EmployeeService,
    private onboardingService: OnboardingService,
    private modalService: NgbModal,
  ) { }

  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  isLoading = false;
  dataLength;
  displayedColumns: string[];
  departments: Department[] = [];
  DepartmentFilter = null;
  employees: Employee[] = [];

  TaskType = [
    'Physical Asset',
    'Software Asset',
    'Certification',
    'General',
    'Profile'
  ];

  status = [
    'Pending',
    'In Progress',
    'Completed',
    'Verified'
  ];

  taskstatus = [
    'Pending',
    'In Progress',
    'Completed'
  ];

  Priority = [
    'High',
    'Medium',
    'Low'
  ]

  OffBoardingtaskOwner;
  OffBoardingverificationOwner;
  OffBoardingtasktype;
  OffBoardingpriority;
  OffBoardingtaskname;
  OffBoardingdepartment;

  statusfilter = null;
  comment: string = '';
  verificationOwnerfilter = null;
  tasktypefilter = null;
  departmentfilter = null;
  TaskOwnerfilter = null;

  ngOnInit(): void {
    this.displayedColumns = ['taskname', 'tasktype', 'department', 'priority', 'task_assign', 'task_date', 'taskOwner_name', 'verificationOwner_name', 'isOnboarding', 'status', 'option'];
    this.refresh()
  }


  async refresh() {

    await this.employeeService.getAllDepartment('all').toPromise()
      .then(res => {
        this.departments = res as Department[];
      }).catch(err => this.alertNotificationService.alertError(err))
    await this.employeeService.getAllEmployees('all', null, null).toPromise()
      .then(res => {
        this.employees = res;
        this.employees = this.employees.filter(e => e.isActive);
      }).catch(err => this.alertNotificationService.alertError(err));

    this.filter();
  }

  filter() {
    this.onboardingService.getAllOffBoardingTask(this.departmentfilter, this.TaskOwnerfilter, this.verificationOwnerfilter, this.tasktypefilter, this.statusfilter).toPromise()
      .then(res => {
        this.getAllOffBoarding = res
        this.isavailable = this.getAllOffBoarding.length > 0;
        this.isLoading = false
        this.dataSource = new MatTableDataSource(this.getAllOffBoarding);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.dataLength = this.getAllOffBoarding.length;
      }).catch(err => this.alertNotificationService.alertError(err))

  }

  applyFilter(event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  filtersearch(event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  StaffSearchFn(term: string, item: Employee) {
    term = term.toLowerCase();
    return item.fullName.toLowerCase().indexOf(term) > -1 || item.invid.toLowerCase().indexOf(term) > -1;
  }
  taskOwner(row, component) {
    this.modalService.open(component, { size: 'md', centered: true, backdrop: 'static' });
    this.selectstatus = row.status
    this._id = row._id;
  }

  updateStatus() {
    const data = {
      _id: this._id,
      status: this.selectstatus,
      taskOwnercomment: this.comment,
    };
    this.onboardingService.updateOffboardingTask(data).toPromise()
      .then(res => {
        this.alertNotificationService.toastAlertSuccess('Task Owner Status Updated Successfully');
        this.comment = '';
        this.modalService.dismissAll();
        this.refresh();
      })
      .catch(err => this.alertNotificationService.alertError(err));
  }

  verificationOwner(row, component) {
    this.modalService.open(component, { size: 'md', centered: true, backdrop: 'static' });
    this._id = row._id;
  }

  verificationOwnersubmit() {
    const data = {
      _id: this._id,
      status: 'Verified',
      verificationOwnercomment: this.verificationcomment
    };

    this.onboardingService.updateOffboardingTask(data).toPromise()
      .then(res => {
        this.alertNotificationService.toastAlertSuccess('Verification Owner Status Updated Successfully');
        this.verificationcomment = '';
        this.modalService.dismissAll();
        this.refresh();
      })
      .catch(err => this.alertNotificationService.alertError(err));
  }

  taskReassign(row) {
    this.alertNotificationService.alertCustomMsg('Are you sure you want to Re-Assign Task ?')
      .then(result => {
        if (result.isConfirmed) {
          var data = {
            employee_id: row.employee_id,
            department: row.department_id,
            taskname: row.taskname,
            tasktype: row.tasktype,
            priority: row.priority,
            order: row.order,
            taskOwner: row.taskOwner,
            verificationOwner: row.verificationOwner
          }
          this.onboardingService.postspecialOffboardingtask(data).toPromise()
            .then(res => {
              this.alertNotificationService.toastAlertSuccess('Off-Boarding Task Re-Assign Successfully');
              this.refresh()
            }).catch(err => this.alertNotificationService.alertError(err))
        }
      })
  }

  InitiateOffBoarding(component) {
    this.modalService.open(component, { size: 'md', centered: true, backdrop: 'static' });
  }

  async InitiateOffBoardingTask() {
    await this.employeeService.getEmployeeProfile(this.employee_id, null).toPromise()
    .then(em => {
      this.empPersonalDetails = em;
      console.log(this.empPersonalDetails);
    }).catch(err => this.alertNotificationService.alertError(err))
    await this.alertNotificationService.alertCustomMsg('Are you sure you want to Off-Boarding the Employee ?')
      .then(async result => {
        if (result.isConfirmed) {
          var data = {
            employee_id: this.employee_id,
            department_id: this.empPersonalDetails.department_id
          }
          await this.onboardingService.postOffboardingtask(data).toPromise()
            .then(res => {
              this.alertNotificationService.toastAlertSuccess('Off-Employee Task Created Successfully');
              this.employee_id = '';
              this.modalService.dismissAll();
              this.refresh();
            }).catch(err => this.alertNotificationService.alertError(err))

        }
      })
  }

  addspecialtask(component) {
    this.modalService.open(component, { size: 'lg', scrollable: true, centered: true, backdrop: 'static' }).result
      .then(resp => {
        this.alertNotificationService.alertCustomMsg('Are you sure you want to Submit Special Task ?')
          .then(result => {
            if (result.isConfirmed) {
              var data = {
                employee_id: this.OffBoardingverificationOwner,
                taskOwner: this.OffBoardingtaskOwner,
                verificationOwner: this.OffBoardingverificationOwner,
                priority: this.OffBoardingpriority,
                taskname: this.OffBoardingtaskname,
                department: this.OffBoardingdepartment,
                tasktype: this.OffBoardingtasktype
              }
              this.onboardingService.postspecialOffboardingtask(data).toPromise()
                .then(res => {
                  this.alertNotificationService.toastAlertSuccess('Off-Boarding Task Successfully');
                  this.refresh()
                  this.OffBoardingtaskOwner = '',
                    this.OffBoardingverificationOwner = '',
                    this.OffBoardingpriority = '',
                    this.OffBoardingtasktype = '',
                    this.OffBoardingtaskname = '',
                    this.OffBoardingdepartment = ''
                }).catch(err => this.alertNotificationService.alertError(err))
            }
          })
      }).catch(err => console.log(err));
  }



}


