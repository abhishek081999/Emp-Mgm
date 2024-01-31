import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Course } from 'src/app/model/course.model';
import { Instructor } from 'src/app/model/instructor.model';
import { Regstucount } from 'src/app/model/regstucount.model';
import { Reviewcount } from 'src/app/model/reviewcount.model';
import { AlertNotificationsService } from 'src/app/services/alert-notifications.service';
import { courseService } from 'src/app/services/course.service';
import { ExportService } from 'src/app/services/export.service';
import { FeedbackService } from 'src/app/services/feedback.service';
import { InstructorService } from 'src/app/services/instructor.service';
import { RegisterCourseService } from 'src/app/services/register-course.service';
import { environment } from 'src/environments/environment';

export class ALLDATA{
  teacherid:String;
  teachername: String;
  email: String;
  mobile: String;
  alternativenumber: String;
  address: String;
  city: String;
  state:String;
  country:String;
  pincode: String;
  language: String;
  coursecategory: String;
  trainingtype:String;
  recordeddemoclass:String;
  dob:Date;
  experience:String;
  activeinmarket:String;
  numberofcourses:Number;
  feedbackrating:Number;
  numberofstudents:Number;
  rating:Number;
}

export class DEAREQ{
  _id:String;
  details:String;
  name:String;
  email:String;
  phone:String;
  invid:String;
  instructorid:String;
  date:Date;
  seen:Boolean;
}



@Component({
  selector: 'app-instructor-list',
  templateUrl: './instructor-list.component.html',
  styleUrls: ['./instructor-list.component.scss']
})
export class InstructorListComponent implements OnInit {

  studentscount: Regstucount[];
  reviewscount: Reviewcount[];
  allInstructor: Array<Instructor>=[];
  Instructor: Array<Instructor>=[];
  pagefilter:string=''
  pagefilter1:string=''
  isinstructorAvailable=false;
  today = Date();
  dataLength;
  allcourses:Array<Course>=[]
  displayedColumns: string[];
  imageurl=environment.imageUrl;
  avgrating:Array<Regstucount>=[]
  allData:Array<ALLDATA>=[]

  totalSize:number
  currentPage:number=1
  pageSize:number=12
  
  


  constructor(
    private instructorService: InstructorService, 
    private alertNotificationService: AlertNotificationsService,
    private registerCourseService: RegisterCourseService,
    private courseService: courseService,
    private feedbackService: FeedbackService,
    private exportService: ExportService,
    private modalService: NgbModal) { }
 

  deactivatereq:DEAREQ[];
  ngOnInit() {
    this.refresh()
  }

  isLoading:boolean

  async refresh(){
    this.isLoading = true
    await this.instructorService.getAllInstructor().toPromise()
    .then(res=>{
      this.Instructor=res as Instructor[];
      this.Instructor=this.Instructor.filter(e=>e.role=="instructor").reverse();
    }).catch(err=>this.alertNotificationService.alertError(err))
     
    if(this.Instructor.length>0){
      this.isinstructorAvailable=true;

      this.feedbackService.getAvgRatingOfTeacher().toPromise()
      .then(res=>this.avgrating=res as Regstucount[])
      .catch(err=>this.alertNotificationService.alertError(err))
   
      this.instructorService.getDeactivatereq().toPromise()
      .then(res=>this.deactivatereq=res as DEAREQ[])
      .catch(err=>this.alertNotificationService.alertError(err))
      
      await this.registerCourseService.getstudentscountforteacher().toPromise()
      .then(res=>this.studentscount=res as Regstucount[])
      .catch(err=>this.alertNotificationService.alertError(err))
      
      await this.courseService.getreviewscountteacher().toPromise()
      .then(res=>this.reviewscount=res as Reviewcount[])
      .catch(err=>this.alertNotificationService.alertError(err))

      await this.courseService.getAllCourse().toPromise()
      .then(res=>{  
        this.allcourses=res as Course[];
        this.allcourses=this.allcourses.filter((e)=>e.approved==true)
      }).catch(err=>this.alertNotificationService.alertError(err))

      var c:Course[]
      for(var instructor of this.Instructor){
        var r=this.reviewscount.filter((e)=>e._id==instructor._id)[0]
        if(r){
          instructor.rating=r.trating;
        }
        else{
          instructor.rating=0;
        }
        var s=this.studentscount.filter((e)=>e._id==instructor._id)[0]
        if(s)
          instructor.numberofstudents=s.count
        else
          instructor.numberofstudents=0
        c = this.allcourses.filter((e)=>e.submittedby.includes(instructor._id))
        if(c)
          instructor.numberofonlinecourses=c.length
        else
        instructor.numberofonlinecourses=0
      }
    }
    this.filter()
    this.isLoading=false
  }

  onApproved(ins:Instructor){
    this.alertNotificationService.alertApprove()
    .then(result=>{
      if(result.isConfirmed){
        ins.approved=true;
        ins.rejected=false;
        ins.deactivate=false;
        this.instructorService.updateInstructorAc(ins).toPromise()
        .then(res => {
          this.alertNotificationService.toastAlertSuccess('Instructor Approved Successfully');
          this.refresh()
        }).catch(err=>this.alertNotificationService.alertError(err))
      }
    })
  }

  onRejected(ins:Instructor){
    this.alertNotificationService.alertCustomMsg('Do you want to Reject?')
    .then(result=>{
      if(result.isConfirmed){
        ins.approved=false;
        ins.rejected=true;
        ins.deactivate=false;
        this.instructorService.updateInstructorAc(ins).toPromise()
        .then(res => {
          this.alertNotificationService.toastAlertSuccess('Instructor Rejected Successfully');
          this.refresh()
        }).catch(err=>this.alertNotificationService.alertError(err))
      }
    })
  }

  onDeactivate(ins:Instructor){
    this.alertNotificationService.alertCustomMsg('Do you want to Deactivate?')
    .then(result=>{
      if(result.isConfirmed){
        ins.approved=true;
        ins.rejected=false;
        ins.deactivate=true;
        this.instructorService.updateInstructorAc(ins).toPromise()
        .then(res => {
          this.alertNotificationService.toastAlertSuccess('Instructor Account Deactivated Successfully');
          this.refresh()
        }).catch(err=>this.alertNotificationService.alertError(err))
      }
    })
  }

  onReactivate(ins:Instructor){
    this.alertNotificationService.alertApprove()
    .then(result=>{
      if(result.isConfirmed){
        ins.approved=true;
        ins.rejected=false;
        ins.deactivate=false;
        this.instructorService.updateInstructorAc(ins).toPromise()
        .then(res => {
          this.alertNotificationService.toastAlertSuccess('Instructor Approved Successfully');
          this.refresh()
        }).catch(err=>this.alertNotificationService.alertError(err))
      }
    })
  }

  getavgrating(id):number{
   var a= this.avgrating.filter((e)=>e._id==id)[0];
   if(a){
     return Number(a.count);
   }
   return 0;
  }

  print(){
    this.allInstructor.forEach((e)=>{
      var data= new ALLDATA()
      data.teacherid=e.invid;
      data.teachername=e.fullName;
      data.dob=e.dob;
      data.mobile=e.telephone;
      data.email=e.email;
      data.alternativenumber=e.alternativenumber;
      data.address=e.address;
      data.city=e.city;
      data.pincode=e.pincode;
      data.state=e.state;
      data.country=e.country;
      data.language=e.language.toString();
      data.coursecategory=e.specialization.toString();
      data.activeinmarket=e.activeinmarket;
      data.experience=e.experience;
      data.recordeddemoclass=e.democlass;
      data.trainingtype=e.trainingtype;
      data.feedbackrating=this.getavgrating(e._id);
      data.numberofcourses=e.numberofonlinecourses;
      data.numberofstudents=e.numberofstudents;
      data.rating=e.rating;
      this.allData.push(data)
    })
    this.exportService.exportonesheet('Instructors',this.allData);
  }

  deareq(id){
    if(this.deactivatereq){
      var a = this.deactivatereq.filter((e)=>e.instructorid==id && !e.seen) as DEAREQ[]
      if(a.length>0)
        return true
    }
    return false
  }
  
  reqmsg : DEAREQ[] = []
  msgpresent=false

  viewreq(id,content){
    this.reqmsg = this.deactivatereq.filter((e)=>e.instructorid==id) as DEAREQ[]
    if(this.reqmsg.length>0){
      this.msgpresent=true
      this.instructorService.updatedeactivatereq(id).subscribe(
        res=>{console.log('done')},
        err=>{console.log(err)}
      )
    }
    this.modalService.open(content, {centered: true}).result.then((result) => {
      this.reqmsg=[]
      this.instructorService.getDeactivatereq().toPromise()
      .then(res=>this.deactivatereq=res as DEAREQ[])
      .catch(err=>this.alertNotificationService.alertError(err))
    }).catch((res) => {this.reqmsg=[]});
  }

  delete(i,id){
    this.alertNotificationService.alertDelete()
    .then(result=>{
      if(result.isConfirmed){ 
        this.reqmsg.splice(i,1);
        this.instructorService.deletereq(id).toPromise()
        .then(res=>this.alertNotificationService.toastAlertSuccess('Deleted Successfully'))
        .catch(err=>this.alertNotificationService.alertError(err))
      }
    })
  }

  filter(){
    if(this.pagefilter1 && !this.pagefilter){
      if(this.pagefilter1=="approved"){
        this.allInstructor=this.Instructor.filter((e)=>e.approved);
      }
      else if(this.pagefilter1=="rejected"){
        this.allInstructor=this.Instructor.filter((e)=>e.rejected);
      }
      else if(this.pagefilter1=="profilecomplete"){
        this.allInstructor=this.Instructor.filter((e)=>e.profilecomplete);
      }
      else if(this.pagefilter1=="deactivate"){
        this.allInstructor=this.Instructor.filter((e)=>e.deactivate);
      }
      else{
        this.allInstructor=this.Instructor.filter(e=>!e.approved && !e.rejected);
      }
    }
    else if(this.pagefilter1 && this.pagefilter){
      this.pagefilter=this.pagefilter.toLowerCase();
      if(this.pagefilter1=="approved"){
        this.allInstructor=this.Instructor.filter((e)=>e.approved && (e.fullName.toLowerCase().indexOf(this.pagefilter)>-1 || e.telephone.toLowerCase().indexOf(this.pagefilter)>-1 || (e.state && e.state.toLowerCase().indexOf(this.pagefilter)>-1) ||(e.language && e.language.toString().toLowerCase().indexOf(this.pagefilter)>-1) || (e.specialization && e.specialization.toString().toLowerCase().indexOf(this.pagefilter)>-1) || (e.invid && e.invid.toLowerCase().indexOf(this.pagefilter)>-1)));
      }
      else if(this.pagefilter1=="rejected"){
        this.allInstructor=this.Instructor.filter((e)=>e.rejected && (e.fullName.toLowerCase().indexOf(this.pagefilter)>-1 || e.telephone.toLowerCase().indexOf(this.pagefilter)>-1 || (e.state && e.state.toLowerCase().indexOf(this.pagefilter)>-1) ||(e.language && e.language.toString().toLowerCase().indexOf(this.pagefilter)>-1) || (e.specialization && e.specialization.toString().toLowerCase().indexOf(this.pagefilter)>-1) || (e.invid && e.invid.toLowerCase().indexOf(this.pagefilter)>-1)));
      }
      else if(this.pagefilter1=="profilecomplete"){
        this.allInstructor=this.Instructor.filter((e)=>e.profilecomplete && (e.fullName.toLowerCase().indexOf(this.pagefilter)>-1 || e.telephone.toLowerCase().indexOf(this.pagefilter)>-1 || (e.state && e.state.toLowerCase().indexOf(this.pagefilter)>-1) ||(e.language && e.language.toString().toLowerCase().indexOf(this.pagefilter)>-1) || (e.specialization && e.specialization.toString().toLowerCase().indexOf(this.pagefilter)>-1) || (e.invid && e.invid.toLowerCase().indexOf(this.pagefilter)>-1)));
      }
      else if(this.pagefilter1=="deactivate"){
        this.allInstructor=this.Instructor.filter((e)=>e.deactivate && (e.fullName.toLowerCase().indexOf(this.pagefilter)>-1 || e.telephone.toLowerCase().indexOf(this.pagefilter)>-1 || (e.state && e.state.toLowerCase().indexOf(this.pagefilter)>-1) ||(e.language && e.language.toString().toLowerCase().indexOf(this.pagefilter)>-1) || (e.specialization && e.specialization.toString().toLowerCase().indexOf(this.pagefilter)>-1) || (e.invid && e.invid.toLowerCase().indexOf(this.pagefilter)>-1)));
      }
      else{
        this.allInstructor=this.Instructor.filter(e=>!e.approved && !e.rejected && (e.fullName.toLowerCase().indexOf(this.pagefilter)>-1 || e.telephone.toLowerCase().indexOf(this.pagefilter)>-1 || (e.state && e.state.toLowerCase().indexOf(this.pagefilter)>-1) ||(e.language && e.language.toString().toLowerCase().indexOf(this.pagefilter)>-1) || (e.specialization && e.specialization.toString().toLowerCase().indexOf(this.pagefilter)>-1) || (e.invid && e.invid.toLowerCase().indexOf(this.pagefilter)>-1)));
      }
    }
    else if(!this.pagefilter1 && this.pagefilter){
      this.pagefilter=this.pagefilter.toLowerCase();
      this.allInstructor=this.Instructor.filter((e)=>(e.fullName.toLowerCase().indexOf(this.pagefilter)>-1 || e.telephone.toLowerCase().indexOf(this.pagefilter)>-1 || (e.state && e.state.toLowerCase().indexOf(this.pagefilter)>-1) ||(e.language && e.language.toString().toLowerCase().indexOf(this.pagefilter)>-1) || (e.specialization && e.specialization.toString().toLowerCase().indexOf(this.pagefilter)>-1) || (e.invid && e.invid.toLowerCase().indexOf(this.pagefilter)>-1)));
    }
    else{
      this.allInstructor = [...this.Instructor]
    }
    if(this.totalSize!=this.allInstructor.length){
      this.currentPage=1
    }
    this.totalSize=this.allInstructor.length
  }

  pagechange(){
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }

  copied(){
    this.alertNotificationService.toastAlertSuccess('Url Copied')
  }
  
}
