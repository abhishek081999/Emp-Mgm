import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AlertNotificationsService } from 'src/app/services/alert-notifications.service';
import { ExportService } from 'src/app/services/export.service';
import { SellsService } from 'src/app/services/sells.service';

@Component({
  selector: 'app-insignia-report-i',
  templateUrl: './insignia-report-i.component.html',
  styleUrls: ['./insignia-report-i.component.scss']
})
export class InsigniaReportIComponent implements OnInit {

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
    this.displayedColumns = ["student_name", "email", "phone", "whatsapp", "Insignia_Series_1", "Insignia_Series_2", "Insignia_Series_3", "Insignia_Series_4", "Insignia_Series_5",
      "Insignia_Series_6", "Insignia_Series_7", "Insignia_Series_8", "Insignia_Series_9", "Insignia_Series_10", "Insignia_Personalized"];
    this.refresh();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  async refresh() {
    this.isLoading = true
    await this.sellsService.insigniaReport9().toPromise()
      .then(res => {
        this.allData = res as any[];
        this.dataSource = new MatTableDataSource(this.allData);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.dataLength = this.allData.length;
        this.isavailable = this.allData.length > 0;
        this.isLoading = false
      }).catch(err => this.alertNotificationService.alertError(err));
  }

  export() {
    if (this.dataSource) {
      this.exportService.exportonesheet('Insignia Student vs Insignia', this.dataSource.filteredData)
    }
    else {
      this.alertNotificationService.alertInfo('Insignia Report 3 is Empty')
    }
  }


}
