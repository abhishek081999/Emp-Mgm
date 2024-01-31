import { trigger, state, style, transition, animate } from '@angular/animations';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import * as moment from 'moment';
import { Invesmentor, InvesmentorItem, InvesmentorRegistrationDisp } from 'src/app/model/invesmentor.model';
import { AlertNotificationsService } from 'src/app/services/alert-notifications.service';
import { ExportService } from 'src/app/services/export.service';
import { InvesmentorService } from 'src/app/services/invesmentor.service';

@Component({
  selector: 'app-invesmentor-registration',
  templateUrl: './invesmentor-registration.component.html',
  styleUrls: ['./invesmentor-registration.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class InvesmentorRegistrationComponent implements OnInit {

  allRegisteredInvesmentor: InvesmentorRegistrationDisp[] = [];
  allInvesmentor: Invesmentor[] = []
  filterQuery = "";
  rowsOnPage = 10;
  sortBy = "start date";
  sortOrder = "desc";
  today = Date();
  dataLength;
  codefilter: string = ''
  statusfilter: string = ''
  displayedColumns: string[];
  dataSource: MatTableDataSource<InvesmentorRegistrationDisp>;
  startDate: string = null
  endDate: string = null
  expandedElement: InvesmentorItem | null;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private invesmentorService: InvesmentorService,
    private exportService: ExportService,
    private alertNotificationService: AlertNotificationsService,
  ) { }
  invesmentorcodes: any[] = []
  ngOnInit() {
    this.displayedColumns = ['invid', 'student_name', 'phone', 'whatsapp_number', 'telegram_number', 'code', 'name', 'reg_date', 'start_date', 'exp_date', 'bookedamount', 'paymentreceived', 'gst', 'due', 'couponcode', 'status'];
    this.refreshlist();
    this.invesmentorService.getInvesmentorList().toPromise()
      .then(res => {
        this.allInvesmentor = res;
        var codes = []
        this.allInvesmentor.forEach(e => {
          if (e.approved) {
            codes.push({ id: e.code })
          }
        })
        this.invesmentorcodes = this.invesmentorcodes.concat(codes.reverse())
      }).catch(err => this.alertNotificationService.alertError(err))
  }

  isLoading: boolean
  async refreshlist() {
    this.isLoading = true
    await this.invesmentorService.allInvesmentorRegistrationsDisp().toPromise()
      .then(res => {
        this.allRegisteredInvesmentor = res
        this.allRegisteredInvesmentor.forEach(e => {
          e.exp_date = e.exp_date ? new Date(e.exp_date) : null;
          e.start_date = e.start_date ? new Date(e.start_date) : null;
          e.reg_date = e.reg_date ? new Date(e.reg_date) : null
        })
        this.isLoading = false
      }).catch(err => this.alertNotificationService.alertError(err));
    this.filter()

  }


  totalbookedamount = 0;
  totaldue = 0;
  totalpaymentreceived = 0;
  totalgst = 0;
  calculateamount() {
    this.totalbookedamount = this.dataSource.filteredData.filter(f => f.bookedamount).map(e => e.bookedamount).reduce((acc, value) => Number(acc) + Number(value), 0)
    this.totaldue = this.dataSource.filteredData.filter(f => f.due).map(e => e.due).reduce((acc, value) => Number(acc) + Number(value), 0)
    this.totalpaymentreceived = this.dataSource.filteredData.filter(f => f.paymentreceived).map(e => e.paymentreceived).reduce((acc, value) => Number(acc) + Number(value), 0)
    this.totalgst = this.dataSource.filteredData.filter(f => f.gst).map(e => e.gst).reduce((acc, value) => Number(acc) + Number(value), 0)
  }

  export() {
    if (this.dataSource) {
      this.exportService.exportonesheet('Invesmentor Registration', this.dataSource.filteredData)
    }
  }
  displayData: InvesmentorRegistrationDisp[] = []
  filter() {
    this.displayData = [...this.allRegisteredInvesmentor]
    if (this.codefilter) {
      this.displayData = this.displayData.filter(e => e.code == this.codefilter)
    }
    if (this.statusfilter) {
      this.displayData = this.displayData.filter(e => e.status == this.statusfilter)
    }
    if (this.startDate && this.endDate) {
      this.displayData = this.displayData.filter((e) => moment(e.reg_date).isBetween(this.startDate, this.endDate, "days", "[]"))
    } else if (this.startDate || this.endDate) {
      this.displayData = this.displayData.filter((e) => (this.startDate && this.startDate == moment(e.reg_date).format('YYYY-MM-DD')) || (this.endDate && this.endDate == moment(e.reg_date).format('YYYY-MM-DD')))
    }
    this.dataSource = new MatTableDataSource(this.displayData);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataLength = this.allRegisteredInvesmentor.length;
    this.calculateamount()
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.calculateamount()
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  // temporaryBanned(reg: InvesmentorRegistrationDisp) {
  //   this.alertNotificationService.alertCustomMsg(`Do you want to ${reg.temporarybanned ? 'ban' : 'active'} this registration?`)
  //     .then(resp => {
  //       if (resp.isConfirmed) {
  //         var data = {
  //           reg_id: reg._id,
  //           temporarybanned: reg.temporarybanned
  //         }
  //         this.invesmentorService.updateTempBanned(data).toPromise()
  //           .then(res => {
  //             this.alertNotificationService.toastAlertSuccess('Succesfully Updated');
  //             this.refreshlist();
  //           }).catch(err => this.alertNotificationService.alertError(err));
  //       }
  //       else {
  //         reg.temporarybanned = !reg.temporarybanned;
  //       }
  //     })
  // }






  isnotregistered(r: InvesmentorRegistrationDisp) {
    return r.items.filter(e => e._id).map(e => e._id).length < r.items.length
  }

}
