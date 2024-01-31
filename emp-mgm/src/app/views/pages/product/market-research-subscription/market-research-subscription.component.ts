import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { ProductSubscriptionView } from 'src/app/model/productpurchase.model';
import { AlertNotificationsService } from 'src/app/services/alert-notifications.service';
import { ExportService } from 'src/app/services/export.service';
import { PackageService } from 'src/app/services/package.service';

@Component({
  selector: 'app-market-research-subscription',
  templateUrl: './market-research-subscription.component.html',
  styleUrls: ['./market-research-subscription.component.scss'],
  providers: [DatePipe]
})
export class MarketResearchSubscriptionComponent implements OnInit {
  dataSource: MatTableDataSource<ProductSubscriptionView>;
  isLoading = false
  pageSizeOptions = 25
  displayedColumns: string[];
  srtRange;
  toRange;
  allproductpurchase: ProductSubscriptionView[] = []
  allData: ProductSubscriptionView[] = []
  exp: string = null
  activityFilter;
  FilterActivity: string[] = ['Active', 'Expired']
  constructor(
    private alertNotificationService: AlertNotificationsService,
    private exportService: ExportService,
    private productService: PackageService,
    private modalService: NgbModal,
    private datePipe: DatePipe,
    private packageService: PackageService,

  ) { }
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  async ngOnInit() {

    this.isLoading = true;
    this.displayedColumns = ['last_staff_id', 'studentinvid', 'product_code', 'total_revenue', 'net_revenue', 'gst', 'total_due', 'last_purchase', 'number_of_purchase', 'expiry_date', 'status'];
    await this.productService.getallproSubsView().toPromise()
      .then(res => {
        this.allproductpurchase = res;
        this.allData = this.allproductpurchase.filter(e => e.product_type == 'Market Research');
        this.allData.forEach(e => {
          e.expiry_date = e.expiry_date ? new Date(e.expiry_date) : e.expiry_date;
          e.last_purchase = e.last_purchase ? new Date(e.last_purchase) : e.last_purchase;
        })
        this.filter()
      })
      .catch(err => this.alertNotificationService.alertError(err));



    this.isLoading = false;

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
      data = data.filter(e => moment(e.expiry_date).format('YYYY-MM-DD') == this.srtRange);
    }
    if (this.toRange && this.toRange) {
      data = data.filter(e => moment(e.expiry_date).format('YYYY-MM-DD') >= this.srtRange && moment(e.expiry_date).format('YYYY-MM-DD') <= this.toRange);
    }
    if (this.activityFilter) {
      data = data.filter(e => e.status == this.activityFilter);
    }
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  changePage() {
    this.paginator._changePageSize(this.paginator.pageSize);
  }

  changeexpiry(content, pph: ProductSubscriptionView) {
    this.alertNotificationService.alertCustomMsg("Do you want to change Expiry date?")
      .then(result => {
        if (result.isConfirmed) {
          this.modalService.open(content, { centered: true }).result.then((result) => {
            if (result == 'Save') {
              if (pph.expiry_date) {
                this.exp = this.datePipe.transform(pph.expiry_date, 'yyyy-MM-dd')

              }
              var data = {
                expiry_date: this.exp,
                pruchasedate: pph.last_purchase
              }
              pph.expiry_date = new Date(this.exp);
              pph.isexpired = false;
              this.packageService.updateproexpiry(pph.id, data).toPromise()
                .then(res => { this.exp = null; this.alertNotificationService.toastAlertSuccess('Purchase History Updated') })
                .catch(err => this.alertNotificationService.alertError(err))
            }
          }).catch((res) => { this.exp = null });
        }
      })
  }
  export() {
    if (this.dataSource) {
      this.exportService.exportonesheet('market Research', this.dataSource.filteredData)
    }
    else {
      this.alertNotificationService.alertInfo('No Data to Export.')
    }
  }

}
