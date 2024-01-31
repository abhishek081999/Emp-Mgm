import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Attendence, Department, Employee, Leave, Regularize } from 'src/app/model/employee.model';
import { AlertNotificationsService } from 'src/app/services/alert-notifications.service';
import { AttendanceService } from 'src/app/services/attendance.service';
import { DeviceInfoService } from 'src/app/services/device.info.service';
import { EmployeeService } from 'src/app/services/employee.service';
import { ModalSetAttendanceComponent } from '../modal-set-attendance/modal-set-attendance.component';
import { AttendanceType } from 'src/app/Enums/staticdata';
import { ExportService } from 'src/app/services/export.service';

@Component({
  selector: 'app-all-requests',
  templateUrl: './all-requests.component.html',
  styleUrls: ['./all-requests.component.scss']
})
export class AllRequestsComponent implements OnInit {


  // Attendance Variable
  startDateAttendance = null
  endDateAttendance = null
  departmentAttendance = null
  managerAttendance = null
  attendanceStatusFilter = 'Pending'
  employeeAttendance = null
  attendanceStatusItems = [
    'Approve',
    'Pending'
  ];

  // Regularize Attendance Variable
  startDateRegularize = null
  endDateRegularize = null
  departmentRegularize = null
  managerRegularize = null
  employeeRegularize = null
  regularizeStatusItems = [
    'Approve',
    'Pending',
    'Reject'
  ];

  regularizeStatusFilter = 'Pending'

  // Leave Variable
  startDateLeave = null
  endDateLeave = null
  departmentLeave = null
  managerLeave = null
  managerStatusLeave = 'Pending'
  leaveStatusItems = [
    'Approve',
    'Pending',
    'Reject'

  ]
  hrLeaveFilter = 'Pending'
  employeeLeave = null
  attendance: Attendence = {
    isApprove: false,
    isRegularize: false,
    device: {
      device: '',
      browser: ''
    },
    department: '',
    reason: ''
  }
  regularize: Regularize = {
    device: {
      device: '',
      browser: ''
    },
    isApprove: false,
  }

  attendanceType = AttendanceType;
  payload;

  getAllRegularize: Array<Regularize> = [];
  getAllAttendance: Array<Attendence> = [];
  getLeaverequest: Array<Leave> = [];
  selection = new SelectionModel<Attendence>(true, []);
  selection2 = new SelectionModel<Regularize>(true, []);
  selection3 = new SelectionModel<Leave>(true, []);
  deviceInfo: { Device: string; Browser: string; };
  isLoading = false
  isavailable: boolean;
  departments: Department[] = [];
  employees: Employee[] = [];
  comments = null
  constructor(
    private deviceDetector: DeviceInfoService,
    private alertNotificationService: AlertNotificationsService,
    private attendanceService: AttendanceService,
    private employeeService: EmployeeService,
    private modalService: NgbModal,
    private exportService: ExportService

  ) {
    this.deviceInfo = this.deviceDetector.getDeviceInfo();
  }

  dataLength;
  displayedColumns: string[];
  displayedColumns2: string[];
  displayedColumns3: string[];
  dataSource: MatTableDataSource<Attendence>;
  dataSource2: MatTableDataSource<Regularize>;
  dataSource3: MatTableDataSource<Leave>;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;


  async ngOnInit() {
    this.payload = this.employeeService.getUserPayload()
    this.displayedColumns = ['Select', 'employee_name', 'attendance', 'attendanceTime', 'department', 'manager_name', 'comments', 'approveBy_name'];
    this.displayedColumns2 = ['Select', 'employee_name', 'attendance', 'attendance_date', 'request_date', 'reason', 'department', 'manager', 'comments', 'approveBy_name'];
    this.displayedColumns3 = ['Select', 'employee_name', 'fromDate', 'toDate', 'leaveType', 'is_half_day', 'days_count', 'request_date', 'department', 'manager', 'hr', 'comments', 'reason', 'approveByManager_name', 'approveByHr_name', 'supportingDocument'];
    this.isLoading = true;
    this.refresh()
    this.attendanceFilter();
    this.regularizeFilter();
    this.leaveFilter();
  }

  async refresh() {
    this.employeeService.getAllEmployees('all', null, null).toPromise()
      .then(res => {
        this.employees = res;
        this.employees = this.employees.filter(e => e.isActive);
      }).catch(err => this.alertNotificationService.alertError(err));
    this.employeeService.getAllDepartment('all').toPromise()
      .then(res => {
        this.departments = res as Department[];
      }).catch(err => this.alertNotificationService.alertError(err))
  }

  attendanceFilter() {
    this.isLoading = true
    let employeeAttendance = null;
    if (this.employeeAttendance) {
      employeeAttendance = [this.employeeAttendance]
    }
    this.attendanceService.getAllAttendance(this.startDateAttendance, this.endDateAttendance, this.departmentAttendance, this.managerAttendance, this.attendanceStatusFilter, employeeAttendance).toPromise()
      .then(res => {
        this.getAllAttendance = res
        this.isavailable = this.getAllAttendance.length > 0;
        this.isLoading = false
        this.dataSource = new MatTableDataSource(this.getAllAttendance);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.dataLength = this.getAllAttendance.length;
        this.selection.clear();
      }).catch(err => this.alertNotificationService.alertError(err))
  }

  attendanceExport() {
    var data = [];
    if (this.dataSource) {
      data = this.dataSource.filteredData;
    } else {
      this.alertNotificationService.alertInfo("No Data Found to Export");
      return;
    }
    var title = 'Attendance';
    data.forEach(e => {
      e.approveAt = e.approveAt ? new Date(e.approveAt) : null,
        e.attendanceTime = e.attendanceTime ? new Date(e.attendanceTime) : null
    })
    this.exportService.exportonesheet(title, data);
  }

  attendanceFilterSearch(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  regularizeFilter() {
    this.isLoading = true
    let employeeRegularize = null;
    if (this.employeeRegularize) {
      employeeRegularize = [this.employeeRegularize]
    }
    this.attendanceService.getAllRegularize(this.startDateRegularize, this.endDateRegularize, this.departmentRegularize, this.managerRegularize, this.regularizeStatusFilter, employeeRegularize).toPromise()
      .then(res => {
        this.getAllRegularize = res
        this.isavailable = this.getAllRegularize.length > 0;
        this.isLoading = false
        this.dataSource2 = new MatTableDataSource(this.getAllRegularize);
        this.dataSource2.paginator = this.paginator;
        this.dataSource2.sort = this.sort;
        this.dataLength = this.getAllRegularize.length;
        this.selection2.clear();
      }).catch(err => this.alertNotificationService.alertError(err))
  }

  regularizeExport() {
    var data = [];
    if (this.dataSource2) {
      data = this.dataSource2.filteredData;
    } else {
      this.alertNotificationService.alertInfo("No Data Found to Export");
      return;
    }
    var title = 'Regularize Attendance';
    data.forEach(e => {
      e.approveAt = e.approveAt ? new Date(e.approveAt) : null,
        e.request_date = e.request_date ? new Date(e.request_date) : null,
        e.attendance_date = e.attendance_date ? new Date(e.attendance_date) : null
    })
    this.exportService.exportonesheet(title, data);
  }

  regularizeFilterSearch(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource2.filter = filterValue.trim().toLowerCase();

    if (this.dataSource2.paginator) {
      this.dataSource2.paginator.firstPage();
    }
  }

  leaveFilter() {
    this.isLoading = true
    let employeeLeave = null;
    if (this.employeeLeave) {
      employeeLeave = [this.employeeLeave]
    }
    this.attendanceService.getLeaverequest(this.startDateLeave, this.endDateLeave, this.departmentLeave, this.managerLeave, employeeLeave, this.managerStatusLeave, this.hrLeaveFilter).toPromise()
      .then(res => {
        this.getLeaverequest = res
        this.isavailable = this.getLeaverequest.length > 0;
        this.isLoading = false
        this.dataSource3 = new MatTableDataSource(this.getLeaverequest);
        this.dataSource3.paginator = this.paginator;
        this.dataSource3.sort = this.sort;
        this.dataLength = this.getLeaverequest.length;
        this.selection3.clear();
      }).catch(err => this.alertNotificationService.alertError(err))
  }

  leaveExport() {
    var data = [];
    if (this.dataSource3) {
      data = this.dataSource3.filteredData;
    } else {
      this.alertNotificationService.alertInfo("No Data Found to Export");
      return;
    }
    var title = 'Leave';
    data.forEach(e => {
      e.hrApprovedAt = e.hrApprovedAt ? new Date(e.hrApprovedAt) : null,
        e.managerApproveAt = e.managerApproveAt ? new Date(e.managerApproveAt) : null,
        e.fromDate = e.fromDate ? new Date(e.fromDate) : null,
        e.toDate = e.toDate ? new Date(e.toDate) : null,
        e.request_date = e.request_date ? new Date(e.request_date) : null
    })
    this.exportService.exportonesheet(title, data);
  }

  leaveFilterSearch(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource3.filter = filterValue.trim().toLowerCase();

    if (this.dataSource3.paginator) {
      this.dataSource3.paginator.firstPage();
    }
  }

  //Attendance
  getPageData() {
    if (this.dataSource)
      return this.dataSource._pageData(this.dataSource._orderData(this.dataSource.filteredData)).filter(e => !e.isApprove);
    return []
  }
  isEntirePageSelected() {
    return this.getPageData().every((row) => this.selection.isSelected(row));
  }
  isAllSelected() {
    if (this.dataSource) {
      const numSelected = this.selection.selected.length;
      const numRows = this.dataSource.filteredData.length;
      return numSelected === numRows;
    }
    return false
  }
  masterToggle() {
    this.isEntirePageSelected() ?
      this.selection.deselect(...this.getPageData()) :
      this.selection.select(...this.getPageData());
  }
  checkboxLabel(row?, i?): string {
    if (!row) {
      return `${this.isEntirePageSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${i}`;
  }

  // Regularize
  getPageData2() {
    if (this.dataSource2)
      return this.dataSource2._pageData(this.dataSource2._orderData(this.dataSource2.filteredData)).filter(e => !e.isApprove && !e.isReject);
    return []
  }
  isEntirePageSelected2() {
    return this.getPageData2().every((row) => this.selection2.isSelected(row));
  }

  masterToggle2() {
    this.isEntirePageSelected2() ?
      this.selection2.deselect(...this.getPageData2()) :
      this.selection2.select(...this.getPageData2());
    console.log(this.selection2)
  }
  checkboxLabel2(row?, i?): string {
    if (!row) {
      return `${this.isEntirePageSelected2() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection2.isSelected(row) ? 'deselect' : 'select'} row ${i}`;
  }

  //Leave

  getPageData3() {
    if (this.dataSource3)
      return this.dataSource3._pageData(this.dataSource3._orderData(this.dataSource3.filteredData))
    return []
  }
  isEntirePageSelected3() {
    return this.getPageData3().every((row) => this.selection3.isSelected(row));
  }

  masterToggle3() {
    this.isEntirePageSelected3() ?
      this.selection3.deselect(...this.getPageData3()) :
      this.selection3.select(...this.getPageData3());
  }
  checkboxLabel3(row?, i?): string {
    if (!row) {
      return `${this.isEntirePageSelected3() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection3.isSelected(row) ? 'deselect' : 'select'} row ${i}`;
  }

  // Attendance
  approveAttendance(component) {
    this.modalService.open(component, { size: 'md', scrollable: true, centered: true, backdrop: 'static' }).result
      .then(resp => {
        this.alertNotificationService.alertCustomMsg('Are you sure you want to approve ' + this.selection.selected.length + ' attendances?')
          .then(result => {
            if (result.isConfirmed) {
              var data = {
                ids: this.selection.selected.filter(e => e._id).map(e => e._id),
                comments: this.comments ? this.comments : "",
              }
              this.attendanceService.approveAttendance(data).toPromise()
                .then(res => {
                  this.alertNotificationService.toastAlertSuccess('Approved Successfully');
                  this.selection.clear()
                  this.comments = null;
                  this.attendanceFilter();
                }).catch(err => this.alertNotificationService.alertError(err))
            }
          })
      }).catch(err => console.log(err));
  }

  editAttandance() {
    const modalRef = this.modalService.open(ModalSetAttendanceComponent, {
      size: 'md',
      scrollable: true,
      centered: true
    });
    modalRef.componentInstance.customData = {
      ClickedDate: null
    };
    modalRef.result
      .then(resp => {
        if (resp) {
          this.alertNotificationService.alertCustomMsg(`are you sure you want to edit ${this.selection?.selected?.length} Attendance?`)
          var data = {
            ids: this.selection.selected.filter(e => e._id).map(e => e._id),
            attendance: resp.attendance,
            attendanceTime: resp.attendanceTime
          }
          this.attendanceService.editAttendance(data).toPromise()
            .then(res => {
              this.alertNotificationService.toastAlertSuccess('Attendance Edited Succesfully');
              this.attendanceFilter()
              this.selection.clear()
              this.comments = '';
            }).catch(err => this.alertNotificationService.alertError(err));
        }
      }).catch(err => console.log(err));
  }

  deleteAttendance() {
    this.alertNotificationService.alertCustomMsg('Are you sure you want to delete ' + this.selection.selected.length + ' attendance?')
      .then(result => {
        if (result.isConfirmed) {
          var data = {
            ids: this.selection.selected.filter(e => e._id).map(e => e._id),
          }
          var id = data.ids.toString();
          this.attendanceService.deleteAttendance(id).toPromise()
            .then(res => {
              this.alertNotificationService.toastAlertSuccess('Attendance Deleted Successfully');
              this.selection.clear()
              this.attendanceFilter()
              this.comments = '';
            }).catch(err => this.alertNotificationService.alertError(err))
        }
      })
  }

  //Regularize
  approveRegularize(component) {
    this.modalService.open(component, { size: 'md', scrollable: true, centered: true, }).result
      .then(resp => {
        this.alertNotificationService.alertCustomMsg('Do you want to Approve ' + this.selection2.selected.length + ' Regularize request ?')
          .then(result => {
            if (result.isConfirmed) {
              var data = {
                ids: this.selection2.selected.filter(e => e._id).map(e => e._id),
                comments: this.comments ? this.comments : "",
                isApprove: true,
                isReject: false,
              }
              this.attendanceService.approveRegularize(data).toPromise()
                .then(res => {
                  this.alertNotificationService.toastAlertSuccess('Approved Successfully');
                  this.selection2.clear();
                  this.regularizeFilter();
                  this.comments = '';
                }).catch(err => this.alertNotificationService.alertError(err))
            }
          })
      }).catch(err => console.log(err));
  }

  rejectRegularize(component) {
    this.modalService.open(component, { size: 'md', scrollable: true, centered: true, }).result
      .then(resp => {
        this.alertNotificationService.alertCustomMsg('Do you want to reject ' + this.selection2.selected.length + ' Regularize Request?')
          .then(result => {
            if (result.isConfirmed) {
              var data = {
                ids: this.selection2.selected.filter(e => e._id).map(e => e._id),
                comments: this.comments ? this.comments : "",
                isApprove: false,
                isReject: true,
              }
              this.attendanceService.approveRegularize(data).toPromise()
                .then(res => {
                  this.alertNotificationService.toastAlertSuccess('Rejected Successfully');
                  this.selection2.clear()
                  this.regularizeFilter()
                  this.comments = '';
                }).catch(err => this.alertNotificationService.alertError(err))
            }
          })
      }).catch(err => console.log(err));
  }

  editRegularizeAttendance(component) {
    this.regularize = this.selection2.selected[0];
    this.modalService.open(component, { size: 'md', scrollable: true, centered: true, backdrop: 'static' }).result
      .then(resp => {
        if (resp == 'Save') {
          this.alertNotificationService.alertChanges()
            .then(result => {
              if (result.isConfirmed) {
                this.regularize.device = {
                  device: this.deviceInfo.Device,
                  browser: this.deviceInfo.Browser,
                }
                this.attendanceService.postRegularize([this.regularize]).toPromise()
                  .then(res => {
                    this.alertNotificationService.toastAlertSuccess('Regulariza Attendance Edited Succesfully');
                    this.selection2.clear()
                    this.regularizeFilter()
                  }).catch(err => this.alertNotificationService.alertError(err));
              }
            })
        }
      }).catch(err => console.log(err));
  }

  deleteRegularizerequest() {
    this.alertNotificationService.alertCustomMsg('Do you want to Delete ' + this.selection2.selected.length + ' Regularize request ?')
      .then(result => {
        if (result.isConfirmed) {
          var data = {
            ids: this.selection2.selected.filter(e => e._id).map(e => e._id),
          }
          this.attendanceService.deleteRegularizerequest(data).toPromise()
            .then(res => {
              this.alertNotificationService.toastAlertSuccess('Regularize Request Delete Successfully');
              this.selection2.clear()
              this.regularizeFilter()
              this.comments = '';
            }).catch(err => this.alertNotificationService.alertError(err))
        }
      })
  }

  // Leave
  approveLeaverequest(component) {
    this.modalService.open(component, { size: 'md', scrollable: true, centered: true, }).result
      .then(resp => {
        this.alertNotificationService.alertCustomMsg('Do you want to Approve ' + this.selection3.selected.length + ' Leave request ?')
          .then(result => {
            if (result.isConfirmed) {
              let data = {
                ids: this.selection3.selected.filter(e => e._id).map(e => e._id),
                comments: this.comments ? this.comments : "",
                isApproveManager: true,
                isApproveHr: true,
                isRejectManager: false,
                isRejectHr: false,
              }
              this.attendanceService.approveLeaverequest(data).toPromise()
                .then(res => {
                  this.alertNotificationService.toastAlertSuccess('Approved Successfully');
                  this.selection3.clear()
                  this.leaveFilter()
                  this.comments = '';
                }).catch(err => this.alertNotificationService.alertError(err))
            }
          })

      }).catch(err => console.log(err));
  }
  rejectLeaveRequest(component) {
    this.modalService.open(component, { size: 'md', scrollable: true, centered: true, }).result
    .then(resp => {
      this.alertNotificationService.alertCustomMsg('Do you want to Reject ' + this.selection3.selected.length + ' Leave request ?')
        .then(result => {
          if (result.isConfirmed) {
            let data = {
              ids: this.selection3.selected.filter(e => e._id).map(e => e._id),
              comments: this.comments ? this.comments : "",
              isRejectManager: true,
              isRejectHr: true,
              isApproveManager: false,
              isApproveHr: false,
            }
            this.attendanceService.approveLeaverequest(data).toPromise()
              .then(res => {
                this.alertNotificationService.toastAlertSuccess('Rejected Successfully');
                this.selection3.clear()
                this.leaveFilter()
                this.comments = '';
              }).catch(err => this.alertNotificationService.alertError(err))
          }
        })

    }).catch(err => console.log(err));
  }
  deleteLeaverequest() {
    this.alertNotificationService.alertCustomMsg('Do you want to Delete ' + this.selection3.selected.length + ' Leave request ?')
      .then(result => {
        if (result.isConfirmed) {
          var data = {
            ids: this.selection3.selected.filter(e => e._id).map(e => e._id),
          }
          this.attendanceService.deleteLeaverequest(data).toPromise()
            .then(res => {
              this.alertNotificationService.toastAlertSuccess('Leave Request Delete Successfully');
              this.selection3.clear()
              this.leaveFilter()
            }).catch(err => this.alertNotificationService.alertError(err))

        }
      })
  }

  StaffSearchFn(term: string, item: Employee) {
    term = term.toLowerCase();
    return item.fullName.toLowerCase().indexOf(term) > -1 || item.invid.toLowerCase().indexOf(term) > -1;
  }
  
}

