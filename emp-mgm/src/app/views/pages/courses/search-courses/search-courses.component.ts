import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { InsigniaItem } from 'src/app/model/insignia.model';
import { AlertNotificationsService } from 'src/app/services/alert-notifications.service';
import { ExportService } from 'src/app/services/export.service';
import { InsigniaService } from 'src/app/services/insignia.service';

@Component({
  selector: 'app-search-courses',
  templateUrl: './search-courses.component.html',
  styleUrls: ['./search-courses.component.scss']
})
export class SearchCoursesComponent implements OnInit {
  displayedColumns: string[];
  dataSource: MatTableDataSource<InsigniaItem>;
  isLoading = false;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  allCourse: InsigniaItem[] = [];

  constructor(
    private exportService: ExportService,
    private alertNotificationService: AlertNotificationsService,
    private insigniaService: InsigniaService,

  ) { }

  ngOnInit() {
    this.displayedColumns = ['_id', 'short_name', 'name'];
    this.refresh();
  }

  refresh() {
    this.insigniaService.getInsignia().toPromise()
      .then(res => {
        this.allCourse = res;
        this.dataSource = new MatTableDataSource(this.allCourse);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }).catch(err => this.alertNotificationService.alertError(err))
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  export() {
    this.exportService.exportonesheet('Service Directory', this.allCourse);
  }
  

}
