import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AlertNotificationsService } from 'src/app/services/alert-notifications.service';
import { ExportService } from 'src/app/services/export.service';
import { SellsService } from 'src/app/services/sells.service';
import { roundOff } from 'src/app/utility/roundOff';

@Component({
  selector: 'app-insignia-report-h',
  templateUrl: './insignia-report-h.component.html',
  styleUrls: ['./insignia-report-h.component.scss']
})
export class InsigniaReportHComponent implements OnInit {

  constructor(
    private sellsService: SellsService,
    private alertNotificationService: AlertNotificationsService,
    private exportService: ExportService,
  ) { }
  isLoading = false
  isavailable = true
  allData: any[] = []
  filterQuery = "";
  rowsOnPage = 10;
  sortBy = "start date";
  sortOrder = "desc";
  today = Date();
  dataLength;
  displayedColumns: string[] = [];
  dataSource: MatTableDataSource<any>;
  startDate: string = null
  endDate: string = null
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  async ngOnInit() {
    this.displayedColumns = ["Lead_Owner", "Promoted_BCMB", "Other_Source", "Total_Assigned","BCMB_Attempted_Count","Other_Source_Attempted_Count", "Attempted_Count", "Seat_Booked_Fresh", "Seat_Booked_Existing",
      "Seat_Booked_Total", "Insignia_Conv", "Course_Conv", "Product_Conv", "Total_Conv", "Pipeline_Fresh", "Pipeline_Existing", "Pipeline_Total", "Fresh",
      "Not_Connected", "Not_Converted", "BCMB_Demo_Given", "Other_Source_Demo_Given", "Demo_Given"];
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
    await this.sellsService.insigniaReport8(this.startDate, this.endDate).toPromise()
      .then(res => {
        this.allData = res as any[];
        this.dataSource = new MatTableDataSource(this.allData);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.dataLength = this.allData.length;
        this.isavailable = this.allData.length > 0;
        this.isLoading = false
        this.calculate();
      }).catch(err => this.alertNotificationService.alertError(err));
  }
  total_Promoted_BCMB = 0;
  total_Other_Source = 0;
  total_Total_Assigned = 0;
  total_Seat_Booked_Fresh = 0;
  total_Seat_Booked_Existing = 0;
  total_Seat_Booked_Total = 0;
  total_Insignia_Conv = 0;
  total_Course_Conv = 0;
  total_Product_Conv = 0;
  total_Pipeline_Fresh = 0;
  total_Pipeline_Existing = 0;
  total_Pipeline_Total = 0;
  total_Fresh = 0;
  total_Not_Connected = 0;
  total_Not_Converted = 0;
  total_Demo_Given = 0;
  total_Total_Conv = 0;
  total_Attempted_Count = 0;
  total_BCMB_Attempted_Count = 0;
  total_Other_Source_Attempted_Count = 0;
  total_BCMB_Demo_Given = 0;
  total_Other_Source_Demo_Given = 0;
  calculate() {
    if (this.dataSource) {
      this.total_Promoted_BCMB = this.dataSource.filteredData.filter(f => f.Promoted_BCMB).map(e => e.Promoted_BCMB).reduce((acc, value) => Number(acc) + Number(value), 0);
      this.total_Other_Source = this.dataSource.filteredData.filter(f => f.Other_Source).map(e => e.Other_Source).reduce((acc, value) => Number(acc) + Number(value), 0);
      this.total_Total_Assigned = this.dataSource.filteredData.filter(f => f.Total_Assigned).map(e => e.Total_Assigned).reduce((acc, value) => Number(acc) + Number(value), 0);
      this.total_Seat_Booked_Fresh = this.dataSource.filteredData.filter(f => f.Seat_Booked_Fresh).map(e => e.Seat_Booked_Fresh).reduce((acc, value) => Number(acc) + Number(value), 0);
      this.total_Seat_Booked_Existing = this.dataSource.filteredData.filter(f => f.Seat_Booked_Existing).map(e => e.Seat_Booked_Existing).reduce((acc, value) => Number(acc) + Number(value), 0);
      this.total_Seat_Booked_Total = this.dataSource.filteredData.filter(f => f.Seat_Booked_Total).map(e => e.Seat_Booked_Total).reduce((acc, value) => Number(acc) + Number(value), 0);
      this.total_Insignia_Conv = this.dataSource.filteredData.filter(f => f.Insignia_Conv).map(e => e.Insignia_Conv).reduce((acc, value) => Number(acc) + Number(value), 0);
      this.total_Course_Conv = this.dataSource.filteredData.filter(f => f.Course_Conv).map(e => e.Course_Conv).reduce((acc, value) => Number(acc) + Number(value), 0);
      this.total_Product_Conv = this.dataSource.filteredData.filter(f => f.Product_Conv).map(e => e.Product_Conv).reduce((acc, value) => Number(acc) + Number(value), 0);
      this.total_Pipeline_Fresh = this.dataSource.filteredData.filter(f => f.Pipeline_Fresh).map(e => e.Pipeline_Fresh).reduce((acc, value) => Number(acc) + Number(value), 0);
      this.total_Pipeline_Existing = this.dataSource.filteredData.filter(f => f.Pipeline_Existing).map(e => e.Pipeline_Existing).reduce((acc, value) => Number(acc) + Number(value), 0);
      this.total_Pipeline_Total = this.dataSource.filteredData.filter(f => f.Pipeline_Total).map(e => e.Pipeline_Total).reduce((acc, value) => Number(acc) + Number(value), 0);
      this.total_Fresh = this.dataSource.filteredData.filter(f => f.Fresh).map(e => e.Fresh).reduce((acc, value) => Number(acc) + Number(value), 0);
      this.total_Not_Connected = this.dataSource.filteredData.filter(f => f.Not_Connected).map(e => e.Not_Connected).reduce((acc, value) => Number(acc) + Number(value), 0);
      this.total_Not_Converted = this.dataSource.filteredData.filter(f => f.Not_Converted).map(e => e.Not_Converted).reduce((acc, value) => Number(acc) + Number(value), 0);
      this.total_Demo_Given = this.dataSource.filteredData.filter(f => f.Demo_Given).map(e => e.Demo_Given).reduce((acc, value) => Number(acc) + Number(value), 0);
      this.total_Total_Conv = this.dataSource.filteredData.filter(f => f.Total_Conv).map(e => e.Total_Conv).reduce((acc, value) => Number(acc) + Number(value), 0);
      this.total_Attempted_Count = this.dataSource.filteredData.filter(f => f.Attempted_Count).map(e => e.Attempted_Count).reduce((acc, value) => Number(acc) + Number(value), 0);
      this.total_BCMB_Attempted_Count = this.dataSource.filteredData.filter(f => f.BCMB_Attempted_Count).map(e => e.BCMB_Attempted_Count).reduce((acc, value) => Number(acc) + Number(value), 0);
      this.total_Other_Source_Attempted_Count = this.dataSource.filteredData.filter(f => f.Other_Source_Attempted_Count).map(e => e.Other_Source_Attempted_Count).reduce((acc, value) => Number(acc) + Number(value), 0);
      this.total_BCMB_Demo_Given = this.dataSource.filteredData.filter(f => f.BCMB_Demo_Given).map(e => e.BCMB_Demo_Given).reduce((acc, value) => Number(acc) + Number(value), 0);
      this.total_Other_Source_Demo_Given = this.dataSource.filteredData.filter(f => f.Other_Source_Demo_Given).map(e => e.Other_Source_Demo_Given).reduce((acc, value) => Number(acc) + Number(value), 0);
    } else {
      this.total_Promoted_BCMB = 0;
      this.total_Other_Source = 0;
      this.total_Total_Assigned = 0;
      this.total_Seat_Booked_Fresh = 0;
      this.total_Seat_Booked_Existing = 0;
      this.total_Seat_Booked_Total = 0;
      this.total_Insignia_Conv = 0;
      this.total_Course_Conv = 0;
      this.total_Product_Conv = 0;
      this.total_Pipeline_Fresh = 0;
      this.total_Pipeline_Existing = 0;
      this.total_Pipeline_Total = 0;
      this.total_Fresh = 0;
      this.total_Not_Connected = 0;
      this.total_Not_Converted = 0;
      this.total_Demo_Given = 0;
      this.total_Total_Conv = 0;
      this.total_Attempted_Count = 0;
    }

  }

  export() {
    if (this.dataSource) {
      this.exportService.exportonesheet('Insignia Running Report', this.dataSource.filteredData)
    }
    else {
      this.alertNotificationService.alertInfo('Insignia Running Report is Empty')
    }
  }


}
