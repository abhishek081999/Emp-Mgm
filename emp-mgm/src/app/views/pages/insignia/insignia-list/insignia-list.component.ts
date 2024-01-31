import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Insignia } from 'src/app/model/insignia.model';
import { AlertNotificationsService } from 'src/app/services/alert-notifications.service';
import { EmployeeService } from 'src/app/services/employee.service';
import { InsigniaService } from 'src/app/services/insignia.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-insignia-list',
  templateUrl: './insignia-list.component.html',
  styleUrls: ['./insignia-list.component.scss']
})
export class InsigniaListComponent implements OnInit {
  constructor(
    private insigniaService: InsigniaService,
    private alertNotificationService: AlertNotificationsService,
    private router: Router,
    private employeeService: EmployeeService
  ) { }
  searchq: String = '';
  imageurl = environment.imageUrl;
  pagefilter: String = '';
  allinsignia: Insignia[] = [];
  alllist = []
  alllistfinal = []
  totalSize: number
  currentPage: number = 1
  pageSize: number = 10
  userDetails;
  ngOnInit() {
    this.userDetails = this.employeeService.getUserPayload()
    this.refreshlist();
  }

  onDelete(ins) {
    if (ins) {
      this.alertNotificationService.alertDelete()
        .then(result => {
          if (result.isConfirmed) {
            this.insigniaService.deleteInsignia(ins._id).toPromise()
              .then(res => {
                this.alertNotificationService.toastAlertSuccess('Insignia Deleted Successfully')
                this.refreshlist();
              }).catch(err => this.alertNotificationService.alertError(err))
          }
        })
    }
    else {
      this.alertNotificationService.toastAlertSuccess('Insignia cannot deleted')
    }
  }
  isLoading = false
  async refreshlist() {
    this.isLoading = true
    this.alllist = []

    await this.insigniaService.getInsigniaList().toPromise()
      .then(res => {
        this.allinsignia = res as Insignia[];
        var list = [...this.allinsignia.reverse()]
        this.alllist = list.concat(this.alllist)
        this.totalSize = this.alllist.length
        this.filter()
      }).catch(err => this.alertNotificationService.alertError(err))

    // this.alllist=this.alllist.concat(this.allinsignia)

    this.isLoading = false
  }

  body = {
    id: '',
    isCustom: false
  }
  onApprove(c) {
    if (c) {
      this.body.id = c._id;
      this.alertNotificationService.alertApprove()
        .then(result => {
          if (result.isConfirmed) {
            this.insigniaService.approve(this.body).toPromise()
              .then(res => {
                this.refreshlist()
                this.body.id = '';
                this.alertNotificationService.toastAlertSuccess('Insignia Approved Successfully')
              }).catch(err => this.alertNotificationService.alertError(err))
          }
        })
    }

  }

  edit(ins) {
    this.router.navigateByUrl('/admin/insignia/edit-insignia/' + ins._id)
  }

  duplicateCourse(course) {
    if (course) {
      this.router.navigate(['/admin/insignia/add-insignia'], { queryParams: { code: course._id } })
    }

  }

  duplicateCourse1(ins) {
    if (ins) {
      this.router.navigate(['/admin/insignia/add-insignia'], { queryParams: { code: ins._id, new: 'batch' } })
    }

  }

  filter() {
    this.alllistfinal = [...this.alllist]
    if (this.pagefilter == "approved") {
      this.alllistfinal = this.alllistfinal.filter(e => e.approved);
    }
    else if (this.pagefilter == "Mycourses") {
      this.alllistfinal = this.alllistfinal.filter(e => e.submittedby == this.userDetails.profileid);
    }
    else if (this.pagefilter == "Upcoming") {
      this.alllistfinal = this.alllistfinal.filter(e => e.upcoming);
    }
    else if (this.pagefilter == "Pending") {
      this.alllistfinal = this.alllistfinal.filter(e => !e.approved);
    }

    if (this.searchq) {
      this.searchq = this.searchq.toLowerCase()
      this.alllistfinal = this.alllistfinal.filter((e) => (e.category && e.category?.toString()?.toLowerCase()?.indexOf(this.searchq) > -1) || (e.code && e.code?.toLowerCase()?.indexOf(this.searchq) > -1) || (e.name && e.name?.toLowerCase()?.indexOf(this.searchq) > -1) || (e.language && e.language.toString().toLowerCase().indexOf(this.searchq) > -1));
    }

    if (this.totalSize != this.alllistfinal.length) {
      this.currentPage = 1
    }
    this.totalSize = this.alllistfinal.length
  }

  pagechange() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }



}
