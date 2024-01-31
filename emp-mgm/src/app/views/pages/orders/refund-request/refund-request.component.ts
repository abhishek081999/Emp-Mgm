import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RefundRequest, Refunds } from 'src/app/model/refund.model';
import { AlertNotificationsService } from 'src/app/services/alert-notifications.service';
import { ExportService } from 'src/app/services/export.service';
import { OrdersService } from 'src/app/services/orders.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-refund-request',
  templateUrl: './refund-request.component.html',
  styleUrls: ['./refund-request.component.scss']
})
export class RefundRequestComponent implements OnInit {
  isLoading: boolean = false;
  displayedColumns: string[];
  dataSource: MatTableDataSource<RefundRequest>;
  refundreq: Array<Refunds> = [];
  dataLength;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  constructor(
    private orderService: OrdersService,
    private alertNotificationService: AlertNotificationsService,
    private userService: UserService,
    private exportService: ExportService,
    private modalService: NgbModal
  ) { }
  allStudent
  async ngOnInit() {

    this.displayedColumns = ['orderID', 'studentinvid', 'phone', 'refundtype', 'amount', 'name', 'remarks', 'requestDate', 'comment', 'approveDate', 'refund_complete_date', 'refund_txn_id', 'isApproved'];
    await this.userService.getStudents().toPromise()
      .then(res => {
        this.allStudent = res;
      })
      .catch(err => this.alertNotificationService.alertError(err))
    this.filter();
  }

  startdate: string = null
  enddate: string = null
  status: string = null
  refundtype: string = null
  student: string = null
  servicecode: string = null
  isapprove = [
    'Yes', 'No'
  ]
  refundTypeDrop = [
  ];

  filter() {
    this.isLoading = true;
    this.refundreq = [];
    this.orderService.getRefundRequest(this.startdate, this.enddate, this.status, this.refundtype, this.student, this.servicecode).toPromise()
      .then(res => {
        this.refundreq = res as Refunds[];
        this.isLoading = false;
        this.dataSource = new MatTableDataSource(this.refundreq);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.dataLength = this.refundreq.length;
      }).catch(err => this.alertNotificationService.alertError(err))
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  comments
  txn_id
  async approve(id, component) {
    const modalRef = this.modalService.open(component, { centered: true, scrollable: true, size: 'lg' })
    modalRef.result.then((result) => {
      if (result == 'Save') {
        this.alertNotificationService.alertCustomMsg("are you sure you want to refund?")
          .then(resulta => {
            if (resulta.isConfirmed) {
              var data = {
                _id: id,
                comments: this.comments,
                refund_txn_id: this.txn_id
              }
              this.orderService.approveRefund(data).toPromise()
                .then(res => {
                  this.alertNotificationService.toastAlertSuccess("Approved Succesfully");
                  this.filter();
                }).catch(err => this.alertNotificationService.alertError(err))
            }
          })
      }
    }).catch(err => { })
  }


  export() {
    this.exportService.exportonesheet('Refund Request', this.refundreq.reverse())
  }








}
