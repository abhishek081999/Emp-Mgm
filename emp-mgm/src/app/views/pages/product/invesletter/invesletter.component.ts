import { Component, OnInit } from '@angular/core';
import { AlertNotificationsService } from 'src/app/services/alert-notifications.service';
import { environment } from 'src/environments/environment';
import { Languages } from 'src/app/Enums/staticdata';
import { Invesletter } from 'src/app/model/invesletter.model';
import { Router } from '@angular/router';
import { InvesletterService } from 'src/app/services/invesletter.service';


@Component({
  selector: 'app-invesletter',
  templateUrl: './invesletter.component.html',
  styleUrls: ['./invesletter.component.scss']
})
export class InvesletterComponent implements OnInit {


  imageFileUpload: File;
  FreeLinkFileUpload: File;
  PremiumLinkFileUpload: File;
  invesletter: Invesletter = {
    _id: '',
    title: '',
    language: '',
    published_date: '',
    free_link: '',
    premium_link: '',
    approve: false,
    invesletterid: '',
  }

  fd = new FormData();
  languages = Languages

  isLoading: boolean
  totalSize: number
  currentPage: number = 1
  pageSize: number = 10
  languageFilter
  statusFilter
  allinvesletter;
  publisheddateFilter;
  isEdit: boolean;
  searchq: string = '';
  fromDateFilter: any;
  toDateFilter: any;



  constructor(
    private alertNotificationService: AlertNotificationsService,
    private invesletterService: InvesletterService,
    private router: Router,
  ) { }

  ngOnInit() {

    this.refreshList()
  }

  refreshList() {
    this.isLoading = true
    this.invesletterService.getallinvesletter().toPromise()
      .then(res => {
        this.allinvesletter = res;
        this.filter()
        this.isLoading = false
      }).catch(err => { this.isLoading = false; this.alertNotificationService.alertError(err) })
  }



  // ==> Image upload <== //

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
        if (width * 1.4 != height) {
          this.alertNotificationService.alertInfo("Image should be 1:1.4")
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

  openFreeFileBrowser(event: any) {
    event.preventDefault();
    let element: HTMLElement = document.querySelector("#free") as HTMLElement;
    element.click()
  }

  openPremiumFileBrowser(event: any) {
    event.preventDefault();
    let element: HTMLElement = document.querySelector("#premium") as HTMLElement;
    element.click()
  }

  isFreeFileUploaded = false
  handelFreeFile(event) {
    if (event.target.files.length === 0)
      return
    var mimetype = event.target.files[0].type;
    if (mimetype.match(/application\/pdf/) == null) {
      this.alertNotificationService.alertInfo('Only Pdf are Supported')
      return
    }
    this.FreeLinkFileUpload = <File>event.target.files[0];
    let element: HTMLElement = document.querySelector("#free + .input-group .file-upload-info") as HTMLElement;
    element.setAttribute('value', event.target.files[0].name);
    this.isFreeFileUploaded = true;
  }

  isPremiumFileUploaded = false
  handelPremiumFile(event) {
    if (event.target.files.length === 0)
      return
    var mimetype = event.target.files[0].type;
    if (mimetype.match(/application\/pdf/) == null) {
      this.alertNotificationService.alertInfo('Only Pdf are Supported')
      return
    }
    this.PremiumLinkFileUpload = <File>event.target.files[0];
    let element: HTMLElement = document.querySelector("#premium + .input-group .file-upload-info") as HTMLElement;
    element.setAttribute('value', event.target.files[0].name);
    this.isPremiumFileUploaded = true;
  }


  clearform() {
    this.invesletter.title = '';
    this.invesletter.language = '';
    this.invesletter.free_link = '';
    this.invesletter.premium_link = '';
    this.invesletter.published_date = '';
    this.invesletter.approve = false;
    this.fd = new FormData();
  }


  submitForm(e: Event) {

    this.fd = new FormData();
    if (this.invesletter._id) {
      this.fd.append("_id", this.invesletter._id);
    }
    this.fd.append("title", this.invesletter.title.toString());
    this.fd.append("published_date", this.invesletter.published_date.toString());
    this.fd.append("language", this.invesletter.language.toString());

    if (this.isImageUploaded) {
      this.fd.append("file", this.imageFileUpload, this.imageFileUpload['name']);
    }
    if (this.isFreeFileUploaded) {
      this.fd.append("free_link", this.FreeLinkFileUpload, this.FreeLinkFileUpload['name']);
    }
    if (this.isPremiumFileUploaded) {
      this.fd.append("premium_link", this.PremiumLinkFileUpload, this.PremiumLinkFileUpload['name']);
    }
    this.invesletterService.postInvesletter(this.fd).toPromise()
      .then(_res => {
        this.isImageUploaded = false;
        this.isFreeFileUploaded = false;
        this.isPremiumFileUploaded = false;
        this.alertNotificationService.toastAlertSuccess('Invesletter Added Successfully')
        this.clearform()
        this.refreshList()
        let free_element: HTMLElement = document.querySelector("#free + .input-group .file-upload-info") as HTMLElement;
        free_element.setAttribute('value', "");
        let premium_element: HTMLElement = document.querySelector("#premium + .input-group .file-upload-info") as HTMLElement;
        premium_element.setAttribute('value', "");
        let element: HTMLElement = document.querySelector("#img + .input-group .file-upload-info") as HTMLElement;
        element.setAttribute('value', "");
      }).catch(err => this.alertNotificationService.alertError(err))
  }

  editinvesletter(Invesletter) {
    this.isEdit = true
    this.invesletter = Invesletter
    this.pagechange();
  }



  filteredData = []
  filter() {
    this.filteredData = [...this.allinvesletter]

    if (this.statusFilter == 'Approved') {
      this.filteredData = this.filteredData.filter(e => e.approve)
    } else if (this.statusFilter == 'Pending') {
      this.filteredData = this.filteredData.filter(e => !e.approve)
    }
    if (this.languageFilter) {
      this.filteredData = this.filteredData.filter(e => e.language == this.languageFilter)
    }
    if (this.searchq) {
      this.searchq = this.searchq.toLowerCase();
      this.filteredData = this.filteredData.filter((e) => e.title.toString().toLowerCase().indexOf(this.searchq) > -1 || e.language.toString().toLowerCase().indexOf(this.searchq) > -1 || e.published_date.toString().toLowerCase().indexOf(this.searchq) > -1);
    }
    if (this.fromDateFilter && this.toDateFilter) {
      var fd = new Date(this.fromDateFilter).getTime()
      var td = new Date(this.toDateFilter)
      td.setHours(23, 59, 59)
      this.filteredData = this.filteredData.filter(e => e.published_date && fd <= new Date(e.published_date).getTime() && td.getTime() >= new Date(e.published_date).getTime())
    }
    if (this.totalSize != this.filteredData.length) {
      this.currentPage = 1
    }
    this.totalSize = this.filteredData.length
  }


  async Approve(ap: Invesletter) {
    this.alertNotificationService.alertApprove()
      .then(result => {
        if (result.isConfirmed) {
          ap.approve = true;
          this.invesletterService.approveinvesletter(ap._id).toPromise()
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
          this.invesletterService.deleteinvesletter(id).toPromise()
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

}

