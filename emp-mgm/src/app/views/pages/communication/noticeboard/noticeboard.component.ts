import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Notice, WpTemplate } from 'src/app/model/annoucement.model';
import { AlertNotificationsService } from 'src/app/services/alert-notifications.service';
import { NoticeService } from 'src/app/services/notice.service';
import 'quill-emoji/dist/quill-emoji.js';
import { EmployeeService } from 'src/app/services/employee.service';
import { Department, Team } from 'src/app/model/employee.model';
import { AnnoucementService } from 'src/app/services/annoucement.service';

@Component({
  selector: 'app-noticeboard',
  templateUrl: './noticeboard.component.html',
  styleUrls: ['./noticeboard.component.scss']
})
export class NoticeboardComponent implements OnInit {

  searchq
  allNotice: Notice[];
  isEdit: boolean;
  Tags = [
    'Urgent',
    'Important',
    'Confidential',
    'High Priority',
    'Low Priority',
    'Follow-Up',
    'Action Required',
    'DeadLine',
    'For Your Information',
  ];

  status = [
    'Approve',
    'Pending'
  ];
  allTeams: Team[];
  constructor(
    private annoucementService: AnnoucementService,
    private noticeService: NoticeService,
    private employeeService: EmployeeService,
    private alertNotificationService: AlertNotificationsService,
  ) { }
  departments: Department[] = [];
  allnotice: Array<Notice> = []
  wpTemplate: WpTemplate[] = []
  notice: Notice = {
    _id: "",
    title: "",
    description: "",
    image: "",
    department: [],
    team: [],
    roles: [],
    isApprove: false,
    tags: [],
    isWhatsappMsgSend: false,
    whatsapp_campaign_name: "",
    whatsapp_data: []
  };
  filesToUpload: File;
  fd = new FormData();

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
  startDate = null
  endDate = null
  department = null
  StatusFilter
  roles = [];
  ngOnInit() {
    this.employeeService.getallrole().toPromise()
      .then(res => {
        var roles = res;
        this.roles = [...new Set(roles.filter(e => e.name).map(e => e.name))]
      }).catch(err => this.alertNotificationService.alertError(err))

    this.employeeService.getAllDepartment('all').toPromise()
      .then(res => {
        this.departments = res as Department[];
      }).catch(err => this.alertNotificationService.alertError(err))

    this.employeeService.getAllTeams('all', null).toPromise()
      .then(res => {
        this.allTeams = res as Team[];
      }).catch(err => this.alertNotificationService.alertError(err))
    this.refreshList();
  }

  imagechange = false

  handelFileInput(event) {
    this.imagechange = true
    this.notice.image = event.target.files[0].name;
    this.filesToUpload = <File>event.target.files[0];
  }

  noticefor: String[] = []

  postNotice(annoucementForm: NgForm) {
    this.alertNotificationService.alertCustomMsg("Are You sure to proceed furthur?")
      .then(result => {
        if (result.isConfirmed) {
          this.fd = new FormData()
          if (this.imagechange) {
            this.fd.append("file", this.filesToUpload, this.filesToUpload['name']);
          }
          if (this.notice.isWhatsappMsgSend) {
            this.notice.whatsapp_data = this.splitted;
            this.notice.description = this.display;
            this.notice.whatsapp_campaign_name = this.campaginName;
          }
          this.fd.append("_id", this.notice._id)
          this.fd.append("title", this.notice.title)
          this.fd.append("description", this.notice.description)
          if (Array.isArray(this.notice.roles)) {
            this.notice.roles.forEach(e => {
              this.fd.append("roles[]", e);
            });
          }
          if (Array.isArray(this.notice.team)) {
            this.notice.team.forEach(e => {
              this.fd.append("team[]", e);
            });
          }
          if (Array.isArray(this.notice.department)) {
            this.notice.department.forEach(e => {
              this.fd.append("department[]", e);
            });
          }
          if (Array.isArray(this.notice.tags)) {
            this.notice.tags.forEach(e => {
              this.fd.append("tags[]", e);
            });
          }
          this.fd.append("isWhatsappMsgSend", this.notice.isWhatsappMsgSend.toString())
          if (this.notice.isWhatsappMsgSend) {
            this.fd.append("whatsapp_campaign_name", this.notice.whatsapp_campaign_name)
            this.notice.whatsapp_data.forEach(e => this.fd.append("whatsapp_data[]", e))
          }
          this.noticeService.postNotice(this.fd).toPromise()
            .then(res => {
              annoucementForm.resetForm();
              this.notice = new Notice();
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
  editNotice(notice) {
    this.isEdit = true
    this.notice = notice
    this.pagechange();
  }


  filteredData: Notice[] = []
  filter() {
    if (this.searchq) {
      this.filteredData = this.allNotice.filter(e =>
        e.description.toLowerCase().includes(this.searchq.toLowerCase()) ||
        e.title.toLowerCase().includes(this.searchq.toLowerCase()))
    } else {
      this.filteredData = [...this.allNotice]
    }
    if (this.totalSize != this.filteredData.length) {
      this.currentPage = 1
    }
    this.totalSize = this.filteredData.length
  }




  clearform() {
    this.notice.title = null;
    this.notice.description = null;
    this.notice.roles = [];
    this.notice.department = [];
    this.notice.tags = [];
    this.notice.team = [];
    this.notice.image = null;
    this.notice._id = null;
    this.notice.isApprove = false
    this.notice.isWhatsappMsgSend = false
    this.notice.whatsapp_campaign_name = ''
    this.notice.whatsapp_data = []
  }

  departmentFilter = null;
  teamFilter = null;
  rolesFilter = null;
  tagsFilter = null;
  refreshList() {
    this.isLoading = true
    this.noticeService.getAllNotice(this.startDate, this.endDate, this.departmentFilter, this.StatusFilter, this.teamFilter, this.rolesFilter, this.tagsFilter).toPromise()
      .then(res => {
        this.allNotice = res as Notice[];
        this.totalSize = this.allNotice.length;
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
    if (this.splitted && this.notice.isWhatsappMsgSend) {
      this.splitted.forEach((e, i) => {
        this.display = this.display.replace('{{' + (i + 1) + '}}', e)
      })
    }

  }
  onDelete(id) {
    this.alertNotificationService.alertDelete()
      .then(result => {
        if (result.isConfirmed) {
          this.noticeService.deleteNotice(id).toPromise()
            .then(res => {
              this.alertNotificationService.toastAlertSuccess("Deleted Successfully.")
              this.refreshList();
            }).catch(err => this.alertNotificationService.alertError(err))
        }
      })
  }

  async onApprove(ann: Notice) {
    this.alertNotificationService.alertApprove()
      .then(result => {
        if (result.isConfirmed) {
          ann.isApprove = true;
          this.noticeService.approveNotice(ann._id).toPromise()
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
