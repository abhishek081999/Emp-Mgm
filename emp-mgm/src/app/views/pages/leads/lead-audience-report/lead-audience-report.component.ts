import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AlertNotificationsService } from 'src/app/services/alert-notifications.service';
import { ExportService } from 'src/app/services/export.service';
import { LeadsService } from 'src/app/services/leads.service';
import {
  ChartComponent,
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
  ApexTitleSubtitle,
} from "ng-apexcharts";
import { Leads } from 'src/app/model/leads.model';
import { AgeRange, Occupations, YearOfExperiences } from 'src/app/Enums/staticdata';

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

export class exportData {
  category: string;
  male: number;
  female: number;
  others_or_unknown: number;
}
@Component({
  selector: 'app-lead-audience-report',
  templateUrl: './lead-audience-report.component.html',
  styleUrls: ['./lead-audience-report.component.scss'],
  providers: [DatePipe]
})
export class LeadAudienceReportComponent implements OnInit {
  isLoading = false
  isavailable = true
  allLeads: Leads[] = [];
  groupedReport1 = new Map<string, any[]>();
  groupedReport2 = new Map<string, any[]>();
  groupedReport3 = new Map<string, any[]>();
  groupedReport4 = new Map<string, any[]>();
  groupedReport1_conv = new Map<string, any[]>();
  groupedReport2_conv = new Map<string, any[]>();
  groupedReport3_conv = new Map<string, any[]>();
  groupedReport4_conv = new Map<string, any[]>();
  experienceData = []
  experienceDatafinal = []
  agerangeData = []
  agerangeDatafinal = []
  occupationData = []
  occupationDatafinal = []
  stateData = []
  stateDatafinal = []
  experienceData_conv = []
  experienceDatafinal_conv = []
  agerangeData_conv = []
  agerangeDatafinal_conv = []
  occupationData_conv = []
  occupationDatafinal_conv = []
  stateData_conv = []
  stateDatafinal_conv = []
  monthslabels = []
  explist = YearOfExperiences
  occulist = Occupations
  agelist = AgeRange
  constructor(
    private leadService: LeadsService,
    private datePipe: DatePipe,
    private alertNotificationService: AlertNotificationsService,
    private exportService: ExportService) {
    this.barChartOptions1 = {
      series: [
        {
          name: GenderEnum.Male,
          data: []
        }, {
          name: GenderEnum.Female,
          data: []
        }, {
          name: 'Others/Unknown',
          data: []
        }
      ],
      colors: ["#008ffb", '#00e396', '#feb019'],
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
        categories: this.explist
      }
    };
    this.barChartOptions2 = {
      series: [
        {
          name: GenderEnum.Male,
          data: []
        }, {
          name: GenderEnum.Female,
          data: []
        }, {
          name: 'Others/Unknown',
          data: []
        }
      ],
      colors: ["#008ffb", '#00e396', '#feb019'],
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
        categories: this.occulist
      }
    };
    this.barChartOptions3 = {
      series: [
        {
          name: GenderEnum.Male,
          data: []
        }, {
          name: GenderEnum.Female,
          data: []
        }, {
          name: 'Others/Unknown',
          data: []
        }
      ],
      colors: ["#008ffb", '#00e396', '#feb019'],
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
        categories: this.agelist
      }
    };
    this.barChartOptions1_conv = {
      series: [
        {
          name: GenderEnum.Male,
          data: []
        }, {
          name: GenderEnum.Female,
          data: []
        }, {
          name: 'Others/Unknown',
          data: []
        }
      ],
      colors: ["#008ffb", '#00e396', '#feb019'],
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
        categories: this.explist
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return val.toFixed(2) + "%";
          }
        }
      },
      yaxis: {
        labels: {
          show: true,
          formatter: function (val) {
            return val.toFixed(2) + "%";
          }
        }
      },
      dataLabels: {
        enabled: false,
        formatter: function (val) {
          return val.toFixed(2) + "%";
        }
      },
    };
    this.barChartOptions2_conv = {
      series: [
        {
          name: GenderEnum.Male,
          data: []
        }, {
          name: GenderEnum.Female,
          data: []
        }, {
          name: 'Others/Unknown',
          data: []
        }
      ],
      colors: ["#008ffb", '#00e396', '#feb019'],
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
        categories: this.occulist
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return val.toFixed(2) + "%";
          }
        }
      },
      yaxis: {
        labels: {
          show: true,
          formatter: function (val) {
            return val.toFixed(2) + "%";
          }
        }
      },
      dataLabels: {
        enabled: false,
        formatter: function (val) {
          return val.toFixed(2) + "%";
        }
      },
    };
    this.barChartOptions3_conv = {
      series: [
        {
          name: GenderEnum.Male,
          data: []
        }, {
          name: GenderEnum.Female,
          data: []
        }, {
          name: 'Others/Unknown',
          data: []
        }
      ],
      colors: ["#008ffb", '#00e396', '#feb019'],
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
        categories: this.agelist
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return val.toFixed(2) + "%";
          }
        }
      },
      yaxis: {
        labels: {
          show: true,
          formatter: function (val) {
            return val.toFixed(2) + "%";
          }
        },

      },
      dataLabels: {
        enabled: false,
        formatter: function (val) {
          return val.toFixed(2) + "%";
        },
      },
    };
  }

  public barChartOptions1: Partial<ChartOptions>;
  public barChartOptions2: Partial<ChartOptions>;
  public barChartOptions3: Partial<ChartOptions>;
  public barChartOptions1_conv: Partial<ChartOptions>;
  public barChartOptions2_conv: Partial<ChartOptions>;
  public barChartOptions3_conv: Partial<ChartOptions>;

  occupations = {
    name: 'Occupations',
    lists: []
  }

  ngOnInit(): void {
    this.refresh()
  }

  refresh() {
    this.isLoading = true
    this.leadService.getoccupations().toPromise()
      .then(res => {
        this.occupations = res as any;
        if (!this.occupations || !this.occupations.lists) {
          this.occupations = {
            name: 'Occupations',
            lists: []
          }
        }
        this.occulist = this.occupations.lists;
      }).catch(err => this.alertNotificationService.alertError(err))

    this.leadService.getallLead().toPromise()
      .then(res => {
        this.allLeads = res as Leads[]
        this.createData()
      }).catch(err => this.alertNotificationService.alertError(err));


  }

  createData() {
    this.allLeads.forEach(e => {
      this.experienceData.push({
        month: this.datePipe.transform(e.leaddate, "MMM-yy"),
        category: e.experience ? e.experience : 'Unknown',
        gender: e.gender ? e.gender : GenderEnum.Others,
        count: 1
      })
      this.agerangeData.push({
        month: this.datePipe.transform(e.leaddate, "MMM-yy"),
        category: e.dob ? this.calculateAge(e.dob) : 'Unknown',
        gender: e.gender ? e.gender : GenderEnum.Others,
        count: 1
      })
      this.occupationData.push({
        month: this.datePipe.transform(e.leaddate, "MMM-yy"),
        category: e.occupation ? e.occupation : 'Unknown',
        gender: e.gender ? e.gender : GenderEnum.Others,
        count: 1
      })
      /*this.stateData.push({
        month:this.datePipe.transform(e.leaddate, "MMM-yy"),
        category:e.state?e.state:'Unknown',
        gender: e.gender?e.gender:GenderEnum.Others,
        count:1
      })*/

      this.experienceData_conv.push({
        month: this.datePipe.transform(e.leadassigndate, "MMM-yy"),
        category: e.experience ? e.experience : 'Unknown',
        gender: e.gender ? e.gender : GenderEnum.Others,
        count: e.leadstatus == 'Converted' || e.leadstatus == 'Seat Booked' ? 1 : 0,
        lead: 1
      })
      this.agerangeData_conv.push({
        month: this.datePipe.transform(e.leadassigndate, "MMM-yy"),
        category: e.dob ? this.calculateAge(e.dob) : 'Unknown',
        gender: e.gender ? e.gender : GenderEnum.Others,
        count: e.leadstatus == 'Converted' || e.leadstatus == 'Seat Booked' ? 1 : 0,
        lead: 1
      })
      this.occupationData_conv.push({
        month: this.datePipe.transform(e.leadassigndate, "MMM-yy"),
        category: e.occupation ? e.occupation : 'Unknown',
        gender: e.gender ? e.gender : GenderEnum.Others,
        count: e.leadstatus == 'Converted' || e.leadstatus == 'Seat Booked' ? 1 : 0,
        lead: 1
      })
      /*this.stateData_conv.push({
        month:this.datePipe.transform(e.leadassigndate, "MMM-yy"),
        category:e.state?e.state:'Unknown',
        gender: e.gender?e.gender:GenderEnum.Others,
        count:e.leadstatus == 'Converted' || e.leadstatus == 'Seat Booked'?1:0
      })*/

    })
    this.monthslabels = [...new Set(this.experienceData.filter(f => f.month).map(e => e.month))]
    this.groupedReport1 = this.groupBy(this.experienceData, lead => lead.category);
    this.groupedReport2 = this.groupBy(this.occupationData, lead => lead.category);
    //this.groupedReport3 = this.groupBy(this.stateData, lead => lead.category);
    this.groupedReport4 = this.groupBy(this.agerangeData, lead => lead.category);
    this.groupedReport1_conv = this.groupBy(this.experienceData_conv, lead => lead.category);
    this.groupedReport2_conv = this.groupBy(this.occupationData_conv, lead => lead.category);
    //this.groupedReport3_conv = this.groupBy(this.stateData_conv, lead => lead.category);
    this.groupedReport4_conv = this.groupBy(this.agerangeData_conv, lead => lead.category);
    this.createexpData();
    this.createoccuData();
    //this.createstateData();
    this.createageData()
    this.createexpData_conv();
    this.createoccuData_conv();
    //this.createstateData_conv();
    this.createageData_conv()
    this.isavailable = this.allLeads.length > 0;

  }


  createexpData() {
    this.experienceDatafinal = []
    this.groupedReport1.forEach(data => {
      var m = data.filter(e => e.gender == GenderEnum.Male)
      var f = data.filter(e => e.gender == GenderEnum.Female)
      var o = data.filter(e => e.gender == GenderEnum.Others)
      var result: any[] = []
      m.reduce(function (res, value) {
        if (!res[value.month]) {
          res[value.month] = {
            category: value.category,
            month: value.month,
            gender: value.gender,
            count: 0,
          };
          result.push(res[value.month])
        }
        res[value.month].count += Number(value.count);
        return res;
      }, {});
      f.reduce(function (res, value) {
        if (!res[value.month]) {
          res[value.month] = {
            category: value.category,
            month: value.month,
            gender: value.gender,
            count: 0,
          };
          result.push(res[value.month])
        }
        res[value.month].count += Number(value.count);
        return res;
      }, {});
      o.reduce(function (res, value) {
        if (!res[value.month]) {
          res[value.month] = {
            category: value.category,
            month: value.month,
            gender: value.gender,
            count: 0,
          };
          result.push(res[value.month])
        }
        res[value.month].count += Number(value.count);
        return res;
      }, {});
      this.experienceDatafinal = this.experienceDatafinal.concat(result)
    })
  }
  createoccuData() {
    this.occupationDatafinal = []
    this.groupedReport2.forEach(data => {
      var m = data.filter(e => e.gender == GenderEnum.Male)
      var f = data.filter(e => e.gender == GenderEnum.Female)
      var o = data.filter(e => e.gender == GenderEnum.Others)
      var result: any[] = []
      m.reduce(function (res, value) {
        if (!res[value.month]) {
          res[value.month] = {
            category: value.category,
            month: value.month,
            gender: value.gender,
            count: 0,
          };
          result.push(res[value.month])
        }
        res[value.month].count += Number(value.count);
        return res;
      }, {});
      f.reduce(function (res, value) {
        if (!res[value.month]) {
          res[value.month] = {
            category: value.category,
            month: value.month,
            gender: value.gender,
            count: 0,
          };
          result.push(res[value.month])
        }
        res[value.month].count += Number(value.count);
        return res;
      }, {});
      o.reduce(function (res, value) {
        if (!res[value.month]) {
          res[value.month] = {
            category: value.category,
            month: value.month,
            gender: value.gender,
            count: 0,
          };
          result.push(res[value.month])
        }
        res[value.month].count += Number(value.count);
        return res;
      }, {});
      this.occupationDatafinal = this.occupationDatafinal.concat(result)
    })
  }
  createstateData() {
    this.stateDatafinal = []
    this.groupedReport1.forEach(data => {
      var m = data.filter(e => e.gender == GenderEnum.Male)
      var f = data.filter(e => e.gender == GenderEnum.Female)
      var o = data.filter(e => e.gender == GenderEnum.Others)
      var result: any[] = []
      m.reduce(function (res, value) {
        if (!res[value.month]) {
          res[value.month] = {
            category: value.category,
            month: value.month,
            gender: value.gender,
            count: 0,
          };
          result.push(res[value.month])
        }
        res[value.month].count += Number(value.count);
        return res;
      }, {});
      f.reduce(function (res, value) {
        if (!res[value.month]) {
          res[value.month] = {
            category: value.category,
            month: value.month,
            gender: value.gender,
            count: 0,
          };
          result.push(res[value.month])
        }
        res[value.month].count += Number(value.count);
        return res;
      }, {});
      o.reduce(function (res, value) {
        if (!res[value.month]) {
          res[value.month] = {
            category: value.category,
            month: value.month,
            gender: value.gender,
            count: 0,
          };
          result.push(res[value.month])
        }
        res[value.month].count += Number(value.count);
        return res;
      }, {});
      this.stateDatafinal = this.stateDatafinal.concat(result)
    })
  }
  createageData() {
    this.agerangeDatafinal = []
    this.groupedReport4.forEach(data => {
      var m = data.filter(e => e.gender == GenderEnum.Male)
      var f = data.filter(e => e.gender == GenderEnum.Female)
      var o = data.filter(e => e.gender == GenderEnum.Others)
      var result: any[] = []
      m.reduce(function (res, value) {
        if (!res[value.month]) {
          res[value.month] = {
            category: value.category,
            month: value.month,
            gender: value.gender,
            count: 0,
          };
          result.push(res[value.month])
        }
        res[value.month].count += Number(value.count);
        return res;
      }, {});
      f.reduce(function (res, value) {
        if (!res[value.month]) {
          res[value.month] = {
            category: value.category,
            month: value.month,
            gender: value.gender,
            count: 0,
          };
          result.push(res[value.month])
        }
        res[value.month].count += Number(value.count);
        return res;
      }, {});
      o.reduce(function (res, value) {
        if (!res[value.month]) {
          res[value.month] = {
            category: value.category,
            month: value.month,
            gender: value.gender,
            count: 0,
          };
          result.push(res[value.month])
        }
        res[value.month].count += Number(value.count);
        return res;
      }, {});
      this.agerangeDatafinal = this.agerangeDatafinal.concat(result)
    })
  }
  createexpData_conv() {
    this.experienceDatafinal_conv = []
    this.groupedReport1_conv.forEach(data => {
      var m = data.filter(e => e.gender == GenderEnum.Male)
      var f = data.filter(e => e.gender == GenderEnum.Female)
      var o = data.filter(e => e.gender == GenderEnum.Others)
      var result: any[] = []
      m.reduce(function (res, value) {
        if (!res[value.month]) {
          res[value.month] = {
            category: value.category,
            month: value.month,
            gender: value.gender,
            count: 0,
            lead: 0
          };
          result.push(res[value.month])
        }
        res[value.month].count += Number(value.count);
        res[value.month].lead += Number(value.lead);
        return res;
      }, {});
      f.reduce(function (res, value) {
        if (!res[value.month]) {
          res[value.month] = {
            category: value.category,
            month: value.month,
            gender: value.gender,
            count: 0,
            lead: 0
          };
          result.push(res[value.month])
        }
        res[value.month].count += Number(value.count);
        res[value.month].lead += Number(value.lead);
        return res;
      }, {});
      o.reduce(function (res, value) {
        if (!res[value.month]) {
          res[value.month] = {
            category: value.category,
            month: value.month,
            gender: value.gender,
            count: 0,
            lead: 0
          };
          result.push(res[value.month])
        }
        res[value.month].count += Number(value.count);
        res[value.month].lead += Number(value.lead);
        return res;
      }, {});
      this.experienceDatafinal_conv = this.experienceDatafinal_conv.concat(result)
    })
  }
  createoccuData_conv() {
    this.occupationDatafinal_conv = []
    this.groupedReport2_conv.forEach(data => {
      var m = data.filter(e => e.gender == GenderEnum.Male)
      var f = data.filter(e => e.gender == GenderEnum.Female)
      var o = data.filter(e => e.gender == GenderEnum.Others)
      var result: any[] = []
      m.reduce(function (res, value) {
        if (!res[value.month]) {
          res[value.month] = {
            category: value.category,
            month: value.month,
            gender: value.gender,
            count: 0,
            lead: 0
          };
          result.push(res[value.month])
        }
        res[value.month].count += Number(value.count);
        res[value.month].lead += Number(value.lead);
        return res;
      }, {});
      f.reduce(function (res, value) {
        if (!res[value.month]) {
          res[value.month] = {
            category: value.category,
            month: value.month,
            gender: value.gender,
            count: 0,
            lead: 0
          };
          result.push(res[value.month])
        }
        res[value.month].count += Number(value.count);
        res[value.month].lead += Number(value.lead);
        return res;
      }, {});
      o.reduce(function (res, value) {
        if (!res[value.month]) {
          res[value.month] = {
            category: value.category,
            month: value.month,
            gender: value.gender,
            count: 0,
            lead: 0
          };
          result.push(res[value.month])
        }
        res[value.month].count += Number(value.count);
        res[value.month].lead += Number(value.lead);
        return res;
      }, {});
      this.occupationDatafinal_conv = this.occupationDatafinal_conv.concat(result)
    })
  }
  createstateData_conv() {
    this.stateDatafinal_conv = []
    this.groupedReport1_conv.forEach(data => {
      var m = data.filter(e => e.gender == GenderEnum.Male)
      var f = data.filter(e => e.gender == GenderEnum.Female)
      var o = data.filter(e => e.gender == GenderEnum.Others)
      var result: any[] = []
      m.reduce(function (res, value) {
        if (!res[value.month]) {
          res[value.month] = {
            category: value.category,
            month: value.month,
            gender: value.gender,
            count: 0,
            lead: 0
          };
          result.push(res[value.month])
        }
        res[value.month].count += Number(value.count);
        res[value.month].lead += Number(value.lead);
        return res;
      }, {});
      f.reduce(function (res, value) {
        if (!res[value.month]) {
          res[value.month] = {
            category: value.category,
            month: value.month,
            gender: value.gender,
            count: 0,
            lead: 0
          };
          result.push(res[value.month])
        }
        res[value.month].count += Number(value.count);
        res[value.month].lead += Number(value.lead);
        return res;
      }, {});
      o.reduce(function (res, value) {
        if (!res[value.month]) {
          res[value.month] = {
            category: value.category,
            month: value.month,
            gender: value.gender,
            count: 0,
            lead: 0
          };
          result.push(res[value.month])
        }
        res[value.month].count += Number(value.count);
        res[value.month].lead += Number(value.lead);
        return res;
      }, {});
      this.stateDatafinal_conv = this.stateDatafinal_conv.concat(result)
    })
  }
  createageData_conv() {
    this.agerangeDatafinal_conv = []
    this.groupedReport4_conv.forEach(data => {
      var m = data.filter(e => e.gender == GenderEnum.Male)
      var f = data.filter(e => e.gender == GenderEnum.Female)
      var o = data.filter(e => e.gender == GenderEnum.Others)
      var result: any[] = []
      m.reduce(function (res, value) {
        if (!res[value.month]) {
          res[value.month] = {
            category: value.category,
            month: value.month,
            gender: value.gender,
            count: 0,
            lead: 0
          };
          result.push(res[value.month])
        }
        res[value.month].count += Number(value.count);
        res[value.month].lead += Number(value.lead);
        return res;
      }, {});
      f.reduce(function (res, value) {
        if (!res[value.month]) {
          res[value.month] = {
            category: value.category,
            month: value.month,
            gender: value.gender,
            count: 0,
            lead: 0
          };
          result.push(res[value.month])
        }
        res[value.month].count += Number(value.count);
        res[value.month].lead += Number(value.lead);
        return res;
      }, {});
      o.reduce(function (res, value) {
        if (!res[value.month]) {
          res[value.month] = {
            category: value.category,
            month: value.month,
            gender: value.gender,
            count: 0,
            lead: 0
          };
          result.push(res[value.month])
        }
        res[value.month].count += Number(value.count);
        res[value.month].lead += Number(value.lead);
        return res;
      }, {});
      this.agerangeDatafinal_conv = this.agerangeDatafinal_conv.concat(result)
    })
    this.isLoading = false
  }

  calculateAge(birthday1) {
    var birthday = new Date(birthday1)
    if (birthday && typeof birthday == 'object') {
      var ageDifMs = Date.now() - birthday.getTime();
      var ageDate = new Date(ageDifMs); // miliseconds from epoch
      var age = Math.abs(ageDate.getUTCFullYear() - 1970);
      if (age < 25) {
        return "18-24 Yr";
      } else if (age >= 25 && age < 35) {
        return '25-34 Yr'
      } else if (age >= 35 && age < 45) {
        return '35-44 Yr'
      } else if (age >= 45 && age < 55) {
        return '45-54 Yr'
      } else if (age >= 55) {
        return '55+ Yr'
      } else {
        return 'Unknown'
      }
    }
    return 'Unknown'
  }

  groupBy(list: any[], keyGetter) {
    const map = new Map<string, any[]>();
    list.forEach((item) => {
      const key = keyGetter(item);
      const collection = map.get(key);
      if (!collection) {
        map.set(key, [item]);
      } else {
        collection.push(item);
      }
    });
    return map;
  }
  month: string = null
  onchange1() {
    if (this.month) {
      this.experiencechart()
      this.occupationchart()
      this.agechart()
      this.experiencechart_conv()
      this.occupationchart_conv()
      this.agechart_conv()
    }
  }

  expchartData: exportData[] = []
  experiencechart() {
    this.expchartData = []
    var exp = this.experienceDatafinal.filter(e => e.month == this.month)
    var exp_male = new Array(this.explist.length); for (let i = 0; i < this.explist.length; ++i) exp_male[i] = 0;
    var exp_female = new Array(this.explist.length); for (let i = 0; i < this.explist.length; ++i) exp_female[i] = 0;
    var exp_others = new Array(this.explist.length); for (let i = 0; i < this.explist.length; ++i) exp_others[i] = 0;
    var i = 0
    exp.forEach(e => {
      i = this.explist.indexOf(e.category)
      if (i < 0) {
        i = this.explist.length - 1
      }
      if (e.gender == GenderEnum.Male) {
        exp_male[i] = e.count
      } else if (e.gender == GenderEnum.Female) {
        exp_female[i] = e.count
      } else {
        exp_others[i] = e.count
      }
    })
    this.barChartOptions1.series = [{
      name: GenderEnum.Male,
      data: exp_male
    }, {
      name: GenderEnum.Female,
      data: exp_female
    }, {
      name: 'Others/Unknown',
      data: exp_others
    }]
    var i = 0
    this.explist.forEach(e => {
      var ed = new exportData()
      ed.category = e
      ed.female = exp_female[i]
      ed.male = exp_male[i]
      ed.others_or_unknown = exp_others[i]
      this.expchartData.push(ed)
      i++;
    })
  }
  occuchartData: exportData[] = []
  occupationchart() {
    this.occuchartData = []
    var occu = this.occupationDatafinal.filter(e => e.month == this.month)
    var occu_male = new Array(this.occulist.length); for (let i = 0; i < this.occulist.length; ++i) occu_male[i] = 0;
    var occu_female = new Array(this.occulist.length); for (let i = 0; i < this.occulist.length; ++i) occu_female[i] = 0;
    var occu_others = new Array(this.occulist.length); for (let i = 0; i < this.occulist.length; ++i) occu_others[i] = 0;
    var i = 0
    occu.forEach(e => {
      i = this.occulist.indexOf(e.category)
      if (i < 0) {
        i = this.occulist.length - 1
      }
      if (e.gender == GenderEnum.Male) {
        occu_male[i] = e.count
      } else if (e.gender == GenderEnum.Female) {
        occu_female[i] = e.count
      } else {
        occu_others[i] = e.count
      }
    })
    this.barChartOptions2.series = [{
      name: GenderEnum.Male,
      data: occu_male
    }, {
      name: GenderEnum.Female,
      data: occu_female
    }, {
      name: 'Others/Unknown',
      data: occu_others
    }]
    var i = 0
    this.occulist.forEach(e => {
      var ed = new exportData()
      ed.category = e
      ed.female = occu_female[i]
      ed.male = occu_male[i]
      ed.others_or_unknown = occu_others[i]
      this.occuchartData.push(ed)
      i++;
    })
  }

  agechartData: exportData[] = []
  agechart() {
    this.agechartData = []
    var age = this.agerangeDatafinal.filter(e => e.month == this.month)
    var age_male = new Array(this.agelist.length); for (let i = 0; i < this.agelist.length; ++i) age_male[i] = 0;
    var age_female = new Array(this.agelist.length); for (let i = 0; i < this.agelist.length; ++i) age_female[i] = 0;
    var age_others = new Array(this.agelist.length); for (let i = 0; i < this.agelist.length; ++i) age_others[i] = 0;
    var i = 0
    age.forEach(e => {
      i = this.agelist.indexOf(e.category)
      if (i < 0) {
        i = this.agelist.length - 1
      }
      if (e.gender == GenderEnum.Male) {
        age_male[i] = e.count
      } else if (e.gender == GenderEnum.Female) {
        age_female[i] = e.count
      } else {
        age_others[i] = e.count
      }
    })
    this.barChartOptions3.series = [{
      name: GenderEnum.Male,
      data: age_male
    }, {
      name: GenderEnum.Female,
      data: age_female
    }, {
      name: 'Others/Unknown',
      data: age_others
    }]
    var i = 0
    this.agelist.forEach(e => {
      var ed = new exportData()
      ed.category = e
      ed.female = age_female[i]
      ed.male = age_male[i]
      ed.others_or_unknown = age_others[i]
      this.agechartData.push(ed)
      i++;
    })
  }

  expchartData_conv: exportData[] = []
  experiencechart_conv() {
    this.expchartData_conv = []
    var exp = this.experienceDatafinal_conv.filter(e => e.month == this.month)
    var exp_male = new Array(this.explist.length); for (let i = 0; i < this.explist.length; ++i) exp_male[i] = 0;
    var exp_female = new Array(this.explist.length); for (let i = 0; i < this.explist.length; ++i) exp_female[i] = 0;
    var exp_others = new Array(this.explist.length); for (let i = 0; i < this.explist.length; ++i) exp_others[i] = 0;
    var i = 0
    exp.forEach(e => {
      i = this.explist.indexOf(e.category)
      if (i < 0) {
        i = this.explist.length - 1
      }
      if (e.gender == GenderEnum.Male) {
        exp_male[i] = (e.count / e.lead) * 100
      } else if (e.gender == GenderEnum.Female) {
        exp_female[i] = (e.count / e.lead) * 100
      } else {
        exp_others[i] = (e.count / e.lead) * 100
      }
    })
    this.barChartOptions1_conv.series = [{
      name: GenderEnum.Male,
      data: exp_male
    }, {
      name: GenderEnum.Female,
      data: exp_female
    }, {
      name: 'Others/Unknown',
      data: exp_others
    }]
    var i = 0
    this.explist.forEach(e => {
      var ed = new exportData()
      ed.category = e
      ed.female = exp_female[i]
      ed.male = exp_male[i]
      ed.others_or_unknown = exp_others[i]
      this.expchartData_conv.push(ed)
      i++;
    })
  }

  occuchartData_conv: exportData[] = []
  occupationchart_conv() {
    this.occuchartData_conv = []
    var occu = this.occupationDatafinal_conv.filter(e => e.month == this.month)
    var occu_male = new Array(this.occulist.length); for (let i = 0; i < this.occulist.length; ++i) occu_male[i] = 0;
    var occu_female = new Array(this.occulist.length); for (let i = 0; i < this.occulist.length; ++i) occu_female[i] = 0;
    var occu_others = new Array(this.occulist.length); for (let i = 0; i < this.occulist.length; ++i) occu_others[i] = 0;
    var i = 0
    occu.forEach(e => {
      i = this.occulist.indexOf(e.category)
      if (i < 0) {
        i = this.occulist.length - 1
      }
      if (e.gender == GenderEnum.Male) {
        occu_male[i] = (e.count / e.lead) * 100
      } else if (e.gender == GenderEnum.Female) {
        occu_female[i] = (e.count / e.lead) * 100
      } else {
        occu_others[i] = (e.count / e.lead) * 100
      }
    })
    this.barChartOptions2_conv.series = [{
      name: GenderEnum.Male,
      data: occu_male
    }, {
      name: GenderEnum.Female,
      data: occu_female
    }, {
      name: 'Others/Unknown',
      data: occu_others
    }]
    var i = 0
    this.occulist.forEach(e => {
      var ed = new exportData()
      ed.category = e
      ed.female = occu_female[i]
      ed.male = occu_male[i]
      ed.others_or_unknown = occu_others[i]
      this.occuchartData_conv.push(ed)
      i++;
    })
  }

  agechartData_conv: exportData[] = []
  agechart_conv() {
    this.agechartData_conv = []
    var age = this.agerangeDatafinal_conv.filter(e => e.month == this.month)
    var age_male = new Array(this.agelist.length); for (let i = 0; i < this.agelist.length; ++i) age_male[i] = 0;
    var age_female = new Array(this.agelist.length); for (let i = 0; i < this.agelist.length; ++i) age_female[i] = 0;
    var age_others = new Array(this.agelist.length); for (let i = 0; i < this.agelist.length; ++i) age_others[i] = 0;
    var i = 0
    age.forEach(e => {
      i = this.agelist.indexOf(e.category)
      if (i < 0) {
        i = this.agelist.length - 1
      }
      if (e.gender == GenderEnum.Male) {
        age_male[i] = (e.count / e.lead) * 100
      } else if (e.gender == GenderEnum.Female) {
        age_female[i] = (e.count / e.lead) * 100
      } else {
        age_others[i] = (e.count / e.lead) * 100
      }
    })
    this.barChartOptions3_conv.series = [{
      name: GenderEnum.Male,
      data: age_male
    }, {
      name: GenderEnum.Female,
      data: age_female
    }, {
      name: 'Others/Unknown',
      data: age_others
    }]
    var i = 0
    this.agelist.forEach(e => {
      var ed = new exportData()
      ed.category = e
      ed.female = age_female[i]
      ed.male = age_male[i]
      ed.others_or_unknown = age_others[i]
      this.agechartData_conv.push(ed)
      i++;
    })
  }

  print() {
    var sheet = ['EXPERIENCE VS GENDER', 'OCCUPATION VS GENDER', 'AGE VS GENDER', 'EXPERIENCE VS GENDER(CONV RATE)', 'OCCUPATION VS GENDER(CONV RATE)', 'AGE VS GENDER(CONV RATE)']
    var data = [this.expchartData, this.occuchartData, this.agechartData, this.expchartData_conv, this.occuchartData_conv, this.agechartData_conv]
    this.exportService.createmultiplesheet(this.month, data, sheet)
  }

}
