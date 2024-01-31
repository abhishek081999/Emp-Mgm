import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Languages } from 'src/app/Enums/staticdata';
import { AwarenessVideo } from 'src/app/model/product.model';
import { AlertNotificationsService } from 'src/app/services/alert-notifications.service';
import { PackageService } from 'src/app/services/package.service';
import { VideoPlayerComponent } from '../../others/video-player/video-player.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-awareness-videos',
  templateUrl: './awareness-videos.component.html',
  styleUrls: ['./awareness-videos.component.scss']
})
export class AwarenessVideosComponent implements OnInit {


  awarenessVideos: AwarenessVideo = {
    thumbnail: '',
    title: '',
    video_url: ''
  }

  imageFileUpload: File;
  fd = new FormData();
  languages = Languages

  isLoading: boolean
  totalSize: number
  currentPage: number = 1
  pageSize: number = 10
  allAwarenessVideos: AwarenessVideo[] = []
  constructor(
    private alertNotificationService: AlertNotificationsService,
    private productService: PackageService,
    private modalService: NgbModal
  ) { }

  ngOnInit() {

    this.refreshList()
  }

  refreshList() {
    this.isLoading = true
    this.productService.getAwarenessVideos().toPromise()
      .then(res => {
        this.allAwarenessVideos = res;
        this.isLoading = false
      }).catch(err => { this.isLoading = false; this.alertNotificationService.alertError(err) })
  }


  isImageUploaded = false
  handelFileInput(event) {
    this.isImageUploaded = false;
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
        if (width != 800 || height != 533) {
          this.alertNotificationService.alertInfo("Image should be 800X533 px")
          return
        }
        if (event.target.files[0]) {
          this.imageFileUpload = <File>event.target.files[0];
          let element: HTMLElement = document.querySelector("#img + .input-group .file-upload-info") as HTMLElement;
          element.setAttribute('value', event.target.files[0].name);
          this.isImageUploaded = true;
        }
      }
    }

  }

  openFileBrowser(event: any) {
    event.preventDefault();
    let element: HTMLElement = document.querySelector("#img") as HTMLElement;
    element.click()
  }


  clearform() {
    this.awarenessVideos.title = '';
    this.awarenessVideos.video_url = '';
    this.awarenessVideos.approve = false;
    this.fd = new FormData();
  }



  submitForm(f: NgForm) {
    this.fd = new FormData();
    if (this.awarenessVideos._id) {
      this.fd.append("_id", this.awarenessVideos._id);
    }
    this.fd.append("title", this.awarenessVideos.title.toString());
    this.fd.append("video_url", this.awarenessVideos.video_url.toString());

    if (this.isImageUploaded) {
      this.fd.append("file", this.imageFileUpload, this.imageFileUpload['name']);
    }
    this.productService.postAwarenessVideos(this.fd).toPromise()
      .then(_res => {
        this.isImageUploaded = false;
        this.alertNotificationService.toastAlertSuccess('Awareness Videos Added Successfully')
        this.clearform()
        this.refreshList()
        let element: HTMLElement = document.querySelector("#img + .input-group .file-upload-info") as HTMLElement;
        element.setAttribute('value', "");
      }).catch(err => this.alertNotificationService.alertError(err))
  }

  isEdit = false
  editAwarenessVideos(awarenessVideos) {
    this.isEdit = true
    this.awarenessVideos = awarenessVideos
    this.pagechange();
  }

  async Approve(ap: AwarenessVideo) {
    this.alertNotificationService.alertApprove()
      .then(result => {
        if (result.isConfirmed) {
          ap.approve = true;
          this.productService.approveAwarenessVideos(ap._id).toPromise()
            .then(res => {
              this.alertNotificationService.toastAlertSuccess("Approved Successfully.")
              this.refreshList()
            }).catch(err => this.alertNotificationService.alertError(err))
        }
      })

  }


  Delete(id) {
    this.alertNotificationService.alertDelete()
      .then(result => {
        if (result.isConfirmed) {
          this.productService.deleteAwarenessVideos(id).toPromise()
            .then(res => {
              this.alertNotificationService.toastAlertSuccess("Deleted Successfully.")
              this.refreshList();
            }).catch(err => this.alertNotificationService.alertError(err))
        }
      })

  }

  pagechange() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }

  playvideo(item: AwarenessVideo) {
    if (item.video_url) {
      const modalRef = this.modalService.open(VideoPlayerComponent, { centered: true, scrollable: true, size: 'lg' })
      modalRef.componentInstance.data = {
        link: item.video_url
      }
    }
  }

}
