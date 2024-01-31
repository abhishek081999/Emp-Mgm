import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Course } from 'src/app/model/course.model';
import { Instructor } from 'src/app/model/instructor.model';
import { Qualification } from 'src/app/model/qualification.model';
import { Regstucount } from 'src/app/model/regstucount.model';
import { Reviewcount } from 'src/app/model/reviewcount.model';
import { AlertNotificationsService } from 'src/app/services/alert-notifications.service';
import { courseService } from 'src/app/services/course.service';
import { FeedbackService } from 'src/app/services/feedback.service';
import { InstructorService } from 'src/app/services/instructor.service';
import { RegisterCourseService } from 'src/app/services/register-course.service';
import { environment } from 'src/environments/environment';
import { Subscription as subs } from 'rxjs' ;

@Component({
  selector: 'app-instructor-profile',
  templateUrl: './instructor-profile.component.html',
  styleUrls: ['./instructor-profile.component.scss']
})
export class InstructorProfileComponent implements OnInit,OnDestroy {
  id: string;
  imageurl=environment.imageUrl;
  studentscount: Regstucount[];
  reviewscount: Reviewcount[];
  numberofrating: number;
  reviewscountcourse: Reviewcount[];
  studentscountcourse: Regstucount[];
  allQualifications: Array<Qualification>=[]
  avgrating: Regstucount[];

  constructor(
      private instructorService:InstructorService, 
      private route: ActivatedRoute, 
      private courseService: courseService,
      private registerCourseService: RegisterCourseService,
      private alertNotificationService: AlertNotificationsService,
      private feedbackService: FeedbackService) { }

  ngOnDestroy() {
    if(this.paramSub)
      this.paramSub.unsubscribe()
  }

  ins=new Instructor();
  courselist: Array<Course>=[]
  paramSub: subs
  
  ngOnInit() {
    this.paramSub = this.route.paramMap.subscribe(params=>{
      this.id=params.get('id');
      if(this.id)
        this.refresh()
    });
    
  }

  async refresh(){
    this.feedbackService.getAvgRatingOfTeacher().toPromise()
      .then(res=>this.avgrating=res as Regstucount[])
      .catch(err=>this.alertNotificationService.alertError(err))

    this.instructorService.getInstructor(this.id).toPromise()
    .then(res=>{
      this.ins = res as Instructor;
      this.allQualifications=this.ins.qualification as Qualification[]
    }).catch(err=>this.alertNotificationService.alertError(err))

    await this.registerCourseService.getstudentscountforteacher().toPromise()
    .then(res=>this.studentscount=res as Regstucount[])
    .catch(err=>this.alertNotificationService.alertError(err))
    
    await this.courseService.getreviewscountteacher().toPromise()
    .then(res=>this.reviewscount=res as Reviewcount[])
    .catch(err=>this.alertNotificationService.alertError(err))
     
    var r=this.reviewscount.filter((e)=>e._id==this.ins._id)[0]
    if(r){
      this.ins.rating=r.trating;
      this.numberofrating=+r.students
    }
    else{
      this.ins.rating=0;
      this.numberofrating=0
    }
    var s=this.studentscount.filter((e)=>e._id==this.ins._id)[0]
    if(s)
      this.ins.numberofstudents=s.count
    else
      this.ins.numberofstudents=0
                
    this.courseService.getCoursebyInstructor(this.ins._id).toPromise()
    .then(res=>{  
      this.courselist=res as Course[];
      this.courselist=this.courselist.filter((e)=>e.approved==true)
      this.ins.numberofonlinecourses=this.courselist.length;
    }).catch(err=>this.alertNotificationService.alertError(err))

    await this.courseService.getreviewscount().toPromise()
    .then(res=>this.reviewscountcourse=res as Reviewcount[])
    .catch(err=>this.alertNotificationService.alertError(err))
           
    await this.registerCourseService.getstudentscount().toPromise()
    .then(res=>this.studentscountcourse=res as Regstucount[])
    .catch(err=>this.alertNotificationService.alertError(err))
    for(var c of this.courselist){
      var r=this.reviewscountcourse.filter((e)=>e._id==c._id)[0]
      if(r){
        c.rating=r.rating;
        c.numberofrating=r.students
      }
      else{
        c.rating=0;
        c.numberofrating=0
      }
      var s=this.studentscountcourse.filter((e)=>e._id==c._id)[0]
      if(s)
        c.numberofstudents=s.count
      else
        c.numberofstudents=0
    }
  }

  getavgrating(id){
    if(this.avgrating){
      var a= this.avgrating.filter((e)=>e._id==id)[0];
      if(a){
        return a.count;
      }
    }
    return 0;
   }
}
