import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Course } from 'src/app/model/course.model';
import { Insignia } from 'src/app/model/insignia.model';
import { Invesmentor } from 'src/app/model/invesmentor.model';
import { Package } from 'src/app/model/package.model';
import { AlertNotificationsService } from 'src/app/services/alert-notifications.service';

@Component({
  selector: 'app-select-service',
  templateUrl: './select-service.component.html',
  styleUrls: ['./select-service.component.scss']
})
export class SelectServiceComponent implements OnInit {

  constructor(
    public activeModal: NgbActiveModal,

    private alertNotificationService: AlertNotificationsService) { }

  data = {
    servicetype: '',
    servicecode: '',
    servicename: ''
  }
  allCourse: Course[] = []
  allCurrentCourse: Course[] = []
  allPrevCourse: Course[] = []
  allInsignia: Insignia[] = []
  allProduct: Package[] = []
  allInvesmentor: Invesmentor[] = []

  @Input() lists

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  filterQuery = "";
  rowsOnPage = 10;
  sortBy = "date";
  sortOrder = "desc";
  today = Date();
  dataLength;
  displayedColumns: string[];
  dataSource: MatTableDataSource<any>;

  ngOnInit(): void {
    this.displayedColumns = ['id', 'coursetype', 'coursecode', 'coursename', 'coursestartdate', 'teachername']
    this.allInsignia = this.lists.allInsignia
    this.allCurrentCourse = this.lists.allCurrentCourse
    this.allPrevCourse = this.lists.allPrevCourse
    this.allProduct = this.lists.allProduct
    this.allInvesmentor = this.lists.allInvesmentor
  }

  servicetypechange() {
    switch (this.data.servicetype) {
      case 'course':
        this.displayedColumns = ['id', 'coursetype', 'coursecode', 'coursename', 'coursestartdate', 'courselanguage', 'teachername', 'min_selling_price', 'short_code']
        this.dataSource = new MatTableDataSource(this.allCurrentCourse);
        break;
      case 'insignia':
        this.displayedColumns = ['id', 'code', 'name', 'short_code', 'min_selling_price']
        this.dataSource = new MatTableDataSource(this.allInsignia);
        break;
      case 'invesmentor':
        this.displayedColumns = ['id', 'code', 'name', 'short_code', 'min_selling_price']
        this.dataSource = new MatTableDataSource(this.allInvesmentor);
        break;
      case 'product':
        this.displayedColumns = ['id', 'productid', 'name', 'min_selling_price']
        this.dataSource = new MatTableDataSource(this.allProduct);
        break;
      case 'subscription':
        this.displayedColumns = ['id', 'coursetype', 'coursecode', 'coursename', 'coursestartdate', 'courselanguage', 'teachername']
        this.dataSource = new MatTableDataSource(this.allPrevCourse);
        break;
      case 'insignia_subscription':
        this.displayedColumns = ['id', 'code', 'name', 'short_code']
        this.dataSource = new MatTableDataSource(this.allInsignia);
        break;
      default:
        this.dataSource = new MatTableDataSource([]);
        break;
    }
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  select(row) {
    switch (this.data.servicetype) {
      case 'course':
        this.data.servicecode = row.coursecode
        this.data.servicename = row.coursename
        break;
      case 'insignia':
        this.data.servicecode = row.code
        this.data.servicename = row.name
        break;
      case 'invesmentor':
        this.data.servicecode = row.code
        this.data.servicename = row.name
        break;
      case 'product':
        this.data.servicecode = row.productid
        this.data.servicename = row.name
        break;
      case 'subscription':
        this.data.servicecode = row.coursecode
        this.data.servicename = row.coursename
        break;
      case 'insignia_subscription':
        this.data.servicecode = row.code
        this.data.servicename = row.name
        break;
      default:
        this.data.servicecode = ''
        this.data.servicename = ''
        break;
    }
    this.activeModal.close(this.data)
  }

  applyFilter(event: Event) {
    if (this.dataSource) {
      const filterValue = (event.target as HTMLInputElement).value;
      this.dataSource.filter = filterValue.trim().toLowerCase();

      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
    } else {
      this.alertNotificationService.alertInfo('Select Service Type')
    }

  }

}
