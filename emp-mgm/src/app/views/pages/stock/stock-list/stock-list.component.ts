import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { StockInstruments } from 'src/app/model/stockinstruments.model';
import { AlertNotificationsService } from 'src/app/services/alert-notifications.service';
import { StocksService } from 'src/app/services/stocks.service';

@Component({
  selector: 'app-stock-list',
  templateUrl: './stock-list.component.html',
  styleUrls: ['./stock-list.component.scss']
})
export class StockListComponent implements OnInit {



  allData: Array<StockInstruments> = [];
  filterQuery = "";
  rowsOnPage = 10;
  sortBy = "date";
  sortOrder = "desc";
  today = Date();
  dataLength;
  displayedColumns: string[];
  dataSource: MatTableDataSource<StockInstruments>;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private stockService: StocksService,
    private alertNotificationService: AlertNotificationsService,
  ) { }

  isavailable = true
  isLoading = false
  ngOnInit() {
    this.displayedColumns = ["exchange", "name", "tradingsymbol", "market_cap", "sector_name", "last_price", "last_synced"];
    this.refreshlist();
  }

  async refreshlist() {
    this.isLoading = true
    await this.stockService.getStocks().toPromise()
      .then(res => {
        this.allData = res
      }).catch(err => this.alertNotificationService.alertError(err));

    this.isavailable = this.allData.length > 0;
    this.isLoading = false
    this.dataSource = new MatTableDataSource(this.allData.reverse());
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataLength = this.allData.length;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
