import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { Transaction } from 'src/app/model/referral.model';
import { AlertNotificationsService } from 'src/app/services/alert-notifications.service';
import { ExportService } from 'src/app/services/export.service';
import { ReferralService } from 'src/app/services/referral.service';

@Component({
  selector: 'app-referral-transaction',
  templateUrl: './referral-transaction.component.html',
  styleUrls: ['./referral-transaction.component.scss']
})
export class ReferralTransactionComponent implements OnInit {
  dataSource: MatTableDataSource<Transaction>;
  isLoading = false
  pageSizeOptions = 25
  displayedColumns: string[];
  allData: Array<Transaction> = [];
  srtRange;
  toRange;
  filterType = []
  typefilter;
  filterTxnType = []
  txntypefilter;
  FilterbyStu = []
  stuFilter
  invid: string;

  constructor(
    private alertNotificationService: AlertNotificationsService,
    private exportService: ExportService,
    private referralService: ReferralService,
    private route: ActivatedRoute,


  ) { }
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  async ngOnInit() {

    this.route.paramMap.subscribe(params => {
      this.invid = params.get('id');
    });
    if(this.invid){
      this.stuFilter = this.invid;
      this.filter()
    }
    this.displayedColumns = ['user_name', 'details', 'txn_type', 'amount', 'date', 'type',];
    this.isLoading = true
    this.referralService.getReferralTransaction().toPromise()
      .then(res => {
        this.allData = res as Transaction[];
        this.filterType = [...new Set(this.allData.filter(e => e.type).map(e => e.type))];
        this.filterTxnType = [...new Set(this.allData.filter(e => e.txn_type).map(e => e.txn_type))];
        this.FilterbyStu = [...new Set(this.allData.filter(e => e.user_invid).map(e => e.user_invid))];
        this.filter()
        this.isLoading = false

      })
      .catch(err => this.alertNotificationService.alertError(err));

  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  filter() {
    var data = [...this.allData]
    if (this.srtRange && !this.toRange) {
      data = data.filter(e => moment(e.date).format('YYYY-MM-DD') == this.srtRange);
    }
    if (this.toRange && this.toRange) {
      data = data.filter(e => moment(e.date).format('YYYY-MM-DD') >= this.srtRange && moment(e.date).format('YYYY-MM-DD') <= this.toRange);
    }
    if (this.typefilter) {
      data = data.filter(e => e.type == this.typefilter);
    }
    if (this.txntypefilter) {
      data = data.filter(e => e.txn_type == this.txntypefilter);
    }
    if (this.stuFilter) {
      data = data.filter(e => e.user_invid == this.stuFilter);
    }
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  changePage() {
    this.paginator._changePageSize(this.paginator.pageSize);
  }
  export() {
    if (this.dataSource) {
      this.exportService.exportonesheet('Referral Transaction', this.dataSource.filteredData)
    }
    else {
      this.alertNotificationService.alertInfo('No Data to Export.')
    }
  }
 
}
