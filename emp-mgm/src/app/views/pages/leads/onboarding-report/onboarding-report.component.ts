import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import * as moment from 'moment';
import { Employee } from 'src/app/model/employee.model';
import { OnboardingReport } from 'src/app/model/leads.model';
import { AlertNotificationsService } from 'src/app/services/alert-notifications.service';
import { EmployeeService } from 'src/app/services/employee.service';
import { ExportService } from 'src/app/services/export.service';
import { LeadsService } from 'src/app/services/leads.service';

@Component({
  selector: 'app-onboarding-report',
  templateUrl: './onboarding-report.component.html',
  styleUrls: ['./onboarding-report.component.scss']
})
export class OnboardingReportComponent implements OnInit {
  allOnboardData: OnboardingReport[] = [];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  rowsOnPage = 10;
  sortBy = "date";
  sortOrder = "desc";
  today = Date();
  dataLength;
  displayedColumns: string[];
  dataSource: MatTableDataSource<OnboardingReport>;
  constructor(
    private leadService: LeadsService,
    private alertNotificationService: AlertNotificationsService,
    private employeeService: EmployeeService,
    private exportService: ExportService
  ) { }

  isLoading = false
  isavailable = false
  allStaff: Employee[] = []
  ngOnInit(): void {
    this.displayedColumns = ["Staff_ID", "Student_id_gen_TAT_Count", "Student_id_gen_TAT_Maxtime", "Student_id_gen_TAT_Mintime",
      "Student_id_gen_TAT_Avgtime", "Student_id_gen_TAT_Ideal", "Student_id_gen_TAT_Due", "Student_id_gen_TAT_OverDue",
      "Telegram_joining_TAT_Count", "Telegram_joining_TAT_Maxtime", "Telegram_joining_TAT_Mintime", "Telegram_joining_TAT_Avgtime", "Telegram_joining_TAT_Ideal",
      "Telegram_joining_TAT_Due", "Telegram_joining_TAT_OverDue", "First_ins_TAT_Count", "First_ins_TAT_Maxtime",
      "First_ins_TAT_Mintime", "First_ins_TAT_Avgtime", "First_ins_TAT_Ideal", "First_ins_TAT_Due", "First_ins_TAT_OverDue",
      "Sec_ins_TAT_Count", "Sec_ins_TAT_Maxtime", "Sec_ins_TAT_Mintime", "Sec_ins_TAT_Avgtime", "Sec_ins_TAT_Ideal",
      "Sec_ins_TAT_Due", "Sec_ins_TAT_OverDue", "Third_ins_TAT_Count", "Third_ins_TAT_Maxtime", "Third_ins_TAT_Mintime",
      "Third_ins_TAT_Avgtime", "Third_ins_TAT_Ideal", "Third_ins_TAT_Due", "Third_ins_TAT_OverDue", "Forth_ins_TAT_Count", "Forth_ins_TAT_Maxtime", "Forth_ins_TAT_Mintime",
      "Forth_ins_TAT_Avgtime", "Forth_ins_TAT_Ideal", "Forth_ins_TAT_Due", "Forth_ins_TAT_OverDue"];
    this.employeeService.getAllEmployees('display', Departments.Support, null).toPromise()
      .then(res => {
        this.allStaff = res
      }).catch(err => this.alertNotificationService.alertError(err));
    this.refreshlist()
  }
  staff: string = null
  startDate: string = null
  endDate: string = null

  async refreshlist() {
    this.isLoading = true

    await this.leadService.onboardingtatreport(this.startDate, this.endDate, this.staff).toPromise()
      .then(res => {
        this.allOnboardData = res
        this.dataSource = new MatTableDataSource(this.allOnboardData);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }).catch(err => this.alertNotificationService.alertError(err));
    this.isavailable = this.allOnboardData.length > 0;
    this.isLoading = false
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getcount(s) {
    if (this.dataSource) {
      return this.dataSource.filteredData.filter(f => f[s]).map(e => e[s]).reduce((acc, value) => Number(acc) + Number(value), 0);
    } return 0
  }
  getcount1(s) {
    if (this.dataSource) {
      var a = this.dataSource.filteredData.filter(f => f[s]).map(e => e[s])
      return a.reduce((acc, value) => Number(acc) + Number(value), 0) / a.length;
    } return 0
  }

  getTimeDiff(date1: any, date2?: any) {
    if (date1 && date2) {
      return moment(date1).from(date2, true);
    } else if (date1) {
      return moment(date1).fromNow(true);
    }
    else null
  }

  day = 1440;
  hour = 60;
  time(t) {
    if (t > 0) {
      return Math.floor(t / this.day) + " Days " + Math.floor((t - Math.floor(t / this.day) * this.day) / this.hour) + " Hrs " + Math.floor((t - Math.floor(t / this.day) * this.day - Math.floor((t - Math.floor(t / this.day) * this.day) / this.hour) * this.hour)) + " Mins";
    } else {
      return null;
    }
  }

  export() {
    if (this.dataSource) {
      this.exportService.exportonesheet('Onboarding TAT Report', this.dataSource.filteredData)
    } else {
      this.alertNotificationService.alertInfo('No Onboarding Present')
    }
  }

  StaffSearchFn(term: string, item: Employee) {
    term = term.toLowerCase();
    return item.fullName.toLowerCase().indexOf(term) > -1 || item.invid.toLowerCase().indexOf(term) > -1;
  }
}
