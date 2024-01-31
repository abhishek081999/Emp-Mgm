import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Referrals, Transaction } from 'src/app/model/referral.model';
import { User } from 'src/app/model/user.model';
import { AlertNotificationsService } from 'src/app/services/alert-notifications.service';
import { ExportService } from 'src/app/services/export.service';
import { ReferralService } from 'src/app/services/referral.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-referral-details',
  templateUrl: './referral-details.component.html',
  styleUrls: ['./referral-details.component.scss']
})
export class ReferralDetailsComponent implements OnInit {
  isLoading = false
  dataSource: MatTableDataSource<Referrals>;
  pageSizeOptions = 25
  displayedColumns: string[];
  selection = new SelectionModel<Referrals>(true, []);
  allData: Array<Referrals> = [];
  txnType: string[] = ['CREDIT', 'DEBIT'];
  Type: string[] = ['BONUS', 'COURSE', 'PRODUCT', 'INSIGNIA'];
  actv: string[] = ['Active', 'Inactive']
  actvity
  transaction: Transaction = {
    _id: '',
    details: '',
    txn_type: '',
    amount: 0,
    date: null,
    type: '',
    user_name: '',
    user_invid: '',
    ids: []
  }
  allUser: User[] = []

  activityFilter;
  FilterActivity: string[] = ['Active', 'Inactive'];
  stuFilter
  FilterbyStu = [];
  refFilter;
  FilterbyRef = []
  constructor(
    private exportService: ExportService,
    private referralService: ReferralService,
    private alertNotificationService: AlertNotificationsService,
    private modalService: NgbModal,
    private userService: UserService,


  ) { }
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  ngOnInit() {
    this.displayedColumns = ['select', 'referal_code', 'user_name', 'referred_by_name', 'referal_link', 'invescash_earned', 'invescash_redeemed', 'current_balance', 'join_date', 'isActive'];
    this.refresh();
  }
  async refresh() {
    this.isLoading = true;
    await this.referralService.getReferral().toPromise()
      .then(res => {
        this.allData = res as Referrals[];
        this.FilterbyRef = [...new Set(this.allData.filter(e => e.referred_by_invid).map(e => e.referred_by_invid))];
        this.FilterbyStu = [...new Set(this.allData.filter(e => e.user_invid).map(e => e.user_invid))];

        // this.userService.getallUser().toPromise()
        //   .then(res => {
        //     this.allUser = res;
        //   }).catch(err => this.alertNotificationService.alertError(err))

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
    if (this.activityFilter == "Active") {

      data = data.filter(e => e.isActive == true);
    }
    else if (this.activityFilter == "Inactive") {

      data = data.filter(e => e.isActive == false);
    }
    if (this.refFilter) {
      data = data.filter(e => e.referred_by_invid == this.refFilter);
    }
    if (this.stuFilter) {
      data = data.filter(e => e.user_invid == this.stuFilter);
    }
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  addTransactionModal(content) {
    this.modalService.open(content, { centered: true, size: 'xl' })
      .result.then((result) => {
        if (result == 'Submit') {
          var id = this.selection.selected.map(e => e._id)
          var data = {
            details: this.transaction.details,
            txn_type: this.transaction.txn_type,
            amount: this.transaction.amount,
            date: this.transaction.date,
            type: this.transaction.type,
            ids: id
          }
          this.referralService.postNewTran(data).toPromise()
            .then(res => {
              this.alertNotificationService.toastAlertSuccess('Succesfully Added');
              this.selection.clear()
              this.refresh();

            })


        }
      })
      .catch(err => { })
  }
  ids: []
  amount: string = null
  type: string = null
  txn_type: string = null
  details: string = null
  date: Date = null

  exp: string = null

  changePage() {
    this.paginator._changePageSize(this.paginator.pageSize);
  }
  isActive = false
  Activity() {
    if (this.actvity) {
      this.alertNotificationService.alertCustomMsg('Do you want ' + this.actvity + ' ' + this.selection.selected.length + ' Referral ?')
        .then(res => {
          if (res.isConfirmed) {
            if (this.actvity == "Active") {
              this.isActive = true;
            }
            else if (this.actvity == "Inactive") {
              this.isActive = false;
            }
            var data = {
              ids: this.selection.selected.map(e => e._id),
              isActive: this.isActive
            }
            this.referralService.updateRef(data).toPromise()
              .then(res => {
                this.alertNotificationService.toastAlertSuccess('Succesfully Updated');
                this.selection.clear()
                this.refresh();

              })
          }
        })
    }
  }
  export() {
    if (this.dataSource) {
      this.exportService.exportonesheet('Referral Details', this.dataSource.filteredData)
    }
    else {
      this.alertNotificationService.alertInfo('No Data to Export.')
    }
  }
  isEntirePageSelected() {
    return this.getPageData().every((row) => this.selection.isSelected(row));
  }
  getPageData() {
    if (this.dataSource)
      return this.dataSource._pageData(this.dataSource._orderData(this.dataSource.filteredData));
    return []
  }

  checkboxLabel(row?, i?): string {
    if (!row) {
      return `${this.isEntirePageSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${i}`;
  }

  isAllSelected() {
    if (this.dataSource) {
      const numSelected = this.selection.selected.length;
      const numRows = this.dataSource.filteredData.length;
      return numSelected === numRows;
    }
    return false
  }
  masterToggle() {
    this.isEntirePageSelected() ?
      this.selection.deselect(...this.getPageData()) :
      this.selection.select(...this.getPageData());
  }
}
