import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { courseschedule } from 'src/app/model/course.model';
import { Webinar } from 'src/app/model/webinar.model';
import { AlertNotificationsService } from 'src/app/services/alert-notifications.service';
import { courseService } from 'src/app/services/course.service';

@Component({
  selector: 'app-create-webinar',
  templateUrl: './create-webinar.component.html',
  styleUrls: ['./create-webinar.component.scss'],
  providers: [DatePipe]
})
export class CreateWebinarComponent implements OnInit {

  hide=false;
  @Input() data

  constructor(
    public activeModal: NgbActiveModal,
    private alertNotificationService:AlertNotificationsService,
    public datepipe: DatePipe,
    private CourseService:courseService
  ) { }
  schedule=new courseschedule()
  webinarres=new Webinar()
  webinar:Webinar={
    uuid: '', 
    id: 0,
    host_id: '',
    topic: '',
    start_time: '', 
    duration: 75,
    created_at: '',
    password: '', //max 10
    settings: {
      host_video: true, //true
      participant_video: true, //true
      cn_meeting:false,
      in_meeting:true,
      join_before_host:false,
      jbh_time:0,
      mute_upon_entry:false,
      watermark:true,
      use_pmi:false,
      approval_type:2,
      audio:'both',
      auto_recording:'cloud',
      enforce_login:false,
      enforce_login_domains:'',
      alternative_hosts:'',
      close_registration:false,
      show_share_button:false,
      allow_multiple_devices:false,
      registrants_confirmation_email:true,
      waiting_room:false,
      request_permission_to_unmute_participants:false,
      global_dial_in_countries:[],
      registrants_email_notification:false,
      meeting_authentication:false,
      encryption_type:'enhanced_encryption',
      },
  }

  ngOnInit() {
    this.schedule=this.data.schedule;
    if(this.schedule.coursetype=="Free Live Class"){
      this.webinar.duration=75;
      this.type='Free';
    }    
    else{
      this.webinar.duration=135;
      this.type='Paid'
    }
      
    if(this.data.edit){
      this.webinar=this.data.webinar as Webinar;
      this.webinar.start_time=this.datepipe.transform(this.webinar.start_time.toString(),"yyyy-MM-ddTHH:mm:ss")
    }
    else{
      this.webinar.topic=this.data.sc.coursename;
      this.webinar.start_time=this.datepipe.transform(this.getdatetime(this.data.sc.date,this.data.sc.time),"yyyy-MM-ddTHH:mm:ss")
    }
  }
  submit=false
  errormsg=''
  type=''
  submitForm(){
    this.errormsg=''
    this.webinar.start_time=this.datepipe.transform(this.webinar.start_time.toString(),"yyyy-MM-ddTHH:mm:ss")
    //console.log(this.datepipe.transform(this.webinar.start_time.toString(),"yyyy-MM-ddTHH:mm:ssZ"))
    //console.log(new Date(this.webinar.start_time.toString()).toISOString().slice(0,19)+'Z');
    this.webinar.created_at=new Date(this.webinar.start_time.toString()).toISOString().slice(0,19)+'Z'
    console.log(this.webinar)
    this.submit=true
    if(this.data.edit){
      this.CourseService.updatewebinar(this.webinar,this.type).toPromise()
      .then(res=>{
        this.webinarres=this.webinar
        this.hide=true
      }).catch(err=>{
        this.submit=false
        this.alertNotificationService.alertError(err)
      })
    }
    else{
      this.CourseService.createwebinar(this.webinar,this.type).toPromise()
      .then(res=>{
          this.webinarres=res['0'] as Webinar;
          this.hide=true;
          console.log(res['0']);
      }).catch(err=>{
        this.submit=false
        this.alertNotificationService.alertError(err)
      })
    }
  }


  getdatetime(date,time):Date{
    var finaldate=new Date();
      switch(time){
        case "8AM - 10AM":
         finaldate=this.addHours(this.startOfDay(new Date(date)), 8)
          break;
        case "10:30AM – 12:30PM":
          finaldate=this.addMinutes(this.addHours(this.startOfDay(new Date(date)), 10),30)
          break;
        case "3PM – 5PM":
          finaldate=this.addHours(this.startOfDay(new Date(date)), 15)
          break;
        case "5:30PM – 7:30PM":
          finaldate=this.addMinutes(this.addHours(this.startOfDay(new Date(date)), 17),30)
          break;
        case "8PM – 10PM":
          finaldate=this.addHours(this.startOfDay(new Date(date)), 20)
          break;
        case "10:00 AM – 11:00 AM":
          finaldate=this.addHours(this.startOfDay(new Date(date)), 10)
          break;
        case "11:30 AM – 12:30 PM":
          finaldate=this.addMinutes(this.addHours(this.startOfDay(new Date(date)), 11),30)
          break;
        case "1:00 PM – 2:00 PM":
          finaldate=this.addHours(this.startOfDay(new Date(date)), 13)
          break;
        case "2:30 PM – 3:30 PM":
          finaldate=this.addMinutes(this.addHours(this.startOfDay(new Date(date)), 14),30)
          break;
        case "4:00 PM – 5:00 PM":
          finaldate=this.addHours(this.startOfDay(new Date(date)), 16)
          break;
        case "5:30 PM – 6:30 PM":
            finaldate=this.addMinutes(this.addHours(this.startOfDay(new Date(date)), 17),30)
          break;
        case "7:00 PM – 8:00 PM":
          finaldate=this.addHours(this.startOfDay(new Date(date)), 19)
          break;
        case "8:30 PM – 9:30 PM":
          finaldate=this.addMinutes(this.addHours(this.startOfDay(new Date(date)), 20),30)
          break;
      }
      return finaldate;
  }

  addHours(date: Date, hh: number) {
    var d = new Date(date)
    d.setHours(d.getHours()+hh);
    return d
  }
  
  addMinutes(date: Date, mm: number) {
    var d = new Date(date)
    d.setMinutes(d.getMinutes()+mm);
    return d
  }
  
  endOfDay( date: Date) {
    var d= new Date(date);
    d.setHours(23,59,59);
    return d
  }
  startOfDay(date: Date) {
    var d= new Date(date);
    d.setHours(0,0,0);
    return d
  }

}
