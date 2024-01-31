import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Leadstage, Leadreport, leadLevel, getLeadLevel } from 'src/app/model/leads.model';
import { AlertNotificationsService } from 'src/app/services/alert-notifications.service';
import { ExportService } from 'src/app/services/export.service';
import { LeadsService } from 'src/app/services/leads.service';

import {
  ApexAxisChartSeries,
  ApexGrid,
  ApexChart,
  ApexXAxis,
  ApexYAxis,
  ApexMarkers,
  ApexStroke,
  ApexLegend,
  ApexTooltip,
  ApexDataLabels,
  ApexFill,
  ApexPlotOptions,
  ApexResponsive,
  ApexNonAxisChartSeries,
  ApexTitleSubtitle
} from "ng-apexcharts";
import { roundOff } from 'src/app/utility/roundOff';
import { EmployeeService } from 'src/app/services/employee.service';
import { Team } from 'src/app/model/employee.model';
import { LeadLanguages, ShortMonths } from 'src/app/Enums/staticdata';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  nonAxisSeries: ApexNonAxisChartSeries;
  colors: string[];
  grid: ApexGrid;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  markers: ApexMarkers,
  stroke: ApexStroke,
  legend: ApexLegend,
  responsive: ApexResponsive[],
  tooltip: ApexTooltip,
  fill: ApexFill
  dataLabels: ApexDataLabels,
  plotOptions: ApexPlotOptions,
  labels: string[],
  title: ApexTitleSubtitle
};
@Component({
  selector: 'app-team-lead-report',
  templateUrl: './team-lead-report.component.html',
  styleUrls: ['./team-lead-report.component.scss']
})
export class TeamLeadReportComponent implements OnInit {
  alllang = LeadLanguages;
  Lang = null
  Level = null
  LeadLevelDrop: leadLevel[] = []
  allLevel: getLeadLevel[] = []
  isLoading = false
  isavailable = true
  allStages: Leadstage[]
  allData: any[] = []
  rowsOnPage = 10;
  sortBy = "start date";
  sortOrder = "desc";
  today = Date();
  dataLength;
  displayedColumns: string[];
  displayedColumns1: string[] = [];
  displayedColumns2: string[] = [];
  dataSource: MatTableDataSource<Leadreport>;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  public pieChartOptions1: Partial<ChartOptions>;
  public pieChartOptions2: Partial<ChartOptions>;
  public barChartOptions: Partial<ChartOptions>;
  public barChartOptions1: Partial<ChartOptions>;
  constructor(
    private leadService: LeadsService,
    private alertNotificationService: AlertNotificationsService,
    private employeeService: EmployeeService,
    private exportService: ExportService) {
    /**
   * Pie chart options
   */
    this.pieChartOptions1 = {
      nonAxisSeries: [0, 0, 0, 0, 0, 0],
      labels: ['Raw Leads', 'In Progress', 'Callbacks', 'Converted', 'Seat Booked', 'Poor Leads'],
      colors: ["#f77eb9", "#7ee5e5", "#4d8af0", "#fbbc06", "#a45a54", "#564ad5"],
      chart: {
        height: 300,
        type: "pie"
      },
      stroke: {
        colors: ['rgba(0,0,0,0)']
      },
      legend: {
        position: 'top',
        horizontalAlign: 'center'
      },
      dataLabels: {
        enabled: false
      }
    };
    this.pieChartOptions2 = {
      nonAxisSeries: [0, 0],
      colors: ["#f77eb9", "#7ee5e5"],
      labels: ['Attempted', 'Unattempted'],
      chart: {
        height: 300,
        type: "pie"
      },
      stroke: {
        colors: ['rgba(0,0,0,0)']
      },
      legend: {
        position: 'top',
        horizontalAlign: 'center'
      },
      dataLabels: {
        enabled: false
      }
    };
    this.barChartOptions = {
      series: [
        {
          name: 'Convertion Rate(%)',
          data: []
        }
      ],
      colors: ["#f77eb9"],
      grid: {
        borderColor: "rgba(77, 138, 240, .1)",
        padding: {
          bottom: 0
        }
      },
      chart: {
        type: 'bar',
        height: '320',
        parentHeightOffset: 0
      },
      xaxis: {
        type: 'category',
        categories: []
      }
    };
    this.barChartOptions1 = {
      series: [
        {
          name: 'Seat Booked Rate(%)',
          data: []
        }
      ],
      colors: ["#f77eb9"],
      grid: {
        borderColor: "rgba(77, 138, 240, .1)",
        padding: {
          bottom: 0
        }
      },
      chart: {
        type: 'bar',
        height: '320',
        parentHeightOffset: 0
      },
      xaxis: {
        type: 'category',
        categories: []
      }
    };
  }
  ngOnInit(): void {
    this.displayedColumns = ['teamname', 'teamlead', 'teamleadname', 'month', 'assigned', 'unattempted', 'attempted', 'retarget', 'demo_given'];
    this.displayedColumns2 = ['teamname', 'teamlead', 'teamleadname', 'month', 'assigned', 'unattempted', 'attempted', 'retarget', 'demo_given'];

    this.refresh();
  }
  allTeams: Team[] = []
  async refresh() {
    this.isLoading = true

    await this.employeeService.getAllTeams('display', Departments.Sales).toPromise()
      .then(res => {
        var teams = res[0]['teams'];
        this.allTeams = teams && teams.length > 0 ? teams : [];
      }).catch(err => this.alertNotificationService.alertError(err))

    await this.leadService.getleadstage().toPromise()
      .then(res => {
        this.allStages = res;
      }).catch(err => this.alertNotificationService.alertError(err))

    await this.leadService.getLevel().toPromise()
      .then(res => {
        this.allLevel = res as getLeadLevel[];
      }).catch(err => this.alertNotificationService.alertError(err))
    this.isavailable = this.allData.length > 0;
    this.isLoading = false
  }

  months = ShortMonths
  monthdisplay(s) {
    if (s) {
      return this.months[Number(s.split('-')[0]) - 1] + '-' + s.split('-')[1];
    }
    return s;
  }

  getcount(s) {
    if (this.dataSource)
      return this.dataSource.filteredData.filter(f => f[s]).map(e => e[s]).reduce((acc, value) => Number(acc) + Number(value), 0);
    return 0
  }
  getcount1(s) {
    if (this.dataSource) {
      var a = this.dataSource.filteredData.filter(f => f[s]).map(e => e[s])
      return roundOff(a.reduce((acc, value) => Number(acc) + Number(value), 0) / a.length);
    }
    return 0
  }

  displayData: any[] = []
  monthslabels = []
  onchange1() {
    this.createpiechart()
  }
  onChange() {
    if (this.Lang) {
      this.LeadLevelDrop = [];
      var obj = this.allLevel.find(f => this.Lang == f._id);
      this.LeadLevelDrop = obj ? obj.levels : [];
      if (this.LeadLevelDrop.length == 0) {
        this.Level = null;
      }
    }
  }
  async submit() {
    await this.leadService.displayteamsLeadreports(this.teamname, this.Lang, this.Level).toPromise()
      .then(res => {
        this.allData = res as any[];
        this.allData.forEach(e => e.month = this.monthdisplay(e.month))
        console.log(this.allData)
      }).catch(err => this.alertNotificationService.alertError(err))
    if (this.teamname) {
      this.displayData = [...this.allData]
      this.monthslabels = this.displayData.filter(f => f.month).map(e => e.month)
      this.dataSource = new MatTableDataSource(this.displayData);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.dataLength = this.allData.length;
      this.displayedColumns = [... new Set(this.displayedColumns2)];
      this.displayedColumns1 = []
      this.allStages.forEach(e => {
        if (e.leadLevelID == this.Level) {
          this.displayedColumns1.push(e.name.replace(' ', '_'))
        }
      })
      this.displayedColumns = [... new Set(this.displayedColumns.concat(this.displayedColumns1))];
      this.displayedColumns = [... new Set(this.displayedColumns.concat(['Seat_Booked_Rate', 'Partially_Converted_Rate', 'Convertion_Rate']))]
      this.createpiechart()
    } else {
      this.displayData = []
    }
    // this.createconvertionchart()
    // this.createseatbookedchart()
  }
  createconvertionchart() {
    if (this.teamname) {
      var convertion = this.displayData.filter(f => f.month).map(e => e.Convertion_Rate)
      var category = this.displayData.filter(f => f.month).map(e => e.month)
      this.barChartOptions.series = [{ 'name': 'Convertion Rate(%)', data: convertion }]
      var xaxis: ApexXAxis = {
        type: "category",
        categories: category,
        labels: {
          style: {
            colors: '#686868',
            fontSize: '13px',
            fontFamily: 'Overpass, sans-serif',
            fontWeight: 400,
          },
        },
        axisBorder: {
          show: false
        }
      }
      this.barChartOptions.xaxis = xaxis
    } else {
      this.barChartOptions.series = [{ 'name': 'Convertion Rate(%)', data: [] }]
      var xaxis: ApexXAxis = {
        type: "category",
        categories: [],
        labels: {
          style: {
            colors: '#686868',
            fontSize: '13px',
            fontFamily: 'Overpass, sans-serif',
            fontWeight: 400,
          },
        },
        axisBorder: {
          show: false
        }
      }
      this.barChartOptions.xaxis = xaxis
    }
  }
  createseatbookedchart() {
    if (this.teamname) {
      var convertion = this.displayData.filter(f => f.month).map(e => e.Seat_Booked_Rate)
      var category = this.displayData.filter(f => f.month).map(e => e.month)
      this.barChartOptions1.series = [{ 'name': 'Seat Booked Rate(%)', data: convertion }]
      var xaxis: ApexXAxis = {
        type: "category",
        categories: category,
        labels: {
          style: {
            colors: '#686868',
            fontSize: '13px',
            fontFamily: 'Overpass, sans-serif',
            fontWeight: 400,
          },
        },
        axisBorder: {
          show: false
        }
      }
      this.barChartOptions1.xaxis = xaxis
    } else {
      this.barChartOptions1.series = [{ 'name': 'Seat Booked Rate(%)', data: [] }]
      var xaxis: ApexXAxis = {
        type: "category",
        categories: [],
        labels: {
          style: {
            colors: '#686868',
            fontSize: '13px',
            fontFamily: 'Overpass, sans-serif',
            fontWeight: 400,
          },
        },
        axisBorder: {
          show: false
        }
      }
      this.barChartOptions1.xaxis = xaxis
    }
  }
  month: string = ''
  createpiechart() {
    if (this.teamname && this.month) {
      var data = this.displayData.filter(e => e.teamname == this.teamname && e.month == this.month)[0]
      this.pieChartOptions2.nonAxisSeries = [data.attempted, data.unattempted]
      this.pieChartOptions1.labels = [...this.displayedColumns1]
      this.displayedColumns1.forEach(e => {
        this.pieChartOptions1.nonAxisSeries.push(data[e])
      })
    } else {
      this.pieChartOptions2.nonAxisSeries = [0, 0]
      this.pieChartOptions1.nonAxisSeries = []
    }
  }

  teamname: string = ''
  export() {
    var data = this.allData.filter((e) => e.teamname == this.teamname)
    if (data.length > 0) {
      this.exportService.exportonesheet(this.teamname + '_Leads Report', data)
    }
    else {
      this.alertNotificationService.alertInfo('Team Leads Report is Empty')
    }
  }

  applyFilter(event: Event) {
    try {
      const filterValue = (event.target as HTMLInputElement).value;
      this.dataSource.filter = filterValue.trim().toLowerCase();

      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
    } catch (error) {
      this.alertNotificationService.alertInfo('Select Team')
    }
  }

}
