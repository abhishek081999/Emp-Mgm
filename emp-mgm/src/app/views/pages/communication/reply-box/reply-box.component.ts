import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Answer } from 'src/app/model/answer.model';
import { Discussion } from 'src/app/model/discussion.model';
import { AlertNotificationsService } from 'src/app/services/alert-notifications.service';
import { DiscussionService } from 'src/app/services/discussion.service';

@Component({
  selector: 'app-reply-box',
  templateUrl: './reply-box.component.html',
  styleUrls: ['./reply-box.component.scss']
})
export class ReplyBoxComponent implements OnInit {

  @Input() data

  constructor(
    private alertNotificationService: AlertNotificationsService,
    private discussionService: DiscussionService,
    public activeModal: NgbActiveModal) { }

  dates = ''
  read: Boolean;
  ngOnInit() {
    this.dates = Date.now().toString();
    this.refreshMsg();
    //this.updateunread();
    this.read = false;
  }

  @ViewChild('scrollme') private scrollme: ElementRef
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

        //['link', 'image', 'video']
      ],
    },
  }


  scrolltobottom() {
    try {
      this.scrollme.nativeElement.scrollTop = this.scrollme.nativeElement.scrollHeight;
    }
    catch (err) {
      console.log(err)
    }
  }

  discussions = new Discussion();
  answers: Array<Answer> = [];
  newDiscussion = new Discussion();
  today = new Date();
  postanswer: Answer = {
    details: '',
    date: this.today,
    submittedby: '',
    image: ''
  };
  selectedFile: File = null;
  filesToUpload: File = null;
  fd = new FormData();
  isimage = false;

  handelFile(event) {
    var mimetype = event.target.files[0].type;
    if (mimetype.match(/image\/*/) == null) {
      this.alertNotificationService.alertInfo('Only Images are Supported')
      return
    }
    this.filesToUpload = <File>event.target.files[0];
    this.isimage = true;
  }

  async onSubmit() {
    this.fd = new FormData();
    if (this.isimage) {
      this.fd.append("file", this.filesToUpload, this.filesToUpload['name']);
    }
    this.fd.append("details", this.postanswer.details)
    this.fd.append("submittedby", this.data.username)
    this.fd.append("msgtype", "admin")
    this.fd.append("discussion_id", this.data.id)

    await this.discussionService.replyDiscussion(this.fd).toPromise()
      .then(res => {
        this.alertNotificationService.toastAlertSuccess('Submitted Successfully')
        this.postanswer.details = '';
        this.activeModal.close()
      }).catch(err => this.alertNotificationService.alertError(err));
  }

  refreshMsg() {
    this.discussionService.getDiscussionById(this.data.id).toPromise()
      .then(res => {
        this.discussions = res as Discussion;
        this.answers = this.discussions.reply as Answer[];
        this.scrolltobottom()
      }).catch(err => this.alertNotificationService.alertError(err));
  }

  deleteMessage(i) {
    this.alertNotificationService.alertDelete()
      .then(result => {
        if (result.isConfirmed) {
          this.answers.splice(i, 1);
          this.discussions.reply = this.answers
          this.discussionService.deleteDiscussionMessage(this.discussions).toPromise()
            .then(res => {
              this.alertNotificationService.toastAlertSuccess('Removed Successfully')
              this.refreshMsg();
            }).catch(err => this.alertNotificationService.alertError(err))
        }
      })
  }

}
