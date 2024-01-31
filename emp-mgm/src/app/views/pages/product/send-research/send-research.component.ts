import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { sendMarketResearch } from 'src/app/model/package.model';
import { AlertNotificationsService } from 'src/app/services/alert-notifications.service';
import { PackageService } from 'src/app/services/package.service';
import { environment } from 'src/environments/environment';
import 'quill-emoji/dist/quill-emoji.js';
import * as moment from 'moment';
import { timer } from 'rxjs';
import { EmployeeService } from 'src/app/services/employee.service';
import { Languages } from 'src/app/Enums/staticdata';


@Component({
  selector: 'app-send-research',
  templateUrl: './send-research.component.html',
  styleUrls: ['./send-research.component.scss']
})
export class SendResearchComponent implements OnInit {
  today = new Date();
  serverErrorMessages: any;
  isLoading: boolean
  allMarketResearch: Array<sendMarketResearch> = []
  sendResearch: sendMarketResearch = {
    _id: '',
    details: "",
    type: '',
    image: [],
    video: '',
    reaction: [],
    approved: false,
    language: '',
    category: '',
    created_date: this.today,
    created_by: '',
    approved_date: null,
    approved_by: '',
    schedule_time: null,
    isEdited: false
  }
  scheduleHour = null
  scheduleMin = null
  hours = [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]
  minutes = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55]

  quillConfig = {
    'emoji-toolbar': true,
    'emoji-textarea': true,
    'emoji-shortname': true,
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
        ['emoji'],
        ['clean'],                                         // remove formatting button

        ['link'],
        // ['link', 'image', 'video']['emoji']
        //['link', 'image', 'video']
      ],
      handlers: { 'emoji': function () { } }
    },
  }

  imageurl = environment.imageUrl;
  totalSize: number
  currentPage: number = 1
  pageSize: number = 10
  filesToUpload: File;
  filesToUpload1: File;
  filesToUpload2: File;
  filesToUpload3: File;
  imagechange = false
  typeFilter
  categoryFilter
  languageFilter
  statusFilter

  constructor(
    private employeeService: EmployeeService,
    private alertNotificationService: AlertNotificationsService,
    private productService: PackageService
  ) { }

  Type: string[] = ['text', 'image', 'video', 'poll'];
  categories;
  languages = Languages
  options = null;

  async ngOnInit() {
    await this.productService.getSendResearchCatergory().toPromise()
      .then(res => {
        this.categories = res;
      }).catch(err => this.alertNotificationService.alertError(err))
    this.refreshList();
    this.oberserableTimer();
  }

  refreshList() {
    this.isLoading = true
    this.productService.getAllMarketResearch().toPromise()
      .then(res => {
        this.allMarketResearch = res as sendMarketResearch[];
        this.filter()
        this.isLoading = false
      }).catch(err => { this.isLoading = false; this.alertNotificationService.alertError(err) })
  }

  async onApprove(ann: sendMarketResearch) {
    this.alertNotificationService.alertApprove()
      .then(result => {
        if (result.isConfirmed) {
          ann.approved = true;
          this.productService.approveMarketResearch(ann._id).toPromise()
            .then(res => {
              this.alertNotificationService.toastAlertSuccess("Approved Successfully.")
            }).catch(err => this.alertNotificationService.alertError(err))
        }
      })
  }

  onDelete(id) {
    this.alertNotificationService.alertDelete()
      .then(result => {
        if (result.isConfirmed) {
          this.productService.deleteMarketResearch(id).toPromise()
            .then(res => {
              this.alertNotificationService.toastAlertSuccess("Deleted Successfully.")
              this.refreshList();
            }).catch(err => this.alertNotificationService.alertError(err))
        }
      })
  }

  onSelectionChanged = (event) => {
    if (event.oldRange == null) {
      this.onFocus();
    }
    if (event.range == null) {
      this.onBlur();
    }
  }

  onContentChanged = (event) => {
    // console.log(event.html);
  }

  onFocus = () => {
    console.log("On Focus");
  }

  onBlur = () => {
    console.log("Blurred");
  }

  fd = new FormData();
  progressvalue: number;
  isEdit = false
  handelFileInput(event) {
    if (event.target.files && event.target.files.length > 0) {
      this.imagechange = true
      this.filesToUpload = <File>event.target.files[0];
      let element: HTMLElement = document.querySelector("#img + .input-group .file-upload-info") as HTMLElement;
      element.setAttribute('value', event.target.files[0].name)
    } else {
      this.imagechange = false
      this.filesToUpload = null;
      let element: HTMLElement = document.querySelector("#img + .input-group .file-upload-info") as HTMLElement;
      element.setAttribute('value', null)
    }
  }
  handelFileInput1(event) {
    if (event.target.files && event.target.files.length > 0) {
      this.imagechange = true
      this.filesToUpload1 = <File>event.target.files[0];
      let element: HTMLElement = document.querySelector("#img1 + .input-group .file-upload-info") as HTMLElement;
      element.setAttribute('value', event.target.files[0].name)
    } else {
      this.imagechange = false
      this.filesToUpload1 = null;
      let element: HTMLElement = document.querySelector("#img1 + .input-group .file-upload-info") as HTMLElement;
      element.setAttribute('value', null)
    }
  }
  handelFileInput2(event) {
    if (event.target.files && event.target.files.length > 0) {
      this.imagechange = true
      this.filesToUpload2 = <File>event.target.files[0];
      let element: HTMLElement = document.querySelector("#img2 + .input-group .file-upload-info") as HTMLElement;
      element.setAttribute('value', event.target.files[0].name)
    } else {
      this.imagechange = false
      this.filesToUpload2 = null;
      let element: HTMLElement = document.querySelector("#img2 + .input-group .file-upload-info") as HTMLElement;
      element.setAttribute('value', null)
    }
  }
  handelFileInput3(event) {
    if (event.target.files && event.target.files.length > 0) {
      this.imagechange = true
      this.filesToUpload3 = <File>event.target.files[0];
      let element: HTMLElement = document.querySelector("#img3 + .input-group .file-upload-info") as HTMLElement;
      element.setAttribute('value', event.target.files[0].name)
    } else {
      this.imagechange = false
      this.filesToUpload3 = null;
      let element: HTMLElement = document.querySelector("#img3 + .input-group .file-upload-info") as HTMLElement;
      element.setAttribute('value', null)
    }
  }

  SendResearch(sendResearchForm: NgForm) {
    if (this.sendResearch.type == 'image' && !this.imagechange) {
      this.alertNotificationService.alertInfo("Upload Image");
      return;
    }
    this.fd = new FormData()
    this.alertNotificationService.alertCustomMsg("Are You sure to proceed furthur?")
      .then(result => {
        if (result.isConfirmed) {
          if (this.imagechange) {
            if (this.filesToUpload) {
              var name1 = this.filesToUpload.name;
              name1 = name1.split('\\').pop();
              name1 = name1.replace(/\s/g, "");
              this.fd.append("file", this.filesToUpload, name1.toString());
            }
            if (this.filesToUpload1) {
              var name2 = this.filesToUpload1.name;
              name2 = name2.split('\\').pop();
              name2 = name2.replace(/\s/g, "");
              this.fd.append("file", this.filesToUpload1, name2.toString());
            }
            if (this.filesToUpload2) {
              var name3 = this.filesToUpload2.name;
              name3 = name3.split('\\').pop();
              name3 = name3.replace(/\s/g, "");
              this.fd.append("file", this.filesToUpload2, name3.toString());
            }
            if (this.filesToUpload3) {
              var name4 = this.filesToUpload3.name;
              name4 = name4.split('\\').pop();
              name4 = name4.replace(/\s/g, "");
              this.fd.append("file", this.filesToUpload3, name4.toString());
            }
          }
          var schedule_time = null
          if (this.sendResearch.schedule_time) {
            this.scheduleHour = this.scheduleHour ? Number(this.scheduleHour) : 7
            this.scheduleMin = this.scheduleMin ? Number(this.scheduleMin) : 0
            schedule_time = moment(this.sendResearch.schedule_time).startOf('day').add(this.scheduleHour, 'hour').add(this.scheduleMin, 'minute').toISOString();
          }
          this.fd.append("details", this.sendResearch.details);
          this.fd.append("type", this.sendResearch.type);
          this.fd.append("video", this.sendResearch.video);
          this.fd.append("category", this.sendResearch.category);
          this.fd.append("language", this.sendResearch.language);
          this.fd.append("schedule_time", schedule_time);
          this.fd.append("options", this.options);
          this.fd.append("_id", this.sendResearch._id ? this.sendResearch._id : null);

          this.productService.postSendResearch(this.fd).toPromise()
            .then(res => {
              // sendResearchForm.resetForm();
              // this.sendResearch = new sendMarketResearch();
              this.alertNotificationService.toastAlertSuccess("Submitted Successfully");
              this.fd = new FormData()
              this.refreshList();
              if (this.isEdit) {
                this.clearform()
              }
              this.resetClock();
              sendResearchForm.resetForm({
                type: this.sendResearch.type,
                category: this.sendResearch.category,
                language: this.sendResearch.language,
                schedule_time: this.sendResearch.schedule_time,
                hour: this.scheduleHour,
                minute: this.scheduleMin
              });
              this.sendResearch.details = " ";
              this.sendResearch.image = [];
              this.sendResearch._id = "";
              this.sendResearch.video = '';
              this.imagechange = false
            }).catch(err => this.alertNotificationService.alertError(err))

        }
      })

  }

  editResearch(research) {
    this.isEdit = true
    this.sendResearch = research
    if (this.sendResearch.schedule_time) {
      this.scheduleHour = new Date(this.sendResearch.schedule_time).getHours();
      this.scheduleMin = new Date(this.sendResearch.schedule_time).getMinutes();
    }
    if (this.sendResearch.type == 'poll' && Array.isArray(this.sendResearch.options)) {
      this.options = this.sendResearch.options.filter(e => e.option).map(e => e.option).join(';');
    } else {
      this.options = ''
    }
  }

  clearform() {
    this.sendResearch.approved_date = null;
    this.sendResearch.approved_by = "";
    this.sendResearch.details = " ";
    this.sendResearch.image = [];
    this.sendResearch._id = "";
    this.sendResearch.created_date = this.today
    this.sendResearch.approved = false
    this.sendResearch.type = '';
    this.sendResearch.category = '';
    this.sendResearch.reaction = [];
    this.sendResearch.language = '';
    this.sendResearch.created_by = '';
    this.sendResearch.video = '';
    this.sendResearch.schedule_time = null;
    this.sendResearch.isEdited = false;
    this.scheduleHour = null
    this.scheduleMin = null
    this.isEdit = true;
    this.options = null;
  }

  resetClock() {
    this.LastRefreshTime = new Date()
    this.NextRefreshTime = new Date()
    this.timeLeft = 300;
    if (this.interval) {
      this.interval.unsubscribe();
    }
    this.oberserableTimer()
  }

  pagechange() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }

  sendtime(date: Date) {
    var d = moment(date);
    if (d.isAfter(moment().startOf('day')) && d.isBefore(moment().endOf('day'))) {
      return d.format('H:mm A')
    } else if (d.isAfter(moment().subtract(1, 'day').startOf('day')) && d.isBefore(moment().startOf('day'))) {
      return `Yesterday ${d.format('H:mm A')}`
    } else if (d.isAfter(moment().startOf('week')) && d.isBefore(moment().subtract(1, 'day').startOf('day'))) {
      return d.format('dddd H:mm A')
    }
    return d.format('DD/MM/YYYY H:mm A')

  }

  filteredData: sendMarketResearch[] = []
  filter() {
    this.filteredData = [...this.allMarketResearch]
    this.totalSize = this.allMarketResearch.length;
    if (this.statusFilter == 'Approved') {
      this.filteredData = this.filteredData.filter(e => e.approved)
    } else if (this.statusFilter == 'Pending') {
      this.filteredData = this.filteredData.filter(e => !e.approved)
    }
    if (this.categoryFilter) {
      this.filteredData = this.filteredData.filter(e => e.category == this.categoryFilter)
    }
    if (this.languageFilter) {
      this.filteredData = this.filteredData.filter(e => e.language == this.languageFilter)
    }
    if (this.typeFilter) {
      this.filteredData = this.filteredData.filter(e => e.type == this.typeFilter)
    }

    if (this.totalSize != this.filteredData.length) {
      this.currentPage = 1
    }
    this.totalSize = this.filteredData.length
  }

  getUrl(s: string) {
    if (s.includes('/youtu.be/')) {
      return s.replace('/youtu.be/', '/www.youtube.com/embed/')
    }
    return s
  }

  getEmoji(s) {
    switch (s) {
      case "Like":
        return '👍';
      case "Love":
        return '❤️';
      case "Hot":
        return '🔥';
      case "Surprise":
        return '😱';
      case "EyeStar":
        return '🤩';
    }
  }

  getImage(name) {
    return `https://apps.invesmate.com/uploads/icons/${name}.png`
  }

  LastRefreshTime = new Date()
  NextRefreshTime = new Date()
  getRefreshTime() {
    return moment(moment(this.LastRefreshTime).add(5, 'minutes')).fromNow();
  }

  timeLeft: number = 300;
  interval;
  subscribeTimer: number = 0;

  oberserableTimer() {
    const source = timer(1000, 2000);
    this.interval = source.subscribe(val => {
      this.subscribeTimer = (this.timeLeft - val) * 1000;
      if (this.subscribeTimer == 0) {
        this.clearform();
      }
    });
  }

  openFileBrowser(event: any) {
    event.preventDefault();
    let element: HTMLElement = document.querySelector("#img") as HTMLElement;
    element.click()
  }
  openFileBrowser1(event: any) {
    event.preventDefault();
    let element: HTMLElement = document.querySelector("#img1") as HTMLElement;
    element.click()
  }
  openFileBrowser2(event: any) {
    event.preventDefault();
    let element: HTMLElement = document.querySelector("#img2") as HTMLElement;
    element.click()
  }
  openFileBrowser3(event: any) {
    event.preventDefault();
    let element: HTMLElement = document.querySelector("#img3") as HTMLElement;
    element.click()
  }

}
