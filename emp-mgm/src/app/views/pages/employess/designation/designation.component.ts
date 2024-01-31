import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Department, Designation } from 'src/app/model/employee.model';
import { AlertNotificationsService } from 'src/app/services/alert-notifications.service';
import { EmployeeService } from 'src/app/services/employee.service';

@Component({
  selector: 'app-designation',
  templateUrl: './designation.component.html',
  styleUrls: ['./designation.component.scss']
})
export class DesignationComponent implements OnInit {

  constructor(
    private employeeService: EmployeeService,
    private alertNotificationService: AlertNotificationsService,
  ) { }
  departments: Department[] = [];
  designation: Designation = {
    name: '',
    department_id: '',
    order: 0
  }
  designations = [];
  isDesignationAvailable = false;
  displayedColumns = []
  dataSource: MatTableDataSource<any>;
  ngOnInit(): void {
    this.displayedColumns = ['name', 'no_of_emp', 'options']
    this.refresh()
  }
  refresh() {
    this.refreshDesignation();
    this.employeeService.getAllDepartment('all').toPromise()
      .then(res => {
        this.departments = res as Department[];
      }).catch(err => this.alertNotificationService.alertError(err))
  }

  refreshDesignation() {
    this.isDesignationAvailable = false;
    this.employeeService.getAllDesignation('display').toPromise()
      .then(res => {
        this.designations = res as any[];
        this.onDeptSelect(this.designations[0])
        this.isDesignationAvailable = true;
      }).catch(err => this.alertNotificationService.alertError(err))
  }

  submit() {
    this.alertNotificationService.alertChanges()
      .then(result => {
        if (result.isConfirmed) {
          var a = this.designations.filter(e => e._id == this.designation.department_id)
          this.designation.order = a && a.length ? a.length : 0;
          this.employeeService.addDesignation(this.designation).toPromise()
            .then(res => {
              this.alertNotificationService.toastAlertSuccess("Saved Successfully")
              this.designation = new Designation();
              this.isEdit = false;
              this.refreshDesignation();
            }).catch(err => this.alertNotificationService.alertError(err))
        }
      })
  }

  deleteDesignation(id) {
    this.alertNotificationService.alertDelete()
      .then(result => {
        if (result.isConfirmed) {
          this.employeeService.deleteDesignation(id).toPromise()
            .then(res => {
              this.alertNotificationService.toastAlertSuccess("Deleted Successfully")
              this.refreshDesignation();
            }).catch(err => this.alertNotificationService.alertError(err))
        }
      })
  }
  dupDesignations = []
  currentDesignations = []
  onDeptSelect(row) {
    if (row && row.designations && row.designations.length > 0) {
      this.currentDesignations = [...row.designations];
      this.dataSource = new MatTableDataSource(row.designations);
      this.dupDesignations = [...row.designations];
    } else {
      this.dataSource = new MatTableDataSource([]);
      this.dupDesignations = [];
      this.currentDesignations = [];
    }
  }

  isEdit = false;
  editDesignation(designation) {
    this.designation = designation;
    this.isEdit = true;
  }

  cancelEdit() {
    this.designation = new Designation();
    this.isEdit = false
  }

  drop(event: CdkDragDrop<any[]>) {
    moveItemInArray(this.currentDesignations, event.previousIndex, event.currentIndex);
    
    var updates = []
    for (var i = 0; i < this.currentDesignations.length; i++) {
      this.currentDesignations[i].order = i
      if (this.currentDesignations[i]._id != this.dupDesignations[i]._id) {
        updates.push(this.currentDesignations[i])
      }
    }
    if (updates.length > 0) {
      this.employeeService.designationOrderUpdate(updates).toPromise()
        .then(res => {
          this.dataSource = new MatTableDataSource(this.currentDesignations);
          this.alertNotificationService.toastAlertSuccess('Designation Order Updated')
        }).catch(err => { this.alertNotificationService.alertError(err); })
    }
  }

}
