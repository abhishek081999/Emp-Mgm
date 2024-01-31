import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { getLeadLevel, leadLevel, Leads } from 'src/app/model/leads.model';
import * as XLSX from 'xlsx';
import { SelectionModel } from '@angular/cdk/collections';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { LeadsService } from 'src/app/services/leads.service';
import * as moment from 'moment';
import { AlertNotificationsService } from 'src/app/services/alert-notifications.service';
import { LeadLanguages } from 'src/app/Enums/staticdata';

@Component({
  selector: 'app-import-xlsx-lead',
  templateUrl: './import-xlsx-lead.component.html',
  styleUrls: ['./import-xlsx-lead.component.scss']
})
export class ImportXlsxLeadComponent implements OnInit {
  filesToUpload: any;
  arrayBuffer: ArrayBuffer;
  filterQuery = "";
  rowsOnPage = 10;
  sortBy = "date";
  sortOrder = "desc";
  today = Date();
  dataLength;
  displayedColumns: string[];
  dataSource: MatTableDataSource<any>;
  selection = new SelectionModel<any>(true, []);
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  constructor(
    public activeModal: NgbActiveModal, private leadService: LeadsService,
    private alertNotificationService: AlertNotificationsService,
    private leadsService: LeadsService,
  ) { }
  offSet = 0;
  leadsource = {
    name: 'Lead Source',
    sources: []
  }
  campaignDate;
  allLevel: getLeadLevel[] = [];
  allcampaign = [];
  alllang = LeadLanguages;
  async ngOnInit() {
    this.displayedColumns = ['select', 'leaddate', 'name', 'email', 'phone'];
    var time = null
    await this.leadService.getCurrentTime().toPromise()
      .then(res => time = new Date(res['time']))
      .catch(err => time = new Date())
    await this.leadsService.getLevel().toPromise()
      .then(res => {
        this.allLevel = res as getLeadLevel[];
      }).catch(err => this.alertNotificationService.alertError(err))
    await this.leadService.getCampaignList().toPromise()
      .then(res => {
        this.allcampaign = res
      }).catch(err => this.alertNotificationService.alertError(err))
    this.leadService.getleadsource().toPromise()
      .then(res => {
        this.leadsource = res as any;
        if (!this.leadsource || !this.leadsource.sources) {
          this.leadsource = {
            name: 'Lead Source',
            sources: []
          }
        }
      }).catch(err => this.alertNotificationService.alertError(err))
    this.offSet = new Date().getTime() - (time ? time.getTime() : new Date().getTime());
  }
  newLeads: Leads[] = []
  phone = [];
  email = [];
  upload() {
    this.newLeads = []
    var data = this.selection.selected
    data.forEach(e => {
      if ((e.phone && !this.phone.includes(e.phone.toString())) || (e.email && !this.email.includes(e.email.toString()))) {
        var l = new Leads()

        var ld = moment(l.leaddate, 'YYYY-MM-DD').isValid();
        if (!ld) {
          l.leaddate = new Date(l.leaddate)
        }
        l.email = e.email ? e.email : "";
        l.name = e.name ? e.name : "";
        l.leadsource = this.newSingleLead.leadsource;
        l.leaddate = e.leaddate ? e.leaddate : new Date(this.campaignDate);
        l.phone = e.phone ? e.phone.toString() : "";
        l.leadstatus = "New"
        // l.campaign_name = e.campaign_name ? e.campaign_name.toString().toUpperCase() : e.campaign_name;
        l.campaign_name = this.newSingleLead.campaign_name;
        l.language = this.newSingleLead.language;
        l.level = this.LevelObj._id;
        l.uploaddate = this.CorrectTime();
        this.newLeads.push(l);
        if (e.phone) {
          this.phone.push(e.phone.toString());
        }
        if (e.email) {
          this.email.push(e.email.toString());
        }

      }

    })
    console.log(this.newLeads)
    this.activeModal.close(this.newLeads)
  }
  newSingleLead: Leads = {
    uploaddate: this.CorrectTime(),
    leaddate: this.CorrectTime(),
    leadsource: '',
    leadstatus: "New",
    language: '',
    level: '',
    name: '',
    phone: '',
    email: '',
    campaign_name: null,
    retarget: false
  }
  CampaignLevelDrop: leadLevel[] = [];
  NewAllLvl = new getLeadLevel();
  Lang;
  leadSource;
  DateChange;
  LevelChng;

  LevelObj = new leadLevel()
  levelObj2; // for valifation extra varrieble needed
  existingCampaign = []
  isExistingCampaign = false;
  Onchange() {
    if (this.newSingleLead.leadsource && !this.isExistingCampaign) {
      this.newSingleLead.campaign_name = this.newSingleLead.leadsource;
    }
    if (this.campaignDate && !this.isExistingCampaign) {
      var D = moment(this.campaignDate).format('DD_MMM_YY');
      this.newSingleLead.campaign_name += '_' + D;
    }
    if (this.newSingleLead.language) {
      this.CampaignLevelDrop = [];
      this.NewAllLvl = this.allLevel.find(f => this.newSingleLead.language == f._id);
      this.CampaignLevelDrop = this.NewAllLvl ? this.NewAllLvl.levels : [];
      if (!this.isExistingCampaign) {
        this.newSingleLead.campaign_name += '_' + this.newSingleLead.language;
      } else {
        this.existingCampaign = this.allcampaign.filter(e => e.indexOf(this.newSingleLead.language) > 0);
        if (this.existingCampaign.length == 0 || !this.existingCampaign.includes(this.newSingleLead.campaign_name)) {
          this.newSingleLead.campaign_name = null;
        }
      }
      this.LevelObj = this.levelObj2   // any object assign to leadLevel variable [it needs for validation] 
      // if (this.newSingleLead.language != this.LevelObj.language) {
      //   this.LevelObj.name = '';
      // }
    }
    // if (this.LevelObj && !this.isExistingCampaign) {
    //   this.newSingleLead.campaign_name += '_' + this.LevelObj.name;
    // }
  }

  uploadedData
  handelFile(event) {
    this.filesToUpload = event.target.files[0];
    let element: HTMLElement = document.querySelector("#backup + .input-group .file-upload-info") as HTMLElement;
    element.setAttribute('value', event.target.files[0].name)
    let fileReader = new FileReader();
    fileReader.readAsArrayBuffer(this.filesToUpload);
    fileReader.onload = (e) => {
      this.arrayBuffer = fileReader.result as ArrayBuffer;
      var data = new Uint8Array(this.arrayBuffer);
      var arr = new Array();
      for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
      var bstr = arr.join("");
      var workbook = XLSX.read(bstr, { type: 'binary', cellDates: true, dateNF: 'yyyy/mm/dd;@' });
      var first_sheet_name = workbook.SheetNames[0];
      var worksheet = workbook.Sheets[first_sheet_name];
      this.uploadedData = XLSX.utils.sheet_to_json(worksheet, { raw: true });
      this.uploadedData.forEach(e => {
        if (moment(e.leaddate).isValid()) {
          e.leaddate = moment(e.leaddate).add(1, 'day').startOf('day').toDate()
        } else {
          e.leaddate = new Date();
        }
      });
      console.log(this.uploadedData)
      this.dataSource = new MatTableDataSource(this.uploadedData.reverse());
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.dataLength = this.uploadedData.length;
    }
  }

  openFileBrowser(event: any) {
    event.preventDefault();
    let element: HTMLElement = document.querySelector("#backup") as HTMLElement;
    element.click()
  }

  getPageData() {
    if (this.dataSource)
      return this.dataSource._pageData(this.dataSource._orderData(this.dataSource.filteredData));
    return []
  }

  isEntirePageSelected() {
    return this.getPageData().every((row) => this.selection.isSelected(row));
  }

  isAllSelected() {
    if (this.dataSource) {
      const numSelected = this.selection.selected.length;
      const numRows = this.dataSource.filteredData.length;
      return numSelected === numRows;
    }
    return false
  }

  masterToggle() {
    this.isEntirePageSelected() ?
      this.selection.deselect(...this.getPageData()) :
      this.selection.select(...this.getPageData());
  }


  checkboxLabel(row?, i?): string {
    if (!row) {
      return `${this.isEntirePageSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${i}`;
  }

  CorrectTime() {
    return new Date(new Date().getTime() - this.offSet)
  }

}
