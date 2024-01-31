import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Languages } from 'src/app/Enums/staticdata';
import { Banner } from 'src/app/model/banner.model';
import { AlertNotificationsService } from 'src/app/services/alert-notifications.service';
import { courseService } from 'src/app/services/course.service';
import { MobileAppService } from 'src/app/services/mobile-app.service';

@Component({
  selector: 'app-ad-banner',
  templateUrl: './ad-banner.component.html',
  styleUrls: ['./ad-banner.component.scss']
})
export class AdBannerComponent implements OnInit {

  constructor(
    private courseService: courseService,
    private alertNotificationService: AlertNotificationsService,
    private mobileAppService: MobileAppService) { }

  banner: Banner = {
    url: '',
    _id: '',
    image: '',
    approve: false,
    place: null,
    redirection: '',
    language: ''
  }
  languages = Languages
  filesToUpload: File;
  allbanner: Banner[] = []
  dates
  isbanneravailable = false

  totalSize: number
  currentPage: number = 1
  pageSize: number = 12
  redirections = [];

  ngOnInit(): void {
    this.dates = Date.now().toString();
    this.refresh();
  }

  refresh() {
    this.courseService.getAdBanner().toPromise()
      .then(res => {
        this.allbanner = res;
        this.isbanneravailable = this.allbanner.length > 0;
        this.totalSize = this.allbanner.length
      }).catch(err => this.alertNotificationService.alertError(err))
    this.mobileAppService.getAppRedirectionList().toPromise()
      .then(res => {
        this.redirections = res as any[];
      }).catch(err => this.alertNotificationService.alertError(err))
  }

  handelFile(event) {
    if (event.target.files.length === 0)
      return
    var mimetype = event.target.files[0].type;
    if (mimetype.match(/image\/*/) == null) {
      this.alertNotificationService.alertInfo('Only images are Supported')
      return
    }
    var reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = (_e) => {
      var image = new Image()
      image.src = reader.result.toString()
      image.onload = (e) => {
        var height = image.height
        var width = image.width
        if (height * 2 != width && ['App Banner', 'App Insignia', 'App Invesmentor', 'App Invesletter'].includes(this.banner.place)) {
          this.alertNotificationService.alertInfo("App banner image should be 2:1")
          return
        }
        if (event.target.files[0]) {
          this.filesToUpload = <File>event.target.files[0];
          let element: HTMLElement = document.querySelector("#backup + .input-group .file-upload-info") as HTMLElement;
          element.setAttribute('value', event.target.files[0].name)
        }
      }
    }
  }

  fd = new FormData();
  isupdate = false

  submit(f: NgForm) {
    var reader = new FileReader();
    reader.readAsDataURL(this.filesToUpload);
    reader.onload = (_e) => {
      var image = new Image()
      image.src = reader.result.toString()
      image.onload = (e) => {
        var height = image.height
        var width = image.width
        if (height * 2 != width && ['App Banner', 'App Insignia', 'App Invesmentor', 'App Invesletter'].includes(this.banner.place)) {
          this.alertNotificationService.alertInfo("App banner image should be 2:1")
          return
        } else {
          this.fd = new FormData();
          this.fd.append("file", this.filesToUpload, this.filesToUpload['name']);
          this.fd.append("url", this.banner.url);
          this.fd.append("place", this.banner.place);
          this.fd.append("redirection", this.banner.redirection);
          this.fd.append("language", this.banner.language);
          this.courseService.newAdBanner(this.fd).toPromise().then(
            res => {
              this.alertNotificationService.toastAlertSuccess('Banner Added Successfully')
              f.resetForm()
              this.refresh()
            }
          ).catch(err => this.alertNotificationService.alertError(err))
        }
      }
    }
  }



  removebanner(id) {
    this.alertNotificationService.alertDelete()
      .then((result) => {
        if (result.isConfirmed) {
          this.courseService.removeAdBanner(id).toPromise()
            .then(res => {
              this.alertNotificationService.toastAlertSuccess('Banner Removed Successfully')
              this.refresh()
            }).catch(err => this.alertNotificationService.alertError(err))
        }
      })
  }

  approvebanner(banner: Banner) {
    this.alertNotificationService.alertApprove()
      .then((result) => {
        if (result.isConfirmed) {
          banner.approve = true;
          this.courseService.editBanner(banner).toPromise()
            .then(res => {
              this.alertNotificationService.toastAlertSuccess('Banner Approved Successfully')
              this.refresh()
            }).catch(err => this.alertNotificationService.alertError(err))
        }
      })
  }

  openFileBrowser(event: any) {
    event.preventDefault();
    let element: HTMLElement = document.querySelector("#backup") as HTMLElement;
    element.click()
  }
}
