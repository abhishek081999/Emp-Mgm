import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Jobs } from 'src/app/model/jobs.model';
import { AlertNotificationsService } from 'src/app/services/alert-notifications.service';
import { JobsService } from 'src/app/services/jobs.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-joblists',
  templateUrl: './joblists.component.html',
  styleUrls: ['./joblists.component.scss']
})
export class JoblistsComponent implements OnInit {

  constructor(
    private jobsService: JobsService,
    private router: Router,
    private alertNotificationService: AlertNotificationsService,) { }

  imageurl = environment.imageUrl
  alljobs: Jobs[] = []
  alljobsFilter: Jobs[] = []
  searchq: string = ''

  ngOnInit(): void {
    this.refresh()
  }

  refresh() {
    this.jobsService.getalljob().toPromise()
      .then(res => {
        this.alljobs = res;
        this.alljobs = this.alljobs.reverse();
        this.filter()
      }).catch(err => this.alertNotificationService.alertError(err))
  }

  editJob(job) {
    this.router.navigate(['/admin/jobs/edit-job/' + job._id]);
  }

  onActivate(job: Jobs) {
    this.alertNotificationService.alertCustomMsg('Do you want to Activate this Job?')
      .then(result => {
        if (result.isConfirmed) {
          const data = {
            id: job._id,
            active: true
          }
          this.jobsService.activateJob(data).toPromise()
            .then(res => {
              this.alertNotificationService.toastAlertSuccess('Job Activated Successfully')
              this.refresh()
            }).catch(err => this.alertNotificationService.alertError(err))
        }
      })
  }

  onDeactivate(job) {
    this.alertNotificationService.alertCustomMsg('Do you want to Deactivate this Job?')
      .then(result => {
        if (result.isConfirmed) {
          const data = {
            id: job._id,
            active: false
          }
          this.jobsService.activateJob(data).toPromise()
            .then(res => {
              this.alertNotificationService.toastAlertSuccess('Job Deactivated Successfully')
              this.refresh()
            }).catch(err => this.alertNotificationService.alertError(err))
        }
      })
  }

  onSheild(job: Jobs) {
    var t = job.sheild ? 'Open' : 'Close';
    this.alertNotificationService.alertCustomMsg('Do you want to ' + t + ' this Job?')
      .then(result => {
        if (result.isConfirmed) {
          job.sheild = !job.sheild
          const data = {
            id: job._id,
            sheild: job.sheild
          }
          this.jobsService.sheildJob(data).toPromise()
            .then(res => {
              if (job.sheild) {
                this.alertNotificationService.toastAlertSuccess('Close for Application')
              }
              else {
                this.alertNotificationService.toastAlertSuccess('Open for Application')
              }
              this.refresh()
            }).catch(err => this.alertNotificationService.alertError(err))
        }
      })
  }

  onDelete(job) {
    this.alertNotificationService.alertDelete()
      .then(result => {
        if (result.isConfirmed) {
          this.jobsService.deletejob(job._id).toPromise()
            .then(res => {
              this.alertNotificationService.toastAlertSuccess('Job Deleted Successfully')
              this.refresh()
            }).catch(err => this.alertNotificationService.alertError(err))
        }
      })
  }

  application(job) {
    this.router.navigate(['/admin/jobs/jobapplications'], { queryParams: { jobid: job.jobid } });
  }

  totalSize: number
  currentPage: number = 1
  pageSize: number = 10

  filter() {
    if (this.searchq) {
      this.searchq = this.searchq.toLowerCase();
      this.alljobsFilter = this.alljobs.filter((e) => e.title.toString().toLowerCase().indexOf(this.searchq) > -1 || e.experience.toLowerCase().indexOf(this.searchq) > -1 || e.salary.toLowerCase().indexOf(this.searchq) > -1 || e.details.toString().toLowerCase().indexOf(this.searchq) > -1 || e.jobid.toString().toLowerCase().indexOf(this.searchq) > -1 || e.location.toString().toLowerCase().indexOf(this.searchq) > -1 || e.company.toString().toLowerCase().indexOf(this.searchq) > -1);
    }
    else {
      this.alljobsFilter = [...this.alljobs]
    }
    if (this.totalSize != this.alljobsFilter.length) {
      this.currentPage = 1
    }
    this.totalSize = this.alljobsFilter.length
  }

  pagechange() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }
}
