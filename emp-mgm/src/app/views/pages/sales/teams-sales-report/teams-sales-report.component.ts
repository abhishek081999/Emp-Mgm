import { Component, OnInit, ViewChild } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { Employee, Team } from "src/app/model/employee.model";
import { Teamsellsreport } from "src/app/model/sales.model";
import { AlertNotificationsService } from "src/app/services/alert-notifications.service";
import { EmployeeService } from "src/app/services/employee.service";
import { ExportService } from "src/app/services/export.service";
import { SellsService } from "src/app/services/sells.service";
import { roundOff } from "src/app/utility/roundOff";

@Component({
  selector: "app-teams-sales-report",
  templateUrl: "./teams-sales-report.component.html",
  styleUrls: ["./teams-sales-report.component.scss"]
})
export class TeamsSalesReportComponent implements OnInit {

  constructor(
    private sellsService: SellsService,
    private employeeService: EmployeeService,
    private alertNotificationService: AlertNotificationsService,
    private exportService: ExportService
  ) { }

  dataLength;
  displayedColumns: string[];
  dataSource: MatTableDataSource<Teamsellsreport>;
  teamsellsReport: Teamsellsreport[] = [];
  allEmployee: Employee[] = [];
  allTeams: Team[] = [];
  teamname: string = '';
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  yearList = []
  monthList = [{
    name: 'January',
    num: 1
  }, {
    name: 'February',
    num: 2
  }, {
    name: 'March',
    num: 3
  }, {
    name: 'April',
    num: 4
  }, {
    name: 'May',
    num: 5
  }, {
    name: 'June',
    num: 6
  }, {
    name: 'July',
    num: 7
  }, {
    name: 'August',
    num: 8
  }, {
    name: 'September',
    num: 9
  }, {
    name: 'October',
    num: 10
  }, {
    name: 'November',
    num: 11
  }, {
    name: 'December',
    num: 12
  }]
  ngOnInit() {
    this.displayedColumns = ["teamname", "teamlead", "teamleadname", "year", "month", "bookedamount", "paymentreceived", "gst", "due",];
    for (var i = 2020; i <= new Date().getFullYear(); i++) {
      this.yearList.push(i)
    }
    this.yearList.reverse();
    this.refresh();
  }
  month
  year
  isLoading: boolean;
  async refresh() {

    await this.employeeService.getAllEmployees("all", Departments.Sales, null).toPromise()
      .then((res) => (this.allEmployee = res))
      .catch((err) => this.alertNotificationService.alertError(err));

    await this.employeeService.getAllTeams("display", Departments.Sales).toPromise()
      .then((res) => {
        var teams = res[0]["teams"];
        this.allTeams = teams && teams.length > 0 ? teams : [];
      }).catch((err) => this.alertNotificationService.alertError(err));
  }

  onchange() {
    this.sellsService.getsellsTeamReport(this.teamname, this.month, this.year).toPromise()
      .then((res) => {
        this.teamsellsReport = res as [];
        this.isLoading = false;
        this.dataSource = new MatTableDataSource(this.teamsellsReport);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.dataLength = this.teamsellsReport.length;
        this.calculateamount();
      }).catch((err) => this.alertNotificationService.alertError(err));
  }

  totalbookedamount = 0;
  totaldue = 0;
  totalpaymentreceived = 0;
  totalgst = 0;
  calculateamount() {
    this.totalbookedamount = this.dataSource.filteredData
      .filter((f) => f.bookedamount)
      .map((e) => e.bookedamount)
      .reduce((acc, value) => Number(acc) + Number(value), 0);
    this.totaldue = this.dataSource.filteredData
      .filter((f) => f.due)
      .map((e) => e.due)
      .reduce((acc, value) => Number(acc) + Number(value), 0);
    this.totalpaymentreceived = this.dataSource.filteredData
      .filter((f) => f.paymentreceived)
      .map((e) => e.paymentreceived)
      .reduce((acc, value) => Number(acc) + Number(value), 0);
    this.totalgst = this.dataSource.filteredData
      .filter((f) => f.gst)
      .map((e) => e.gst)
      .reduce((acc, value) => roundOff(Number(acc) + Number(value)), 0);
  }

  export() {
    var data = this.teamsellsReport.filter((e) => e.teamname == this.teamname);
    if (data.length > 0) {
      this.exportService.exportonesheet(this.teamname + "_Sells Report", data);
    } else {
      this.alertNotificationService.alertInfo("Employee Sells Report is Empty");
    }
  }

  applyFilter(event: Event) {
    try {
      const filterValue = (event.target as HTMLInputElement).value;
      this.dataSource.filter = filterValue.trim().toLowerCase();

      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
      this.calculateamount();
    } catch (error) {
      this.alertNotificationService.alertInfo("Select Team");
    }
  }
}