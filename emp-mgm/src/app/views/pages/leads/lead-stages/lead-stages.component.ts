import { TitleCasePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Leadstage } from 'src/app/model/leads.model';
import { AlertNotificationsService } from 'src/app/services/alert-notifications.service';
import { LeadsService } from 'src/app/services/leads.service';

@Component({
  selector: 'app-lead-stages',
  templateUrl: './lead-stages.component.html',
  styleUrls: ['./lead-stages.component.scss'],
  providers:[ TitleCasePipe]
})
export class LeadStagesComponent implements OnInit {

  constructor(
    private leadsService : LeadsService,
    private alertNotificationService : AlertNotificationsService,
    private titlecasePipe:TitleCasePipe) { }

  newstatus:string=''
  newstage:string=''
  allStages : Leadstage[]=[]
  allstatus:string[]=[]
  ngOnInit(): void {
    this.refresh();
  }
  
  refresh(){
    this.leadsService.getleadstage().toPromise()
    .then(res=>{
      this.allStages = res;
      this.allStages.forEach(e=>this.allstatus.push(...e.status))
      console.log(this.allstatus)
    }).catch(err=>this.alertNotificationService.alertError(err))
  }

  createStage(){
    var stage = new Leadstage();
    stage.name = this.titlecasePipe.transform(this.newstage.trim());
    stage.status=[]
    this.leadsService.postleadstage(stage).toPromise()
    .then(res=>{
      this.allStages.push(res)
      console.log(this.allStages)
      this.newstage = null
      this.alertNotificationService.toastAlertSuccess('Stage Added')
    }).catch(err=>this.alertNotificationService.alertError(err))
  }

  createStatus(stage : Leadstage){
    this.newstatus=this.titlecasePipe.transform(this.newstatus.trim());
  
    if(this.newstatus != '' && !this.allstatus.includes(this.newstatus)){
      stage.status.push(this.newstatus);
      this.leadsService.postleadstage(stage).toPromise()
      .then(res=>{
        this.newstatus=null
        this.alertNotificationService.toastAlertSuccess('Stage Updated')
      }).catch(err=>this.alertNotificationService.alertError(err))
    }else if(this.allstatus.includes(this.newstatus)){
      this.alertNotificationService.alertInfo('Duplicate Status')
    }
  }

}
