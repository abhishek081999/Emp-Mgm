import { HttpEventType } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Instructor } from 'src/app/model/instructor.model';
import { Mcq, Mcqoptions } from 'src/app/model/mcq.model';
import { Quiz } from 'src/app/model/quiz.model';
import { AlertNotificationsService } from 'src/app/services/alert-notifications.service';
import { courseService } from 'src/app/services/course.service';
import { InstructorService } from 'src/app/services/instructor.service';
import { QuizService } from 'src/app/services/quiz.service';

@Component({
  selector: 'app-add-question-set',
  templateUrl: './add-question-set.component.html',
  styleUrls: ['./add-question-set.component.scss']
})
export class AddQuestionSetComponent implements OnInit, OnDestroy {

  newquiz: Quiz = {
    quizid: '',
    quizname: '',
    time: null,
    teacherid: '',
    teachername: null,
    totalmarks: 0,
    type: '',
    passingmarks: null,
    approved: false,
    mcqs: [],
    numberofattempt: null
  }

  showSucessMessage = false;
  serverErrorMessages = '';
  progressvalue = 0

  questions: Mcq[] = []
  filesToUpload: Array<File> = [];
  dates = ''
  isupload = false;
  imgavailable = false
  fd = new FormData()
  isUpdate = false
  isduplicate = false
  id = ''
  code = ''
  allIns: Instructor[] = [];
  constructor(
    private courseService: courseService,
    private alertNotificationService: AlertNotificationsService,
    private quizService: QuizService,
    private instructorService: InstructorService,
    private route: ActivatedRoute,
    private router: Router) { }
  ngOnDestroy(): void {
    if (this.pmap) {
      this.pmap.unsubscribe()
    }
    if (this.qmap) {
      this.qmap.unsubscribe()
    }
    if (this.postfile) {
      this.postfile.unsubscribe()
    }
  }

  pmap: Subscription
  qmap: Subscription
  postfile: Subscription

  ngOnInit(): void {
    this.pmap = this.route.paramMap.subscribe(params => {
      this.id = params.get('id');
      if (this.id) {
        this.getdetails(this.id)
        this.isUpdate = true
      }

    });
    this.qmap = this.route.queryParamMap.subscribe(query => {
      this.code = query.get('code');
      if (this.code) {
        this.getdetails(this.code)
        this.isduplicate = true
      }

    })
    this.addForm()
    this.dates = Date.now().toString();

    this.instructorService.getAllInstructor().toPromise()
      .then(res =>{
        this.allIns = res as Instructor[]
        this.allIns = this.allIns.filter(e => e.approved)
      }).catch(err => this.alertNotificationService.alertError(err))
  }

  getdetails(id: string) {
    this.quizService.getQuizById(id).toPromise()
      .then(res => {
        this.newquiz = res as Quiz;
        if (this.isduplicate) {
          this.newquiz._id = '';
          this.newquiz.approved = false;
          this.newquiz.quizid = '';
        }
        this.questions = this.newquiz.mcqs as Mcq[]
      }).catch(err => this.alertNotificationService.alertError(err))
  }

  submitForm(f: NgForm) {
    if (this.imgavailable) {
      const files: Array<File> = this.filesToUpload;
      for (let i = 0; i < files.length; i++) {
        this.fd.append("file", files[i], this.dates + files[i]['name']);
      }
      this.isupload = true;
      this.courseService.postFile(this.fd).subscribe(
        res => {
          if (res.type === HttpEventType.UploadProgress) {
            this.progressvalue = Math.round(100 * res.loaded / res.total);
          }
          if (res.type === HttpEventType.Response) {
            this.filesToUpload = []
            this.imgavailable = false
            this.isupload = false
          }
        },
        err => this.alertNotificationService.alertError(err)
      );
    }
    if (this.isUpdate) {
      this.updateQuiz(f);
    }
    else {
      this.postQuiz(f);
    }
  }

  postQuiz(f: NgForm) {
    this.newquiz.teachername = this.allIns.filter((e) => e._id == this.newquiz.teacherid)[0].fullName
    this.newquiz.mcqs = this.questions;
    this.newquiz.totalmarks = this.questions.length;
    this.quizService.postQuiz(this.newquiz).toPromise()
      .then(res => {
        this.questions = [];
        this.addForm();
        f.resetForm()
        this.router.navigateByUrl('/admin/courses/question-sets');
        this.alertNotificationService.toastAlertSuccess('Question Set Created Successfully')
      }).catch(err => this.alertNotificationService.alertError(err))
  }

  updateQuiz(f: NgForm) {
    this.newquiz.teachername = this.allIns.filter((e) => e._id == this.newquiz.teacherid)[0].fullName
    this.newquiz.mcqs = this.questions;
    this.newquiz.totalmarks = this.questions.length;
    this.quizService.updateQuiz(this.newquiz._id, this.newquiz).toPromise()
      .then(res => {
        this.questions = [];
        this.addForm();
        f.resetForm()
        this.router.navigateByUrl('/admin/courses/question-sets');
        this.alertNotificationService.toastAlertSuccess('Question Set Updated Successfully')
      }).catch(err => this.alertNotificationService.alertError(err))
  }

  handelFileInput(event, q: Mcq) {
    q.quesimg = this.dates + event.target.files[0].name;
    q.quesimg = q.quesimg.split('\\').pop();
    console.log(this.questions)
    this.filesToUpload.push(<File>event.target.files[0]);
    this.imgavailable = true
  }
  handelFileInput1(event, o: Mcqoptions) {
    o.optionimg = this.dates + event.target.files[0].name;
    o.optionimg = o.optionimg.split('\\').pop();
    console.log(this.questions)
    this.filesToUpload.push(<File>event.target.files[0]);
    this.imgavailable = true
  }

  addForm() {
    var mcq = new Mcq()
    var ops = new Mcqoptions();
    mcq.ans = ''
    mcq.explanation = ''
    mcq.question = ''
    mcq.anstype = ''
    mcq.options = [ops]
    this.questions.push(mcq)
    //console.log(this.questions)
    this.newquiz.totalmarks += 1
  }

  addOps(q: Mcq, ops) {
    var options = new Mcqoptions();
    if (q.anstype == 'multiple') {
      var o = q.ans as boolean[]
      o.push(false)
      q.ans = o
    }
    ops.push(options)

  }

  removeForm(i: number) {
    this.questions.splice(i, 1)
    this.newquiz.totalmarks -= 1
  }

  removeOps(q: Mcq, ops, i: number) {
    var o = q.ans as boolean[]
    if (o.length > 0)
      o.splice(i, 1)
    ops.splice(i, 1)
  }

  typechange(q: Mcq) {
    if (q.anstype == 'multiple') {
      var o = []
      var a = q.options as Mcqoptions[]
      a.forEach(e => o.push(false))
      q.ans = o
    }
    else {
      q.ans = ''
    }
  }

}
