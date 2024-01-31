import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Jobs } from 'src/app/model/jobs.model';
import { AlertNotificationsService } from 'src/app/services/alert-notifications.service';
import { JobsService } from 'src/app/services/jobs.service';
import { Subscription as subs } from 'rxjs';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-create-jobs',
  templateUrl: './create-jobs.component.html',
  styleUrls: ['./create-jobs.component.scss']
})
export class CreateJobsComponent implements OnInit, OnDestroy {
  constructor(
    private jobsService: JobsService,
    private route: ActivatedRoute,
    private alertNotificationService: AlertNotificationsService,
    private router: Router) { }


  filesToUpload: File;
  fd = new FormData();

  job: Jobs = {
    image: '',
    experience: '',
    title: '',
    publishdate: new Date(),
    active: false,
    salary: '',
    sheild: false,
    details: '',
    jobid: '',
    location: '',
    company: ''
  }
  id = ''

  quillConfig = {
    toolbar: {
      container: [
        ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
        // ['code-block'],
        //[{ 'header': 1 }, { 'header': 2 }],               // custom button values
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
        [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
        //  [{ 'direction': 'rtl' }],                         // text direction

        // [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

        [{ 'align': [] }],

        ['clean'],                                         // remove formatting button

        ['link'],
        //['link', 'image', 'video']
      ],
    },
  }
  paramsub: subs
  ngOnInit() {
    this.paramsub = this.route.paramMap.subscribe(params => {
      this.id = params.get('id');
      if (this.id) {
        this.jobsService.getjobbyid(this.id).toPromise().then(
          res => {
            this.job = res;
          }).catch(err => this.alertNotificationService.alertError(err))
      }
    });
  }

  ngOnDestroy(): void {
    if (this.paramsub)
      this.paramsub.unsubscribe()
  }

  isImageUploaded = false
  handelFileInput(event) {
    this.filesToUpload = <File>event.target.files[0];
    let element: HTMLElement = document.querySelector("#img + .input-group .file-upload-info") as HTMLElement;
    element.setAttribute('value', event.target.files[0].name);
    this.isImageUploaded = true;
  }

  submitForm(f: NgForm) {
    this.fd = new FormData();
    if (this.isImageUploaded) {
      this.fd.append("file", this.filesToUpload, this.filesToUpload['name']);
    }
    this.fd.append("experience", this.job.experience);
    this.fd.append("title", this.job.title);
    this.fd.append("salary", this.job.salary);
    this.fd.append("details", this.job.details);
    this.fd.append("location", this.job.location);
    this.fd.append("company", this.job.company);
    this.fd.append("_id", this.job._id);
    this.jobsService.postjob(this.fd).toPromise().then(
      res => {
        f.resetForm()
        this.isImageUploaded = false;
        this.alertNotificationService.toastAlertSuccess('Job Added Successfully')
        this.router.navigate(['/admin/jobs/joblists'])
      }).catch(err => this.alertNotificationService.alertError(err))
  }

  openFileBrowser(event: any) {
    event.preventDefault();
    let element: HTMLElement = document.querySelector("#img") as HTMLElement;
    element.click()
  }

}
