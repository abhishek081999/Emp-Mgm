import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Invesmentor } from 'src/app/model/invesmentor.model';
import { AlertNotificationsService } from 'src/app/services/alert-notifications.service';
import { EmployeeService } from 'src/app/services/employee.service';
import { InvesmentorService } from 'src/app/services/invesmentor.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-invesmentor-list',
  templateUrl: './invesmentor-list.component.html',
  styleUrls: ['./invesmentor-list.component.scss']
})
export class InvesmentorListComponent implements OnInit {
  filesToUpload: File;

  constructor(
    private invesmentorService: InvesmentorService,
    private alertNotificationService: AlertNotificationsService,
    private router: Router,
    private employeeService: EmployeeService
  ) { }
  searchq: String = '';
  imageurl = environment.imageUrl;
  pagefilter: String = '';
  allinvesmentor: Invesmentor[] = [];
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
            this.invesmentorService.deleteInvesmentor(ins._id).toPromise()
              .then(res => {
                this.alertNotificationService.toastAlertSuccess('invesmentor Deleted Successfully')
                this.refreshlist();
              }).catch(err => this.alertNotificationService.alertError(err))
          }
        })
    }
    else {
      this.alertNotificationService.toastAlertSuccess('invesmentor cannot deleted')
    }
  }
  isLoading = false
  async refreshlist() {
    this.isLoading = true
    this.alllist = []

    await this.invesmentorService.getInvesmentorList().toPromise()
      .then(res => {
        this.allinvesmentor = res as Invesmentor[];
        var list = [...this.allinvesmentor.reverse()]
        this.alllist = list.concat(this.alllist)
        this.totalSize = this.alllist.length
        this.filter()
      }).catch(err => this.alertNotificationService.alertError(err))

    this.alllist=this.alllist.concat(this.allinvesmentor)

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
            this.invesmentorService.approve(this.body).toPromise()
              .then(res => {
                this.refreshlist()
                this.body.id = '';
                this.alertNotificationService.toastAlertSuccess('invesmentor Approved Successfully')
              }).catch(err => this.alertNotificationService.alertError(err))
          }
        })
    }

  }

  edit(ins) {
    this.router.navigateByUrl('/admin/invesmentor/edit-invesmentor/' + ins._id)
    
  }

  duplicateCourse(course) {
    if (course) {
      this.router.navigate(['/admin/invesmentor/add-invesmentor'], { queryParams: { code: course._id } })
    }

  }

  filter() {
    this.alllistfinal = [...this.alllist]
    if (this.pagefilter == "approved") {
      this.alllistfinal = this.alllistfinal.filter(e => e.approved);
    }
    else if (this.pagefilter == "Pending") {
      this.alllistfinal = this.alllistfinal.filter(e => !e.approved);
    }

    if (this.searchq) {
      this.searchq = this.searchq.toLowerCase()
      this.alllistfinal = this.alllistfinal.filter((e) => (e.code && e.code?.toLowerCase()?.indexOf(this.searchq) > -1) || (e.name && e.name?.toLowerCase()?.indexOf(this.searchq) > -1) || (e.language && e.language.toString().toLowerCase().indexOf(this.searchq) > -1));
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
