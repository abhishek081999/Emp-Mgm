import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { Instructor } from 'src/app/model/instructor.model';
import { PortfolioCheckup } from 'src/app/model/portfolio-checkup.model';
import { AlertNotificationsService } from 'src/app/services/alert-notifications.service';
import { ExportService } from 'src/app/services/export.service';
import { InstructorService } from 'src/app/services/instructor.service';
import { PackageService } from 'src/app/services/package.service';

@Component({
  selector: 'app-portfolio-checkup-list',
  templateUrl: './portfolio-checkup-list.component.html',
  styleUrls: ['./portfolio-checkup-list.component.scss']
})
export class PortfolioCheckupListComponent implements OnInit {

  constructor(
    private productService: PackageService,
    private alertNotificationService: AlertNotificationsService,
    private exportService: ExportService,
    private instructorService: InstructorService,
    private router: Router) { }

  allPortfolioCheckups: PortfolioCheckup[] = [];
  displayData: PortfolioCheckup[] = [];
  filterQuery = "";
  rowsOnPage = 10;
  sortBy = "date";
  sortOrder = "desc";
  dataLength;
  displayedColumns: string[];
  dataSource: MatTableDataSource<PortfolioCheckup>;
  isavailable = true
  isLoading = false
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  selection = new SelectionModel<PortfolioCheckup>(true, []);
  allMentor: Instructor[] = []
  employee = new Instructor()
  pagefilter = ""
  startDate = null
  endDate = null
  mentorFilter = null
  ngOnInit(): void {
    this.displayedColumns = ['select', 'student_name', 'mentor_name', 'product_name', 'no_of_stocks', 'validated', 'isReplied', 'createdAt', 'updatedAt', 'expiry_date', 'purchase_date',];
    this.refresh();
  }

  refresh() {
    this.isLoading = true;
    this.productService.getPortfolioCheckups().toPromise()
      .then(res => {
        this.allPortfolioCheckups = res;
        this.filter();
      }).catch(err => this.alertNotificationService.alertError(err))

    this.instructorService.getAllInstructor().toPromise()
      .then(res => {
        this.allMentor = res;
        this.allMentor = this.allMentor.filter(e => e.approved && !e.rejected && e.role != 'admin')
      }).catch(err => this.alertNotificationService.alertError(err))
  }

  onassignstaff() {
    this.alertNotificationService.alertCustomMsg('Do you want to allocate ' + this.selection.selected.length + ' Portfolio to ' + this.employee.invid + '-' + this.employee.fullName + ' ?')
      .then(result => {
        if (result.isConfirmed) {
          var ids = this.selection.selected.filter(e => e._id).map(m => m._id);
          //console.log(alllogs)
          var data = {
            ids: ids,
            mentor_id: this.employee._id,
          }

          this.productService.assignPortfolio(data).toPromise()
            .then(res => {
              this.allPortfolioCheckups = res;
              this.filter();
              this.alertNotificationService.toastAlertSuccess('Portfolio Assigned')
              this.employee = null
              this.selection.clear()
            }).catch(err => this.alertNotificationService.alertError(err))
        }
      })
  }

  filter() {
    this.displayData = [...this.allPortfolioCheckups]
    if(this.mentorFilter){
      this.displayData = this.displayData.filter(e=>e.mentor_id == this.mentorFilter);
    }
    if (this.startDate && !this.endDate) {
      this.displayData = this.displayData.filter(e => moment(e.createdAt).isSame(this.startDate, 'day'));
    } else if (!this.startDate && this.endDate) {
      this.displayData = this.displayData.filter(e => moment(e.createdAt).isSame(this.endDate, 'day'));
    } else if (this.startDate && this.endDate) {
      this.displayData = this.displayData.filter(e => moment(e.createdAt).isBetween(moment(this.startDate).startOf('day'), moment(this.endDate).endOf('day')));
    }
    if (this.pagefilter == 'validated') {
      this.displayData = this.displayData.filter(e => e.pending == 0);
    } else if (this.pagefilter == 'pending') {
      this.displayData = this.displayData.filter(e => e.pending != 0);
    }
    this.isavailable = this.displayData.length > 0;
    this.isLoading = false
    this.dataSource = new MatTableDataSource(this.displayData);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataLength = this.displayData.length;
  }

  StaffSearchFn(term: string, item: Instructor) {
    term = term.toLowerCase();
    return item.fullName.toLowerCase().indexOf(term) > -1 || item.invid.toLowerCase().indexOf(term) > -1;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  gotoportfolio(data: PortfolioCheckup) {
    this.router.navigate(['/admin/products/portfolio-checkup/' + data._id])
  }

  export() {
    if (this.dataSource && this.dataSource.filteredData) {
      var data = this.dataSource.filteredData;
      data.forEach(e => {
        e.createdAt = e.createdAt ? new Date(e.createdAt) : e.createdAt;
        e.expiry_date = e.expiry_date ? new Date(e.expiry_date) : e.expiry_date;
        e.purchase_date = e.purchase_date ? new Date(e.purchase_date) : e.purchase_date;
        e.updatedAt = e.updatedAt ? new Date(e.updatedAt) : e.updatedAt;
      })
      this.exportService.exportonesheet('Portfolio Checkup', data)
    }

  }

  getPageData() {
    if (this.dataSource)
      return this.dataSource._pageData(this.dataSource._orderData(this.dataSource.filteredData));
    return []
  }

  isEntirePageSelected() {
    return this.getPageData().every((row) => this.selection.isSelected(row));
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


  checkboxLabel(row?, i?): string {
    if (!row) {
      return `${this.isEntirePageSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${i}`;
  }
}
