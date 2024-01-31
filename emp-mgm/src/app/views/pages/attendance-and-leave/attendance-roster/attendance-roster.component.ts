import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbCalendar, NgbDate, NgbDateStruct, NgbDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import { Attendence, Department, Employee, ShiftRoster } from 'src/app/model/employee.model';
import { AlertNotificationsService } from 'src/app/services/alert-notifications.service';
import { AttendanceService } from 'src/app/services/attendance.service';
import { EmployeeService } from 'src/app/services/employee.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ExportService } from 'src/app/services/export.service';
import * as moment from 'moment';
import { ngbDateEqual, ngbDateBefore, ngbDateAfter } from 'src/app/utility/dateUtility';
import { SelectionModel } from '@angular/cdk/collections';
import { ShiftTimings, WorkLocation } from 'src/app/Enums/staticdata';
import { Holiday } from 'src/app/model/course.model';
import { courseService } from 'src/app/services/course.service';

@Component({
  selector: 'app-attendance-roster',
  templateUrl: './attendance-roster.component.html',
  styleUrls: ['./attendance-roster.component.scss']

})
export class AttendanceRosterComponent implements OnInit {


  hoveredDate: NgbDate | null = null;

  fromDate: NgbDateStruct;
  toDate: NgbDateStruct;


  datesSelected: any[] = [];

  shiftRoster: ShiftRoster = {
    _id: '',
    employee_id: '',
    shift: '',
    WorkLocation: ''
  }

  shiftTimings = ShiftTimings
  worklocation = WorkLocation
  Employees: Employee[];
  Departments: Department[];
  isLoading = false;
  employeeShiftRoaster: Attendence[];
  isavailable: boolean;
  dataLength: number;

  employeeFilter;
  managerFilter;
  departmentFilter;
  startDateFilter;
  endDateFilter;
  payload: any;
  isEdit: boolean;
  startDate;
  endDate;
  private _id: any;
  filterworkinglocation: any;

  constructor(calendar: NgbCalendar, private config: NgbDatepickerConfig,
    private attendanceService: AttendanceService,
    private alertNotificationService: AlertNotificationsService,
    private employeeService: EmployeeService,
    private exportService: ExportService,
    private CourseService: courseService,

  ) { }

  displayedColumns: string[];
  dataSource: MatTableDataSource<any>;

  selection = new SelectionModel<any>(true, []);
  filterQuery = 'all'
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  ngOnInit() {
    this.payload = this.employeeService.getUserPayload()
    this.displayedColumns = ['Select', 'employee_name', 'department', 'manager_name', 'Date', 'shift', 'working_location'];
    this.startDateFilter = moment().startOf('month').format('YYYY-MM-DD');
    this.endDateFilter = moment().endOf('month').format('YYYY-MM-DD');
    this.refresh();
    this.getholiday();
  }

  async refresh() {
    this.employeeService.getAllEmployees('all', null, null).toPromise()
      .then(res => {
        this.Employees = res;
        this.Employees = this.Employees.filter(e => e.isActive);
      }).catch(err => this.alertNotificationService.alertError(err));
    this.employeeService.getAllDepartment('all').toPromise()
      .then(res => {
        this.Departments = res as Department[];
      }).catch(err => this.alertNotificationService.alertError(err))

    this.employeeshifttimingsFilter();
  }


  onDateSelection(event: any, date: NgbDateStruct) {

    event.target.parentElement.blur();  //make that not appear the outline
    if (!this.fromDate && !this.toDate) {
      if (event.ctrlKey == true)  //If is CrtlKey pressed
        this.fromDate = date;
      else
        this.addDate(date);
    } else if (this.fromDate && !this.toDate && ngbDateAfter(date, this.fromDate)) {
      this.toDate = date;
      this.addRangeDate(this.fromDate, this.toDate);
      this.fromDate = null;
      this.toDate = null;
    } else {
      this.toDate = null;
      this.fromDate = date;
    }
  }

  addDate(date: NgbDateStruct) {
    let index = this.datesSelected.findIndex(f => f.day == date.day && f.month == date.month && f.year == date.year);
    if (index >= 0)       //If exist, remove the date
      this.datesSelected.splice(index, 1);
    else   //a simple push
      this.datesSelected.push(date);
  }
  addRangeDate(fromDate: NgbDateStruct, toDate: NgbDateStruct) {
    //We get the getTime() of the dates from and to
    let from = new Date(fromDate.year + "-" + fromDate.month + "-" + fromDate.day).getTime();
    let to = new Date(toDate.year + "-" + toDate.month + "-" + toDate.day).getTime();
    for (let time = from; time <= to; time += (24 * 60 * 60 * 1000)) //add one day
    {
      let date = new Date(time);
      //javascript getMonth give 0 to January, 1, to February...
      this.addDate({ year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate() });
    }
  }

  isDateSelected(date: NgbDateStruct) {
    return (this.datesSelected.findIndex(f => f.day == date.day && f.month == date.month && f.year == date.year) >= 0);
  }

  isHovered = date => this.fromDate && !this.toDate && this.hoveredDate && ngbDateAfter(date, this.fromDate) && ngbDateBefore(date, this.hoveredDate);
  isInside = date => ngbDateAfter(date, this.fromDate) && ngbDateBefore(date, this.toDate);
  isFrom = date => ngbDateEqual(date, this.fromDate);
  isTo = date => ngbDateEqual(date, this.toDate);
  resetDates() {
    this.toDate = null;
    this.endDate = null;
    this.fromDate = null;
    this.startDate = null;
    this.datesSelected = [];
  }


  submitForm(e: Event) {

    this.alertNotificationService.alertCustomMsg('Are you sure you want to Submit Shift Roster ?')
      .then(result => {
        if (result.isConfirmed) {
          var data = {
            _id: this._id,
            dates: this.datesSelected,
            employee_id: this.shiftRoster.employee_id,
            shift: this.shiftRoster.shift,
            working_location: this.shiftRoster.WorkLocation
          }
          this.attendanceService.shiftTimingsEmployees(data).toPromise()
            .then(_res => {
              this.alertNotificationService.toastAlertSuccess('Submit Succesfully');
              this.resetDates();
              this.shiftRoster.employee_id = '';
              this.shiftRoster.shift = '';
              this.employeeshifttimingsFilter();

            }).catch(err => this.alertNotificationService.alertError(err));
        }
      })


  }



  editshiftroster(shiftroster) {
    this.isEdit = true
    this.shiftRoster.shift = shiftroster.shift;
    this._id = shiftroster._id;
    this.shiftRoster.employee_id = shiftroster.employee_id;
  }



  getPageData() {
    if (this.dataSource)
      return this.dataSource._pageData(this.dataSource._orderData(this.dataSource.filteredData));
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



  deleteshiftroster() {
    this.alertNotificationService.alertCustomMsg('Do you want to Delete ' + this.selection.selected.length + ' Shift Roster request ?')
      .then(result => {
        if (result.isConfirmed) {
          var data = {
            ids: this.selection.selected.filter(e => e._id).map(e => e._id),
          }
          this.attendanceService.deleteShiftRoster(data).toPromise()
            .then(res => {
              this.alertNotificationService.toastAlertSuccess('Shift Roster Request Delete Successfully');
              this.selection.clear()
              this.employeeshifttimingsFilter()
            }).catch(err => this.alertNotificationService.alertError(err))

        }
      })
  }

  Approveshiftroster() {
    if (this.filterQuery !== 'pending') {
      this.alertNotificationService.alertInfo('Please Filter by Status Pending')
      return;
    }
    this.alertNotificationService.alertCustomMsg('Do you want to Approve ' + this.selection.selected.length + ' Shift Roster request ?')
      .then(result => {
        if (result.isConfirmed) {
          var data = {
            ids: this.selection.selected.filter(e => !e.isApprove && e._id).map(e => e._id),
          }
          this.attendanceService.ApproveShiftRoster(data).toPromise()
            .then(res => {
              this.alertNotificationService.toastAlertSuccess('Shift Roster Request Approve Successfully');
              this.selection.clear()
              this.employeeshifttimingsFilter()
            }).catch(err => this.alertNotificationService.alertError(err))

        }
      })
  }


  shifttimingsFilterSearch(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }


  employeeshifttimingsFilter() {
    this.attendanceService.getAllShifttimings(this.startDateFilter, this.endDateFilter, this.departmentFilter, this.managerFilter, this.employeeFilter, this.filterQuery, this.filterworkinglocation).toPromise()
      .then(res => {
        this.employeeShiftRoaster = res
        this.isavailable = this.employeeShiftRoaster.length > 0;
        this.isLoading = false
        this.dataSource = new MatTableDataSource(this.employeeShiftRoaster);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.dataLength = this.employeeShiftRoaster.length;
        this.selection.clear()
      }).catch(err => this.alertNotificationService.alertError(err))
  }
  allholiday: Holiday[]
  companyHoliday: Holiday[]
  async getholiday() {
    await this.CourseService.getHoliday().toPromise()
      .then(res => {
        this.allholiday = res as Holiday[];
        this.companyHoliday = this.allholiday.filter(f=> f.type == 'Company Holiday');

      }).catch(err => this.alertNotificationService.alertError(err))
  }
  isHoliday(date: NgbDate): boolean {
    if (!this.companyHoliday || this.companyHoliday.length === 0) {
      return false;
    }
    return this.companyHoliday.some((holiday: Holiday) => {
      const holidayDate = new Date(holiday.date);
      return (
        holidayDate.getFullYear() === date.year &&
        holidayDate.getMonth() === date.month - 1 &&
        holidayDate.getDate() === date.day
      );
    });
  }
  
  shifttimingsExport() {
    var data = [];
    if (this.dataSource) {
      data = this.dataSource.filteredData;
    } else {
      this.alertNotificationService.alertInfo("No Data Found to Export");
      return;
    }
    var title = 'Shift Roster';
    data.forEach(e => {
      e.approveAt = e.isApprove ? new Date(e.approveAt) : null;
      e.Date = e.Date ? new Date(e.Date) : null
    })
    this.exportService.exportonesheet(title, data);
  }


  StaffSearchFn(term: string, item: Employee) {
    term = term.toLowerCase();
    return item.fullName.toLowerCase().indexOf(term) > -1 || item.invid.toLowerCase().indexOf(term) > -1;
  }

}
