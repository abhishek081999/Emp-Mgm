import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Quiz } from 'src/app/model/quiz.model';
import { AlertNotificationsService } from 'src/app/services/alert-notifications.service';
import { QuizService } from 'src/app/services/quiz.service';

@Component({
  selector: 'app-question-set-list',
  templateUrl: './question-set-list.component.html',
  styleUrls: ['./question-set-list.component.scss']
})
export class QuestionSetListComponent implements OnInit {

  pagefilter=''
  searchq=''
  alllist:Quiz[]=[]
  alllistfinal:Quiz[]=[]

  constructor(
    private quizService:QuizService,
    private alertNotificationService: AlertNotificationsService,
    private router:Router) { }

  totalSize:number
  currentPage:number=1
  pageSize:number=10

  ngOnInit() {
    this.refresh()
  }
  isLoading:boolean
  refresh(){
    this.isLoading=true
    this.quizService.getallQuiz().toPromise()
    .then(res=>{
      this.alllist=res as Quiz[];
      this.alllist=this.alllist.reverse();
      this.isLoading=false
      this.totalSize=this.alllist.length;
      this.filter()
    }).catch(err=>this.alertNotificationService.alertError(err))
  }

  editQuestion(q){
    this.router.navigateByUrl('/admin/courses/edit-question-set/'+q._id)
  }

  duplicateQuestion(q){
    this.router.navigate(['/admin/courses/create-question-set'],{queryParams:{code:q._id}})
  }

  onApprove(q:Quiz){
    this.alertNotificationService.alertApprove()
    .then(result=>{
      if(result.isConfirmed){
        q.approved=true;
        this.quizService.updateQuiz(q._id,q).toPromise()
        .then(res=>{
          this.refresh()
          this.alertNotificationService.toastAlertSuccess('Question Set Approved Successfully')
        }).catch(err=>this.alertNotificationService.alertError(err))
      }
    })
  }

  onDelete(q){
    this.alertNotificationService.alertDelete()
    .then(result=>{
      if(result.isConfirmed){
        this.quizService.deleteQuiz(q._id).toPromise()
        .then(res=>{
          this.refresh()
          this.alertNotificationService.toastAlertSuccess('Question Set Deleted Successfully')
        }).catch(err=>this.alertNotificationService.alertError(err))
      }
    })
  }

  filter(){
    if(this.pagefilter && this.searchq){
      if(this.pagefilter=="approved"){
        this.alllistfinal = this.alllist.filter(e=>e.approved);
      }
      else if(this.pagefilter=="Pending"){
        this.alllistfinal = this.alllist.filter(e=>!e.approved);
      }
      this.searchq=this.searchq.toLowerCase()
      this.alllistfinal = this.alllistfinal.filter((e)=>e.quizname.toString().toLowerCase().indexOf(this.searchq)>-1 || e.quizid.toLowerCase().indexOf(this.searchq)>-1 || e.type.toLowerCase().indexOf(this.searchq)>-1 || e.numberofattempt.toString().toLowerCase().indexOf(this.searchq)>-1 || e.totalmarks.toString().toLowerCase().indexOf(this.searchq)>-1 || e.passingmarks.toString().toLowerCase().indexOf(this.searchq)>-1 || e.teachername.toString().toLowerCase().indexOf(this.searchq)>-1 || e.time.toString().toLowerCase().indexOf(this.searchq)>-1);
    }
    else if(this.pagefilter && !this.searchq){
      if(this.pagefilter=="approved"){
        this.alllistfinal = this.alllist.filter(e=>e.approved);
      }
      else if(this.pagefilter=="Pending"){
        this.alllistfinal = this.alllist.filter(e=>!e.approved);
      }
    }
    else if(!this.pagefilter && this.searchq){
      this.searchq=this.searchq.toLowerCase()
      this.alllistfinal = this.alllist.filter((e)=>e.quizname.toString().toLowerCase().indexOf(this.searchq)>-1 || e.quizid.toLowerCase().indexOf(this.searchq)>-1 || e.type.toLowerCase().indexOf(this.searchq)>-1 || e.numberofattempt.toString().toLowerCase().indexOf(this.searchq)>-1 || e.totalmarks.toString().toLowerCase().indexOf(this.searchq)>-1 || e.passingmarks.toString().toLowerCase().indexOf(this.searchq)>-1 || e.teachername.toString().toLowerCase().indexOf(this.searchq)>-1 || e.time.toString().toLowerCase().indexOf(this.searchq)>-1);
    }
    else{
      this.alllistfinal = [...this.alllist]
    }
    if(this.totalSize!=this.alllistfinal.length){
      this.currentPage=1
    }
    this.totalSize=this.alllistfinal.length
  }

  pagechange(){
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }

  gettext(t1,t2){
    return t1+t2
  }

  copied(){
    this.alertNotificationService.toastAlertSuccess('Url Copied')
  }
}
