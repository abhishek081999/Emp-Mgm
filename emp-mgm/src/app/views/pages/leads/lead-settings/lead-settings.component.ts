import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { TitleCasePipe, UpperCasePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { LeadLanguages } from 'src/app/Enums/staticdata';
import { Employee } from 'src/app/model/employee.model';
import { CreateEmp, getLeadLevel, leadLevel, Leadstage } from 'src/app/model/leads.model';
import { AlertNotificationsService } from 'src/app/services/alert-notifications.service';
import { EmployeeService } from 'src/app/services/employee.service';
import { LeadsService } from 'src/app/services/leads.service';

@Component({
  selector: 'app-lead-settings',
  templateUrl: './lead-settings.component.html',
  styleUrls: ['./lead-settings.component.scss'],
  providers: [TitleCasePipe, UpperCasePipe]
})
export class LeadSettingsComponent implements OnInit {

  constructor(
    private leadsService: LeadsService,
    private alertNotificationService: AlertNotificationsService,
    private titlecasePipe: TitleCasePipe,
    private uppercasePipe: UpperCasePipe,
    private employeeService: EmployeeService,
  ) { }

  empLang: string = ''
  newstatus: string = ''
  newstage: string = ''

  allstatus: string[] = []
  allUser: Employee[] = []
  newsource: string = ''
  AddLevel: leadLevel = {
    _id: '',
    name: '',
    IsautoPromote: false,
    autoPromoteLevel: '',
    autoPromoteStageName: [],
    language: '',
    order: 0,
    stages: []
  }
  employee = [];
  selectedEmp: string[] = [];
  allLevel: getLeadLevel[] = [];
  leadsource = {
    name: 'Lead Source',
    sources: []
  }
  newoccupation
  occupations = {
    name: 'Occupations',
    lists: []
  }
  settings = {
    name: 'Lead Settings',
    settings: []
  }
  dupStage: Leadstage[] = []
  stagesList: string[] = []
  ngOnInit(): void {
    this.refresh();
  }
  async refresh() {
    await this.leadsService.getLevel().toPromise()
      .then(res => {
        this.allLevel = res as getLeadLevel[];
        this.onChange();
        this.allLevel.forEach(e => {
          if (e.employees && e.employees.length > 0) {
            this.selectedEmp.push(...e.employees);

          }
        })
      }).catch(err => this.alertNotificationService.alertError(err))

    this.employeeService.getAllEmployees('display', Departments.Sales.toString(), null).toPromise()
      .then(res => {
        this.allUser = res
        this.allUser = this.allUser.reverse();
        this.allUser.forEach(e => {
          this.employee.push({
            invid: e.invid,
            fullName: e.fullName,
            disabled: this.selectedEmp.includes(e.invid)
          })
        })
      }).catch(err => this.alertNotificationService.alertError(err));
    this.leadsService.getleadsource().toPromise()
      .then(res => {
        this.leadsource = res as any;
        if (!this.leadsource || !this.leadsource.sources) {
          this.leadsource = {
            name: 'Lead Source',
            sources: []
          }
        }
      }).catch(err => this.alertNotificationService.alertError(err))

    this.leadsService.getoccupations().toPromise()
      .then(res => {
        this.occupations = res as any;
        if (!this.occupations || !this.occupations.lists) {
          this.occupations = {
            name: 'Occupations',
            lists: []
          }
        }
      }).catch(err => this.alertNotificationService.alertError(err))

    this.leadsService.getleadsettings().toPromise()
      .then(res => {
        this.settings = res as any;
        if (!this.settings || !this.settings.settings) {
          this.settings = {
            name: 'Lead Settings',
            settings: []
          }
        }
      }).catch(err => this.alertNotificationService.alertError(err))
  }
  createLevel() {
    var specificlvl = new getLeadLevel();

    if (this.AddLevel.language) {
      specificlvl = this.allLevel.find(w => this.AddLevel.language == w._id);
    }
    this.AddLevel.order = specificlvl && specificlvl.levels ? specificlvl.levels.length : 0;
    this.AddLevel.IsautoPromote = false;
    this.AddLevel.autoPromoteLevel = '';
    this.AddLevel.autoPromoteStageName = [];
    this.AddLevel.stages = [];
    this.leadsService.postLevel(this.AddLevel).toPromise()
      .then(res => {
        if (res) {
          this.refresh()
          this.alertNotificationService.toastAlertSuccess('Level & language Added');
          this.AddLevel.language = '';
          this.AddLevel.name = '';
        }
      }).catch(err => this.alertNotificationService.alertError(err))
  }
  EmpLevelDrop: leadLevel[] = [];
  emlvl = new getLeadLevel()
  levelsList: string[] = []
  emplangchange(l) {
    this.emlvl = this.allLevel.find(f => l == f._id);
    this.EmpLevelDrop = this.emlvl ? this.emlvl.levels : [];
    this.EmpLevelDrop.forEach(e => this.levelsList.push(e.name.replace(' ', '_') + '_List'));
  }

  getLeadLevels: leadLevel[] = [];
  dupLevels: leadLevel[] = [];
  onChange() {
    var newobj = new getLeadLevel();
    newobj = this.allLevel.find(f => this.AddLevel.language == f._id);
    this.getLeadLevels = newobj && newobj ? newobj.levels : [];
    this.dupLevels = [...this.getLeadLevels]
  }
  onNavChange(level: leadLevel) {
    this.allstatus = []
    this.stagesList = []
    level.stages.forEach(e => {
      this.allstatus.push(...e.status);
      this.stagesList.push(e.name.replace(' ', '_') + '_List');
    })
    this.dupStage = [...level.stages]
    console.log(this.allstatus)
    var finalLevels = new getLeadLevel()
    finalLevels = this.allLevel.find(e => this.AddLevel.language == e._id)
    this.Lvldropdwn = finalLevels && finalLevels ? finalLevels.levels.filter(k => level.order < k.order) : [];
  }

  Lvldropdwn: leadLevel[] = [];
  patchLevel(o) {

    this.leadsService.postLevel(o).toPromise()
      .then(res => {
        this.refresh();
        this.alertNotificationService.toastAlertSuccess('Lead Updated');
      }).catch(err => this.alertNotificationService.alertError(err))
  }

  createStage(l) {
    var stage = new Leadstage();
    stage.name = this.titlecasePipe.transform(this.newstage.trim());
    stage.followup = false;
    stage.islaststage = false;
    stage.idealtime = 0;
    stage.maxtime = 0;
    stage.order = l && l.levels ? l.levels.length : 0;
    stage.leadLevelID = l._id;
    stage.status = []
    this.leadsService.postleadstage(stage).toPromise()
      .then(res => {
        this.refresh()
        this.newstage = null
        this.AddLevel.language = '';
        this.AddLevel.name = '';
        this.alertNotificationService.toastAlertSuccessAddExtraTime('Stage successfully Added, but the language needs to be re-selected.')
      }).catch(err => this.alertNotificationService.alertError(err))
  }
  emp = new CreateEmp();
  empAdd = null;
  CreateEmp(l) {
    this.emp._id = l._id;
    this.emp.employee = l.employee;
    this.emp.employee.push(this.empAdd)
    this.leadsService.createEmpUnderLevel(this.emp).toPromise()
      .then(res => {
        this.empAdd = null;
        this.alertNotificationService.toastAlertSuccess('Employee Added');
        this.employee.forEach(e => {
          if (this.emp.employee.includes(e.invid)) {
            e.disabled = true;
          }
        })
      }).catch(err => this.alertNotificationService.alertError(err))
  }
  createStatus(stage: Leadstage) {
    this.newstatus = this.titlecasePipe.transform(this.newstatus.trim());
    if (this.newstatus != '' && !this.allstatus.includes(this.newstatus)) {
      stage.status.push(this.newstatus);
      this.leadsService.postleadstage(stage).toPromise()
        .then(res => {
          this.allstatus.push(this.newstatus)
          this.newstatus = null
          this.alertNotificationService.toastAlertSuccess('Stage Updated')
        }).catch(err => this.alertNotificationService.alertError(err))
    } else if (this.allstatus.includes(this.newstatus)) {
      this.alertNotificationService.alertInfo('Duplicate Status')
    }
  }

  saveStage(stage: Leadstage) {
    this.leadsService.postleadstage(stage).toPromise()
      .then(res => {
        this.alertNotificationService.toastAlertSuccess('Stage Updated')
      }).catch(err => this.alertNotificationService.alertError(err))
  }

  createSource() {
    this.leadsource.name = 'Lead Source';
    this.newsource = this.uppercasePipe.transform(this.newsource.trim());
    if (this.newsource != '' && !this.leadsource.sources.includes(this.newsource)) {
      this.leadsource.sources.push(this.newsource)
      this.leadsService.postleadsource(this.leadsource).toPromise()
        .then(res => {
          this.newsource = null
          this.alertNotificationService.toastAlertSuccess('Lead Source Updated')
        }).catch(err => { this.alertNotificationService.alertError(err); this.refresh() })
    } else if (this.leadsource.sources.includes(this.newsource)) {
      this.alertNotificationService.alertInfo('Duplicate Lead Source')
    }
  }



  createoccupation() {
    this.occupations.name = 'Occupations';
    this.newoccupation = this.titlecasePipe.transform(this.newoccupation.trim());
    if (this.newoccupation != '' && !this.occupations.lists.includes(this.newoccupation)) {
      this.occupations.lists.push(this.newoccupation)
      this.leadsService.postoccupations(this.occupations).toPromise()
        .then(res => {
          this.newoccupation = null
          this.alertNotificationService.toastAlertSuccess('Occupations Updated')
        }).catch(err => { this.alertNotificationService.alertError(err); this.refresh() })
    } else if (this.occupations.lists.includes(this.newoccupation)) {
      this.alertNotificationService.alertInfo('Duplicate Occupations')
    }
  }

  updateleadsettings() {
    this.settings.name = 'Lead Settings';
    this.leadsService.postleadsettings(this.settings).toPromise()
      .then(res => {
        this.alertNotificationService.toastAlertSuccess('Settings Updated')
      }).catch(err => { this.alertNotificationService.alertError(err); })
  }

  stagename(s) {
    return s.replace(' ', '_') + '_List';
  }

  drop(event: CdkDragDrop<string[]>, allStages) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
      var stage1 = allStages.find(e => e.name.replace(' ', '_') + '_List' == event.previousContainer.id)
      var stage2 = allStages.find(e => e.name.replace(' ', '_') + '_List' == event.container.id)
      if (stage1 && stage2) {
        this.leadsService.postleadstage(stage1).toPromise()
          .then(res => {
            console.log('Stage Updated')
          }).catch(err => this.alertNotificationService.alertError(err))
        this.leadsService.postleadstage(stage2).toPromise()
          .then(res => {
            console.log('Stage Updated')
          }).catch(err => this.alertNotificationService.alertError(err))
      }
    }
    console.log(event)
  }
  drop1(event: CdkDragDrop<Leadstage[]>, allStages) {
    moveItemInArray(allStages, event.previousIndex, event.currentIndex);
    var updates = []
    for (var i = 0; i < allStages.length; i++) {
      allStages[i].order = i
      if (allStages[i].name != this.dupStage[i].name) {
        updates.push(allStages[i])
      }
    }
    if (updates.length > 0) {
      this.leadsService.updatestageorder(updates).toPromise()
        .then(res => {
          console.log('Stage Order Updated')
        }).catch(err => { this.alertNotificationService.alertError(err); })
    }

  }

  dropLabel(event: CdkDragDrop<Leadstage[]>) {
    moveItemInArray(this.getLeadLevels, event.previousIndex, event.currentIndex);
    var updates = []
    for (var i = 0; i < this.getLeadLevels.length; i++) {
      this.getLeadLevels[i].order = i
      if (this.getLeadLevels[i]._id != this.dupLevels[i]._id) {
        updates.push(this.getLeadLevels[i])
      }
    }
    if (updates.length > 0) {
      this.leadsService.updatelevelorder(updates).toPromise()
        .then(res => {
          this.alertNotificationService.toastAlertSuccess('Level Order Updated')
        }).catch(err => { this.alertNotificationService.alertError(err); })
    }

  }

  alllang = LeadLanguages;

  SearchFn(term: string, item: leadLevel) {
    term = term.toLowerCase();
    return item.name.toLowerCase().indexOf(term) > -1 || item._id.toLowerCase().indexOf(term) > -1;
  }
  SearchFnEmp(term: string, item: Employee) {
    term = term.toLowerCase();
    return (item.fullName && item.fullName.toLowerCase().indexOf(term) > -1) || (item.invid && item.invid.toLowerCase().indexOf(term) > -1);
  }

  removeuser(l, i, s) {
    if (l && l.employee && l.employee.length > 0) {
      l.employee.splice(i, 1);
      this.emp._id = l._id;
      this.emp.employee = l.employee;
      console.log(l)
      this.leadsService.createEmpUnderLevel(this.emp).toPromise()
        .then(res => {
          this.employee.forEach(e => {
            if (e.invid == s) {
              e.disabled = false;
              console.log(e)
            }
          })
          this.alertNotificationService.toastAlertSuccess('Employee Removed');
        }).catch(err => this.alertNotificationService.alertError(err))
    }
  }
}
