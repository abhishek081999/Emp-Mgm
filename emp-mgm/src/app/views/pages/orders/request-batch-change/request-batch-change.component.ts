import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RequestBatchChange } from 'src/app/model/orders.model';
import { AlertNotificationsService } from 'src/app/services/alert-notifications.service';
import { OrdersService } from 'src/app/services/orders.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-request-batch-change',
  templateUrl: './request-batch-change.component.html',
  styleUrls: ['./request-batch-change.component.scss']
})
export class RequestBatchChangeComponent implements OnInit {

  allData: Array<RequestBatchChange> = [];
  rowsOnPage = 10;
  sortBy = "date";
  sortOrder = "desc";
  today = Date();
  dataLength;
  displayedColumns: string[];
  dataSource: MatTableDataSource<RequestBatchChange>;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private orderService: OrdersService,
    private alertNotificationService: AlertNotificationsService,
    private router: Router,
    private modalService: NgbModal
  ) { }

  isavailable = true
  isLoading = false
  filterQuery = 'pending'
  ngOnInit() {
    this.displayedColumns = ["orderID", "item_type", "item_code", "item_name", "requestedBy", "requestReason", "approvedBy", "comments", "options"];
    this.refreshlist();
  }

  async refreshlist() {
    this.isLoading = true
    await this.orderService.requestBatchChangeList(this.filterQuery).toPromise()
      .then(res => {
        this.allData = res as RequestBatchChange[]
      }).catch(err => this.alertNotificationService.alertError(err));

    this.isavailable = this.allData.length > 0;
    this.isLoading = false
    this.dataSource = new MatTableDataSource(this.allData);
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

  goToOrder(order: RequestBatchChange) {
    this.router.navigate(['/admin/orders', order.orderID]);
  }

  async approveRequest(RequestBatchChange: RequestBatchChange) {
    await Swal.fire({
      title: 'Enter Remarks/Comments*',
      inputAutoTrim: true,
      input: 'textarea',
      inputPlaceholder: 'Type your Remarks/Comments',
      showCancelButton:true,
      confirmButtonText: 'Approve'
    }).then(res => {
      if (res.value) {
        var data = {
          _id: RequestBatchChange._id,
          comments: res.value
        }
        this.orderService.approveRequestBatchChange(data).toPromise()
          .then(res => {
            this.alertNotificationService.toastAlertSuccess('Request Adjustment Approved');
            this.refreshlist();
          }).catch(err => this.alertNotificationService.alertError(err));
      }
    })
  }

  deleteRequest(RequestBatchChange: RequestBatchChange) {
    this.alertNotificationService.alertDelete()
    .then(result=>{
      if(result.isConfirmed){
        this.orderService.deleteRequestBatchChange(RequestBatchChange._id, RequestBatchChange.orderID).toPromise()
        .then(res => {
          this.alertNotificationService.toastAlertSuccess("Deleted Succesfully");
          this.refreshlist();
        }).catch(err => this.alertNotificationService.alertError(err));
      }
    });
  }

}
