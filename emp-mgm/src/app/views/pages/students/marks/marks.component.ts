import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Course } from 'src/app/model/course.model';
import { Marks, Marksdata } from 'src/app/model/marks.model';
import { Quiz } from 'src/app/model/quiz.model';
import { User } from 'src/app/model/user.model';
import { AlertNotificationsService } from 'src/app/services/alert-notifications.service';
import { courseService } from 'src/app/services/course.service';
import { ExportService } from 'src/app/services/export.service';
import { MarksService } from 'src/app/services/marks.service';
import { QuizService } from 'src/app/services/quiz.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-marks',
  templateUrl: './marks.component.html',
  styleUrls: ['./marks.component.scss']
})
export class MarksComponent implements OnInit {
  allCourse: Course[];
  quiz=[]
  courseid=[]
  coursecode=[]
  filter1="";
  filter2="";
  students: User[]=[]
  studentsid=[]
  allmarks : Marks[]=[]
  //quizcodes:data[]=[];
  filterQuery="";
  rowsOnPage = 25;
  sortBy = "date";
  sortOrder = "desc";
  today = Date();
  dataLength;
  displayedColumns: string[];
  dataSource: MatTableDataSource<Marksdata>;
  allmarksdata:Marksdata[]=[]
  allquiz:Quiz[]=[]
  paginator: any;
  sort: any;
  pagefilter
  constructor(
    private courseService: courseService,
    private userService: UserService,
    private marksService: MarksService,
    private quizService: QuizService,
    private alertNotificationService: AlertNotificationsService,
    private exportService: ExportService
    ) { }
  
  ngOnInit() {
    this.displayedColumns = ['quizcode','invid','name', 'email', 'phone', 'coursecode','quiztype','totalmarks', 'passingmarks','marks', 'date','remarks'];

   this.refresh()
  }
  isLoading=false
  isfound=true
  async refresh(){
    this.isLoading=true
    await this.marksService.getAllMarks().toPromise()
    .then(res=>this.allmarks = res)
    .catch(err=>this.alertNotificationService.alertError(err));

    await this.userService.getStudents().toPromise()
    .then(res=>this.students = res)
    .catch(err=>this.alertNotificationService.alertError(err));

    await this.courseService.getAllCourse().toPromise()
    .then(res=>this.allCourse = res)
    .catch(err=>this.alertNotificationService.alertError(err));

    await this.quizService.getallQuiz().toPromise()
    .then(res=>this.allquiz = res)
    .catch(err=>this.alertNotificationService.alertError(err));

    for(var c of this.allCourse){
      this.coursecode.push(c.coursecode);
      this.courseid.push(c._id);

    }
    if(this.allmarks){
      this.allmarks.forEach((e)=>{
        var marksdata = new Marksdata();
        if(e.courseid){
          marksdata.coursecode=this.coursecode[this.courseid.indexOf(e.courseid)];
          marksdata.courseid=e.courseid;
        }
        if(e.studentid){
          var s = this.students.filter((f)=>e.studentid==f._id)[0]
          marksdata.studentid=e.studentid;
          if(s){
            marksdata.email=s.email;
            marksdata.phone=s.telephone;
            marksdata.name=s.fullName;
            marksdata.invid=s.invid;
          }
        }
        marksdata.date=new Date(e.date)
        marksdata.marks=e.marks;
        marksdata.passingmarks=e.passingmarks;
        marksdata.totalmarks=e.totalmarks;
        var q = this.allquiz.filter((f)=>f._id==e.quizid)[0]
        marksdata.quizcode=q?q.quizid:''
        marksdata.quizid=e.quizid
        marksdata.quiztype=e.quiztype;
        marksdata.remarks=e.remarks;
        this.allmarksdata.push(marksdata);
      })
    }
    //console.log(this.allmarksdata)
    this.isLoading=false
    this.isfound=this.allmarksdata.length>0
  }


  export(){
    this.exportService.exportonesheet('Student Marks',this.allmarksdata.reverse())
  }

  applyFilter(event: Event) {
    try {
      const filterValue = (event.target as HTMLInputElement).value;
      this.dataSource.filter = filterValue.trim().toLowerCase();

      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
    } catch (error) {
      this.alertNotificationService.alertInfo('Select Question ID')
    }
    
  }

  onchange(){
    var a = this.allmarksdata.filter(e=>e.quizid==this.pagefilter)
    this.dataSource=new MatTableDataSource(a.reverse());
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataLength=a.length;
  }

}
