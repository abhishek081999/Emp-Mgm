import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertNotificationsService } from 'src/app/services/alert-notifications.service';
import { ExportService } from 'src/app/services/export.service';
import { SellsService } from 'src/app/services/sells.service';
import { roundOff } from 'src/app/utility/roundOff';
import { LeadChangeLogComponent } from '../../leads/lead-change-log/lead-change-log.component';

@Component({
  selector: 'app-insignia-report-d',
  templateUrl: './insignia-report-d.component.html',
  styleUrls: ['./insignia-report-d.component.scss']
})
export class InsigniaReportDComponent implements OnInit {

  constructor(
    private sellsService: SellsService,
    private alertNotificationService: AlertNotificationsService,
    private exportService: ExportService,
    public modalService: NgbModal
  ) { }
  isLoading = false
  isavailable = true
  allData: any[] = []
  studentdata: any[] = []
  filterQuery = "";
  rowsOnPage = 10;
  sortBy = "start date";
  sortOrder = "desc";
  today = Date();
  dataLength;
  displayedColumns: string[] = [];
  dataSource: MatTableDataSource<any>;
  displayedColumnsstudentdata: string[] = [];
  dataSourcestudentdata: MatTableDataSource<any>;
  year
  month
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

  bcmbactive = [
    'Yes',
    'No'
  ];

  insigniaopted = [
    'Yes',
    'No'
  ];

  insigniaconverted = [
    'Yes',
    'No'
  ];

  bcmbactiveStatusFilter = null;
  insigniaoptedStatusFilter = null;
  insigniaconvertedStatusFilter = null;
  coursecodefilter = null;
  coursecodes: any[] = []

  async ngOnInit() {
    this.displayedColumns = ['coursecode', 'batch_start', 'instructor', 'bcmb_count', 'bcmb_active_count', 'insignia_opted', 'insignia_converted', 'insignia_opted_conv', 'advance_opted', 'advance_opted_conv', 'product_opted', 'product_opted_conv'];
    this.displayedColumnsstudentdata = ['coursecode', 'instructor', 'student_fullname', 'bcmb_active', 'insignia_opted', 'insignia_converted', 'employee_fullname', 'insignia_employee_fullname', 'insignia_teamlead', 'leadstatus', 'logs'];

    for (var i = 2020; i <= new Date().getFullYear(); i++) {
      this.yearList.push(i)
    }
    this.yearList.reverse();
  }

  applyFilter(event: Event) {
    try {
      const filterValue = (event.target as HTMLInputElement).value;
      this.dataSource.filter = filterValue.trim().toLowerCase();

      this.calculate();
      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
    } catch (error) {
      this.alertNotificationService.alertInfo('Select Date')
    }
  }

  async submit() {
    this.isLoading = true
    await this.sellsService.insigniaReport4(this.month, this.year).toPromise()
      .then(res => {
        this.allData = res as any[];
        this.coursecodes = this.allData.filter(e => e.coursecode).map(e => e.coursecode)
        this.dataSource = new MatTableDataSource(this.allData);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.dataLength = this.allData.length;
        this.isavailable = this.allData.length > 0;
        this.isLoading = false
        this.calculate();
      }).catch(err => this.alertNotificationService.alertError(err));

    await this.sellsService.insigniaReport4studentdata(this.month, this.year).toPromise()
      .then(res => {
        this.studentdata = res as any[];
        this.Filter()
      }).catch(err => this.alertNotificationService.alertError(err));
  }
  total_bcmb_count = 0;
  total_bcmb_active_count = 0;
  total_insignia_opted = 0;
  total_insignia_opted_conv = 0;
  total_advance_opted = 0;
  total_advance_opted_conv = 0;
  total_product_opted = 0;
  total_product_opted_conv = 0;
  total_insignia_converted = 0;
  calculate() {
    if (this.dataSource) {
      this.total_bcmb_count = this.dataSource.filteredData.filter(f => f.bcmb_count).map(e => e.bcmb_count).reduce((acc, value) => Number(acc) + Number(value), 0);
      this.total_bcmb_active_count = this.dataSource.filteredData.filter(f => f.bcmb_active_count).map(e => e.bcmb_active_count).reduce((acc, value) => Number(acc) + Number(value), 0);
      this.total_insignia_opted = this.dataSource.filteredData.filter(f => f.insignia_opted).map(e => e.insignia_opted).reduce((acc, value) => Number(acc) + Number(value), 0);
      this.total_insignia_converted = this.dataSource.filteredData.filter(f => f.insignia_converted).map(e => e.insignia_converted).reduce((acc, value) => Number(acc) + Number(value), 0);
      this.total_insignia_opted_conv = roundOff(this.total_insignia_opted / this.total_bcmb_active_count);
      this.total_advance_opted = this.dataSource.filteredData.filter(f => f.advance_opted).map(e => e.advance_opted).reduce((acc, value) => Number(acc) + Number(value), 0);
      this.total_advance_opted_conv = roundOff(this.total_advance_opted / this.total_bcmb_active_count);
      this.total_product_opted = this.dataSource.filteredData.filter(f => f.product_opted).map(e => e.product_opted).reduce((acc, value) => Number(acc) + Number(value), 0);
      this.total_product_opted_conv = roundOff(this.total_product_opted / this.total_bcmb_active_count);
    } else {
      this.total_bcmb_count = 0;
      this.total_insignia_opted = 0;
      this.total_bcmb_active_count = 0;
      this.total_insignia_opted_conv = 0;
      this.total_advance_opted = 0;
      this.total_advance_opted_conv = 0;
      this.total_product_opted = 0;
      this.total_product_opted_conv = 0;
    }

  }

  export() {
    if (this.dataSource) {
      this.exportService.exportonesheet('BCMB to INSG Batchwise Report', this.dataSource.filteredData)
    }
    else {
      this.alertNotificationService.alertInfo('BCMB to INSG Batchwise Report is Empty')
    }
  }


  // ---------------> Students Data <---------------
  Filter() {
    var data = [...this.studentdata]
    if (this.insigniaconvertedStatusFilter) {
      data = data.filter(e => e.insignia_converted == this.insigniaconvertedStatusFilter);
    }
    if (this.insigniaoptedStatusFilter) {
      data = data.filter(e => e.insignia_opted == this.insigniaoptedStatusFilter);
    }
    if (this.bcmbactiveStatusFilter) {
      data = data.filter(e => e.bcmb_active == this.bcmbactiveStatusFilter);
    }
    if (this.coursecodefilter) {
      data = data.filter(e => e.coursecode == this.coursecodefilter);
    }
    this.dataSourcestudentdata = new MatTableDataSource(data);
    this.dataSourcestudentdata.paginator = this.paginator;
    this.dataSourcestudentdata.sort = this.sort;

  }

  applyFilterstudents(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourcestudentdata.filter = filterValue.trim().toLowerCase();

    if (this.dataSourcestudentdata.paginator) {
      this.dataSourcestudentdata.paginator.firstPage();
    }
  }

  exportstudents() {
    if (this.dataSourcestudentdata) {
      this.exportService.exportonesheet('BCMB to INSG Students Report', this.dataSourcestudentdata.filteredData)
    }
    else {
      this.alertNotificationService.alertInfo('BCMB to INSG Students Report is Empty')
    }
  }

  isnottagged(data) {
    return !data.insignia_employee_invid;
  }

  changehistory(id) {
    if (id) {
      const modalRef = this.modalService.open(LeadChangeLogComponent, { centered: true, scrollable: true, size: 'xl' })
      modalRef.componentInstance.id = id
      modalRef.result.then((result) => {
        if (result) {

        }
      }).catch(err => { })
    }
  }
}
