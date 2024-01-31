import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Category, Risk } from 'src/app/Enums/staticdata';
import { FollowMyPortfolio } from 'src/app/model/follow-my-portfolio.model';
import { AlertNotificationsService } from 'src/app/services/alert-notifications.service';
import { FollowMyPortfolioService } from 'src/app/services/follow-my-portfolio.service';

@Component({
  selector: 'app-follow-my-portfoliofo-added-model',
  templateUrl: './follow-my-portfoliofo-added-model.component.html',
  styleUrls: ['./follow-my-portfoliofo-added-model.component.scss']
})
export class FollowMyPortfoliofoAddedModelComponent implements OnInit {
  filesToUpload: File;
  fd: FormData;
  @Input() followmyportfolio = new FollowMyPortfolio ();
  constructor(
    public activeModal: NgbActiveModal,
    private alertNotificationService: AlertNotificationsService,
    private followmyportfolioService: FollowMyPortfolioService,
  ) { }

  imageFileUpload: File;
  Risk = Risk;
  Category = Category;

  ngOnInit(){
  }

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
        // [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

        [{ 'align': [] }],
        ['clean'],                                         // remove formatting button

        ['link'],
        // ['link', 'image', 'video']['emoji']
        //['link', 'image', 'video']
      ],
    },
  }


  // ==> Image upload <== //

  isImageUploaded = false
  handelFileInput(event) {
    this.filesToUpload = <File>event.target.files[0];
    let element: HTMLElement = document.querySelector("#img + .input-group .file-upload-info") as HTMLElement;
    element.setAttribute('value', event.target.files[0].name);
    this.isImageUploaded = true;
  }

  openFileBrowser(event: any) {
    event.preventDefault();
    let element: HTMLElement = document.querySelector("#img") as HTMLElement;
    element.click()
  }

  clearform() {
    this.followmyportfolio.portfolio_name = '';
    this.followmyportfolio.risk = '';
    this.followmyportfolio.category = '';
    this.followmyportfolio.short_description = '';
    this.followmyportfolio.about = '';
    this.fd = new FormData();
  }


  submitForm() {

    this.fd = new FormData();
    if (this.followmyportfolio._id) {
      this.fd.append("_id", this.followmyportfolio._id);
    }
    this.fd.append("portfolio_name", this.followmyportfolio.portfolio_name.toString());
    this.fd.append("risk", this.followmyportfolio.risk.toString());
    this.fd.append("category", this.followmyportfolio.category.toString());
    this.fd.append("short_description", this.followmyportfolio.short_description.toString());
    this.fd.append("about", this.followmyportfolio.about.toString());
    if (this.isImageUploaded) {
      this.fd.append("file", this.filesToUpload, this.filesToUpload['name']);
    }

    this.followmyportfolioService.postFollowMyPortfolio(this.fd).toPromise()
      .then(_res => {
        this.alertNotificationService.toastAlertSuccess('Portfolio Saved Successfully')
        this.clearform();
        this.close();
      }).catch(err => this.alertNotificationService.alertError(err))
  }

  close() {
    this.activeModal.close(this.followmyportfolio);
  }

}
