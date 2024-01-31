import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Course } from 'src/app/model/course.model';
import { Jobs } from 'src/app/model/jobs.model';
import { Shorturl } from 'src/app/model/shorturl.model';
import { AlertNotificationsService } from 'src/app/services/alert-notifications.service';
import { courseService } from 'src/app/services/course.service';
import { ExportService } from 'src/app/services/export.service';
import { JobsService } from 'src/app/services/jobs.service';
import { ShorturlService } from 'src/app/services/shorturl.service';

@Component({
  selector: 'app-short-url',
  templateUrl: './short-url.component.html',
  styleUrls: ['./short-url.component.scss']
})
export class ShortUrlComponent implements OnInit {



  constructor(
    private shortUrlService: ShorturlService,
    private courseService: courseService,
    private jobservice: JobsService,
    private alertNotificationService: AlertNotificationsService,
    private exportService: ExportService) { }

  short: Shorturl = {
    _id: '',
    url: '',
    type: '',
    id: '',
    title: '',
    description: '',
    image: ''
  }


  rowsOnPage = 5;
  sortBy = "invid";
  sortOrder = "asc";
  displayedColumns: string[];
  dataSource: MatTableDataSource<Shorturl>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  allCourse: Course[] = []
  allJobs: Jobs[] = []
  allShortUrl: Shorturl[] = []
  dates = Date.now().toString();
  filesToUpload: File;
  today
  temp: Shorturl[] = []
  ngOnInit(): void {
    this.displayedColumns = ['type', 'url', 'shorturl', 'id'];
    this.refresh();
  }


  refresh() {
    this.today = new Date().toLocaleString();
    this.courseService.getAllCourse().toPromise()
      .then(res => this.allCourse = res)
      .catch(err => this.alertNotificationService.alertError(err))
    this.jobservice.getalljob().toPromise()
      .then(res => this.allJobs = res)
      .catch(err => this.alertNotificationService.alertError(err))
    this.shortUrlService.getallshorturl().toPromise()
      .then(res => {
        this.allShortUrl = res;
        this.dataSource = new MatTableDataSource(this.allShortUrl);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      })
      .catch(err => this.alertNotificationService.alertError(err))

  }


  fd = new FormData();
  submit(f: NgForm) {
    this.fd = new FormData();
    if (this.short.type != 'others') {
      this.short.image = null
      this.short.title = null
      this.short.description = null
    }
    else if (this.short.image && this.imagechange) {
      this.short.image = this.short.image.split('\\').pop();
      const files: File = this.filesToUpload;
      this.fd.append("file", files, files['name']);
    }
    this.fd.append("_id", this.short._id);
    this.fd.append("url", this.short.url);
    this.fd.append("type", this.short.type);
    this.fd.append("id", this.short.id);
    this.fd.append("title", this.short.title);
    this.fd.append("description", this.short.description);
    this.shortUrlService.createshorturl(this.fd).toPromise()
      .then(res => {
        f.resetForm();
        this.short = new Shorturl();
        if (!this.isedit) {
          this.alertNotificationService.toastAlertSuccess('Short Url Created')
        }
        else {
          this.alertNotificationService.toastAlertSuccess('Short Url Updated')
        }
        this.refresh()
      }).catch(err => this.alertNotificationService.alertError(err))
  }

  imagechange = false
  handelFile(event) {
    this.short.image = this.dates + event.target.files[0].name;
    this.filesToUpload = <File>event.target.files[0];
    this.imagechange = true
    let element: HTMLElement = document.querySelector("#imageup + .input-group .file-upload-info") as HTMLElement;
    element.setAttribute('value', event.target.files[0].name)
  }

  isedit = false;
  onEdit(shorturl: Shorturl) {
    this.isedit = true;
    this.short = shorturl;
    document.documentElement.scrollTop = 0;
  }

  onDelete(id: string) {
    this.alertNotificationService.alertDelete()
      .then((result) => {
        if (result.isConfirmed) {
          this.shortUrlService.deleteshorturl(id).toPromise()
            .then(
              res => {
                this.alertNotificationService.toastAlertSuccess('Short Url Deleted')
                this.refresh()
              }).catch(err => this.alertNotificationService.alertError(err))
        }
      })
  }


  onchange() {
    switch (this.short.type) {
      case 'course': this.list = this.allCourse.map((e) => e.approved && e.coursecode).filter((e) => e); break;
      // case 'coursebundle':this.list=this.allCourseBundle.map((e)=>e.approved && e.coursecode).filter((e)=>e);break;
      case 'job': this.list = this.allJobs.map((e) => e.active && e.jobid).filter((e) => e); break;
      default: break;
    }
  }
  list: string[] = [];

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  export() {
    this.exportService.exportonesheet('Short Url', this.allShortUrl)
  }

  copied() {
    this.alertNotificationService.toastAlertSuccess('Url Copied')
  }

  openFileBrowser(event: any) {
    event.preventDefault();
    let element: HTMLElement = document.querySelector("#imageup") as HTMLElement;
    element.click()
  }

}
