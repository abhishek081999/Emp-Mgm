import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Annoucement, WpTemplate } from 'src/app/model/annoucement.model';
import { Course } from 'src/app/model/course.model';
import { ProductsDisplay } from 'src/app/model/product.model';
import { AlertNotificationsService } from 'src/app/services/alert-notifications.service';
import { AnnoucementService } from 'src/app/services/annoucement.service';
import { courseService } from 'src/app/services/course.service';
import { PackageService } from 'src/app/services/package.service';
import 'quill-emoji/dist/quill-emoji.js';
import { environment } from 'src/environments/environment';
import { EmployeeService } from 'src/app/services/employee.service';

@Component({
  selector: 'app-announcement',
  templateUrl: './announcement.component.html',
  styleUrls: ['./announcement.component.scss']
})
export class AnnouncementComponent implements OnInit {

  today = new Date();
  imageurl = environment.imageUrl;
  progressvalue: number;
  serverErrorMessages: any;
  searchq
  constructor(
    private annoucementService: AnnoucementService,
    private courseService: courseService,
    private employeeService: EmployeeService,
    private alertNotificationService: AlertNotificationsService,
    private productService: PackageService) { }

  allannoucement: Array<Annoucement> = []
  wpTemplate: WpTemplate[] = []
  annoucement: Annoucement = {
    _id: "",
    title: "",
    description: "",
    date: this.today,
    image: "",
    annoucementfor: null,
    approve: false,
    isReplyAllowed: false,
    type: 'educational',
    isWhatsappMsgSend: false,
    whatsapp_campaign_name: "",
    whatsapp_data: []

  };
  filesToUpload: File;
  fd = new FormData();
  allcourse: Course[] = []

  coursecodes = [{
    id: 'all',
    date: null
  }]
  allProduct: ProductsDisplay[] = []
  allProductid = []
  totalSize: number
  currentPage: number = 1
  pageSize: number = 20
  isLoading: boolean
  htmlText = `<p> If You Can Think It, You Can Do It. </p>`
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
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

        [{ 'align': [] }],
        ['emoji'],
        ['clean'],                                         // remove formatting button

        ['link'],
        //['link', 'image', 'video']
      ],
      handlers: { 'emoji': function () { } }
    },
  }
  selectedTemplate;

  ngOnInit() {
    this.courseService.getAllCourse().toPromise()
      .then(res => {
        this.allcourse = res as Course[];
        var codes = []
        this.allcourse.forEach(e => {
          if (e.approved) {
            codes.push({ id: e.coursecode, date: e.coursestartdate })
          }
        })
        this.coursecodes = this.coursecodes.concat(codes.reverse())
      }).catch(err => this.alertNotificationService.alertError(err))

    this.productService.getallProduct().toPromise()
      .then(res => {
        this.allProduct = res;
        this.allProduct.forEach(e => {
          if (!this.coursecodes.includes({ id: e.productid, date: null })) {
            this.coursecodes.push({ id: e.productid, date: null })
          }
        })
        this.allProductid = this.allProduct.filter(e => e.productid).map(m => m.productid);
        this.allProductid = [...new Set(this.allProductid)]
        this.coursecodes = [...this.coursecodes]
      }).catch(err => this.alertNotificationService.alertError(err))
    this.refreshList();
  }

  imagechange = false


  handelFileInput(event) {
    this.imagechange = true
    this.annoucement.image = event.target.files[0].name;
    this.filesToUpload = <File>event.target.files[0];
  }

  allids: String[] = []
  allemails: String[] = []

  postAnnoucement(annoucementForm: NgForm) {
    this.alertNotificationService.alertCustomMsg("Are You sure to proceed furthur?")
      .then(result => {
        if (result.isConfirmed) {
          this.fd = new FormData()
          if (this.imagechange) {
            this.fd.append("file", this.filesToUpload, this.filesToUpload['name']);
          }
          if (this.annoucement.isWhatsappMsgSend) {
            this.annoucement.whatsapp_data = this.splitted;
            this.annoucement.description = this.display;
            this.annoucement.whatsapp_campaign_name = this.campaginName;
          }

          this.fd.append("title", this.annoucement.title)
          this.fd.append("description", this.annoucement.description)
          this.fd.append("annoucementfor", this.annoucement.annoucementfor)
          this.fd.append("isReplyAllowed", this.annoucement.isReplyAllowed.toString())
          this.fd.append("type", this.annoucement.type)
          this.fd.append("isWhatsappMsgSend", this.annoucement.isWhatsappMsgSend.toString())
          if (this.annoucement.isWhatsappMsgSend) {
            this.fd.append("whatsapp_campaign_name", this.annoucement.whatsapp_campaign_name)
            this.annoucement.whatsapp_data.forEach(e => this.fd.append("whatsapp_data[]", e))
          }
          this.annoucementService.postAnnoucement(this.fd).toPromise()
            .then(res => {
              annoucementForm.resetForm();
              this.annoucement = new Annoucement();
              this.arr = [];
              this.displayTemplate = new WpTemplate();
              this.display = null
              this.alertNotificationService.toastAlertSuccess("Submitted Successfully");
              this.refreshList();
              this.clearform()
            }).catch(err => this.alertNotificationService.alertError(err))

        }
      })
  }
  filteredData: Annoucement[] = []
  filter() {
    if (this.searchq) {
      this.filteredData = this.allannoucement.filter(e =>
        e.annoucementfor.toLowerCase().includes(this.searchq.toLowerCase()) ||
        e.description.toLowerCase().includes(this.searchq.toLowerCase()) ||
        e.title.toLowerCase().includes(this.searchq.toLowerCase()))
    } else {
      this.filteredData = [...this.allannoucement]
    }
    if (this.totalSize != this.filteredData.length) {
      this.currentPage = 1
    }
    this.totalSize = this.filteredData.length
  }


  clearform() {
    this.annoucement.title = " ";
    this.annoucement.description = " ";
    this.annoucement.annoucementfor = " "
    this.annoucement.image = "";
    this.annoucement._id = "";
    this.annoucement.approve = false
    this.annoucement.isReplyAllowed = false
    this.annoucement.type = 'educational'
    this.annoucement.isWhatsappMsgSend = false
    this.annoucement.whatsapp_campaign_name = ''
    this.annoucement.whatsapp_data = []
  }

  refreshList() {
    this.isLoading = true
    this.annoucementService.getAllAnnoucement().toPromise()
      .then(res => {
        this.allannoucement = res as Annoucement[];

        this.totalSize = this.allannoucement.length;
        this.allannoucement.sort(function (a, b) {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        });
        this.filter()
        this.isLoading = false
      }).catch(err => { this.isLoading = false; this.alertNotificationService.alertError(err) })

    this.annoucementService.getWPTemplate().toPromise()
      .then(res => {
        this.wpTemplate = res as WpTemplate[];

      })
  }
  displayTemplate;
  display;
  campaginName;
  isTextarea: boolean = false;
  arr
  changeDisplayTemplate() {
    this.display = new String(this.displayTemplate['template']);
    this.campaginName = new String(this.displayTemplate['campaign_name']);
    this.isTextarea = true;
  }
  splitted = []
  templateEdit() {
    this.display = new String(this.displayTemplate['template']);
    this.splitted = this.arr.split(";");
    var split = this.splitted.pop()
    if (this.splitted && this.annoucement.isWhatsappMsgSend) {
      this.splitted.forEach((e, i) => {
        this.display = this.display.replace('{{' + (i + 1) + '}}', e)
      })
    }

  }
  onDelete(id) {
    this.alertNotificationService.alertDelete()
      .then(result => {
        if (result.isConfirmed) {
          this.annoucementService.deleteAnnoucement(id).toPromise()
            .then(res => {
              this.alertNotificationService.toastAlertSuccess("Deleted Successfully.")
              this.refreshList();
            }).catch(err => this.alertNotificationService.alertError(err))
        }
      })
  }



  async onApprove(ann: Annoucement) {
    this.alertNotificationService.alertApprove()
      .then(result => {
        if (result.isConfirmed) {
          ann.approve = true;
          this.annoucementService.approveAnnouncement(ann._id).toPromise()
            .then(res => {
              this.alertNotificationService.toastAlertSuccess("Approved Successfully.")
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

  pagechange() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }

}
