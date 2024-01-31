import { HttpEventType } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Course } from 'src/app/model/course.model';
import { Instructor } from 'src/app/model/instructor.model';
import { Lesson } from 'src/app/model/lesson.model';
import { Lessonsection } from 'src/app/model/lessonsection.model';
import { Package } from 'src/app/model/package.model';
import { Subscription } from 'src/app/model/subscription.model';
import { AlertNotificationsService } from 'src/app/services/alert-notifications.service';
import { courseService } from 'src/app/services/course.service';
import { InstructorService } from 'src/app/services/instructor.service';
import { PackageService } from 'src/app/services/package.service';
import { SubscriptionService } from 'src/app/services/subscription.service';
import { Subscription as subs } from 'rxjs';
import { Languages } from 'src/app/Enums/staticdata';
import { TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-add-recorded-course',
  templateUrl: './add-recorded-course.component.html',
  styleUrls: ['./add-recorded-course.component.scss'],
  providers: [TitleCasePipe]
})
export class AddRecordedCourseComponent implements OnInit, OnDestroy {

  lesson = new Lesson()
  CourseLessons: Array<Lesson> = [];
  showSucessMessage: boolean;
  serverErrorMessages: String;
  selectedFile: File = null;
  filesToUpload: Array<File> = [];
  fd = new FormData();
  today = new Date()
  newCourse: Course = {
    _id: '',
    introvideo: '',
    coursename: '',
    short_name: '',
    coursecode: '',
    courseprice: 0,
    discountedprice: 0,
    courseduration: '',
    teachername: '',
    coursepicture: null,
    coursedescription: '',
    coursecategory: [],
    lesson: [],
    submittedby: [],
    numberofstudents: 0,
    numberofrating: 0,
    approved: false,
    rating: 0,
    coursetype: '',
    coursevalidity: 0,
    coursestartdate: this.today,
    coursepackage: '',
    max_student: 0,
    coursesubscription: '',
    courselanguage: '',
    crosssale: [],
    upsale: [],
    benefits: [],
    audience: [],
    numberoflesson: 0,
    batchtime: '',
    brochure: '',
    upcoming: false,
    paymentmethodthree: false,
    paymentmethodtwo: false,
    paymentmthree: {
      firstdate: this.today,
      seconddate: this.today,
      totalamount: 0,
      firstamount: 0,
      secondamount: 0,
      thirdamount: 0,
    },
    paymentmtwo: {
      date: this.today,
      totalamount: 0,
      firstamount: 0,
      secondamount: 0
    },
    disable: false,
    sidepanel: {
      title: '',
      details: []
    },
    emiavailable: false,
    market_research_category: [],
    course_level: '',
    short_code: '',
    min_selling_price: 0
  }
  progressvalue: number;
  id;
  isUpdate = false;
  isupload = false;
  isapproved: Boolean = false;
  dates = ''
  languages = Languages
  short_codes = ['INTD', 'DRVT', 'FORX', 'FUND', 'CDCR', 'BCMB', 'MUFD', 'NIFT', 'OTHERS'];
  allSubscription: Subscription[];
  allPackage: Package[];
  allCourse: Course[];
  code: string;
  isduplicate = false;
  allIns: Instructor[];
  sidepaneldetails: string = '';
  categories: string[];
  teacher: string = '';
  constructor(
    private alertNotificationService: AlertNotificationsService,
    private route: ActivatedRoute,
    private courseService: courseService,
    private router: Router,
    private subscriptionService: SubscriptionService,
    private instructorService: InstructorService,
    private packageService: PackageService,
    private titleCasePipe: TitleCasePipe
  ) { }

  ngOnDestroy() {
    if (this.postFile)
      this.postFile.unsubscribe()
  }

  batch = ''

  postFile: subs;

  courseaudience: String = '';
  coursebenefits: String = '';
  market_research_category = []
  ngOnInit() {

    this.clearform();
    this.route.paramMap.subscribe(params => {
      this.id = params.get('id');
    });
    this.route.queryParamMap.subscribe(query => {
      this.code = query.get('code');
      this.batch = query.get('new');
    })

    this.dates = Date.now().toString();

    this.refresh()

  }

  async refresh() {

    if (this.code) {
      this.isduplicate = true;
      this.courseService.getCoursebyId(this.code).toPromise()
        .then(res => {
          //console.log(res);
          this.newCourse = res as Course;
          this.newCourse._id = '';
          this.newCourse.approved = false;
          this.newCourse.disable = false;
          this.newCourse.coursecode = this.newCourse.coursecode.slice(0, this.newCourse.coursecode.length - 1)
          if (this.batch != 'batch')
            this.newCourse.coursecode = '';

          //this.courseService.print();
          this.CourseLessons = this.newCourse.lesson as Lesson[];
          this.isapproved = this.newCourse.approved;
          // console.log(!this.isUpdate);
          this.teacher = this.newCourse.submittedby[0];
          if (this.newCourse.sidepanel) {
            this.sidepaneldetails = this.newCourse.sidepanel.details ? this.newCourse.sidepanel.details.join(';') : ''
          }
          else {
            this.newCourse.sidepanel = {
              title: '',
              details: []
            }
          }
          this.courseaudience = this.newCourse.audience ? this.newCourse.audience.toString() : ''
          this.coursebenefits = this.newCourse.benefits ? this.newCourse.benefits.toString() : ''
          this.newCourse.paymentmethodthree = this.newCourse.paymentmethodthree ? true : false
          if (!this.newCourse.paymentmethodthree) {
            this.newCourse.paymentmthree = {
              firstamount: 0,
              secondamount: 0,
              thirdamount: 0,
              totalamount: 0,
              firstdate: this.today,
              seconddate: this.today
            }
          }
          this.newCourse.paymentmethodtwo = this.newCourse.paymentmethodtwo ? true : false
          if (!this.newCourse.paymentmethodtwo) {
            this.newCourse.paymentmtwo = {
              firstamount: 0,
              secondamount: 0,
              totalamount: 0,
              date: this.today
            }
          }
        }).catch(err => this.alertNotificationService.alertError(err))
    }

    if (!this.id && !this.code) {
      this.addForm()
    }
    else {
      this.courseService.getCoursebyId(this.id).toPromise()
        .then(res => {
          //console.log(res);
          this.newCourse = res as Course;
          //this.courseService.print();
          this.CourseLessons = this.newCourse.lesson as Lesson[];
          this.isUpdate = true;
          this.isapproved = this.newCourse.approved;
          this.teacher = this.newCourse.submittedby[0];
          // console.log(!this.isUpdate);
          if (this.newCourse.sidepanel) {
            this.sidepaneldetails = this.newCourse.sidepanel.details ? this.newCourse.sidepanel.details.join(';') : ''
          }
          else {
            this.newCourse.sidepanel = {
              title: '',
              details: []
            }
          }
          this.courseaudience = this.newCourse.audience ? this.newCourse.audience.toString() : ''
          this.coursebenefits = this.newCourse.benefits ? this.newCourse.benefits.toString() : ''
          this.newCourse.paymentmethodthree = this.newCourse.paymentmethodthree ? true : false
          if (!this.newCourse.paymentmethodthree) {
            this.newCourse.paymentmthree = {
              firstamount: 0,
              secondamount: 0,
              thirdamount: 0,
              totalamount: 0,
              firstdate: this.today,
              seconddate: this.today
            }
          }
          this.newCourse.paymentmethodtwo = this.newCourse.paymentmethodtwo ? true : false
          if (!this.newCourse.paymentmethodtwo) {
            this.newCourse.paymentmtwo = {
              firstamount: 0,
              secondamount: 0,
              totalamount: 0,
              date: this.today
            }
          }
        }).catch(err => this.alertNotificationService.alertError(err))
    }

    this.instructorService.getAllInstructor().toPromise()
      .then(res => {
        this.allIns = res as Instructor[]
        this.allIns = this.allIns.filter(e => e.approved)
      }).catch(err => this.alertNotificationService.alertError(err))

    this.packageService.getallPackage().toPromise()
      .then(res => {
        this.allPackage = res as Package[];
        this.allPackage = this.allPackage.filter((e) => e.approve)
      }).catch(err => this.alertNotificationService.alertError(err))

    this.subscriptionService.getallPackage().toPromise()
      .then(res => {
        this.allSubscription = res as Subscription[];
        this.allSubscription = this.allSubscription.filter((e) => e.approve)
      }).catch(err => this.alertNotificationService.alertError(err))

    this.courseService.getcategorynames().toPromise()
      .then(res => {
        this.categories = res as string[];
        this.categories.sort();
      }).catch(err => this.alertNotificationService.alertError(err))

    this.courseService.getAllCourse().toPromise()
      .then(res => {
        this.allCourse = res as Course[];
        this.allCourse = this.allCourse.filter((e) => e.approved)
      }).catch(err => this.alertNotificationService.alertError(err))

    this.packageService.getSendResearchCatergory().toPromise()
      .then(res => {
        this.market_research_category = res;
      }).catch(err => this.alertNotificationService.alertError(err))
  }
  pm3() {
    if (!this.newCourse.paymentmethodthree == false) {
      this.newCourse.paymentmthree.firstamount = 0
      this.newCourse.paymentmthree.secondamount = 0
      this.newCourse.paymentmthree.thirdamount = 0
      this.newCourse.paymentmthree.totalamount = 0
    }
  }

  pm2() {

    if (this.newCourse.paymentmethodtwo == false) {
      this.newCourse.paymentmtwo.firstamount = 0
      this.newCourse.paymentmtwo.secondamount = 0
      this.newCourse.paymentmtwo.totalamount = 0
    }
  }

  addForm() {
    this.lesson = new Lesson;
    var section = new Lessonsection;
    this.lesson.section = [section];
    this.CourseLessons.push(this.lesson);
    //console.log(this.CourseLessons)
  }
  addLesson(l: Lessonsection[]) {
    var section = new Lessonsection;
    l.push(section);
  }

  removeForm(l: Lessonsection[], index) {
    l.splice(index, 1);
  }
  removeLesson(index) {
    this.CourseLessons.splice(index, 1);
  }

  handelFile(event, m: Course, a) {
    if (a == 'brochure')
      m.brochure = this.dates + event.target.files[0].name;
    else
      m.coursepicture = this.dates + event.target.files[0].name;
    this.filesToUpload.push(<File>event.target.files[0]);
  }

  handelFileInput(event, m: Lessonsection) {
    m.file = this.dates + event.target.files[0].name;
    this.filesToUpload.push(<File>event.target.files[0]);
  }

  submitForm(e: Event) {
    this.newCourse.coursename = this.titleCasePipe.transform(this.newCourse.coursename);
    var s = this.today.toJSON()
    for (let cl of this.CourseLessons) {
      for (let cs of cl.section) {
        if (cs.type == "Document" && cs.file)
          cs.file = cs.file.split('\\').pop();
      }
    }
    this.newCourse.lesson = this.CourseLessons;

    const files: Array<File> = this.filesToUpload;

    for (let i = 0; i < files.length; i++) {
      this.fd.append("file", files[i], this.dates + files[i]['name']);
    }

    if (this.newCourse.brochure) {
      this.newCourse.brochure = this.newCourse.brochure.split('\\').pop();
    }
    this.newCourse.coursepicture = this.newCourse.coursepicture.split('\\').pop();
    this.newCourse.sidepanel.details = this.sidepaneldetails.split(';')

    this.newCourse.benefits = this.coursebenefits.split(',')
    this.newCourse.audience = this.courseaudience.split(',')

    this.isupload = true;
    this.postFile = this.courseService.postFile(this.fd).subscribe(
      res => {

        if (res.type === HttpEventType.UploadProgress) {
          this.progressvalue = Math.round(100 * res.loaded / res.total);
        }
        if (res.type === HttpEventType.Response) {
          if (this.isUpdate) {
            this.updateCourse(e);
          }

          else {

            this.postCourse(e);
          }
        }

      },
      err => this.alertNotificationService.alertError(err)
    );
    e.preventDefault();
  }



  clearform() {
    this.newCourse.coursecategory = [];
    this.newCourse.coursecode = '';
    this.newCourse.coursedescription = '';
    this.newCourse.courseduration = '';
    this.newCourse.coursename = '';
    this.newCourse.coursepicture = '';
    this.newCourse.courseprice = 0;
    this.newCourse.discountedprice = 0;
    this.newCourse.lesson = [];
    this.newCourse.teachername = '';
    this.newCourse.approved = false;
    this.newCourse.coursetype = '',
      this.newCourse.coursevalidity = 0;
    this.newCourse.coursestartdate = this.today;
    this.newCourse.numberofstudents = 0;
    this.newCourse.rating = 0;
    this.newCourse.submittedby = [];
    this.newCourse.coursepackage = '';
    this.newCourse.coursesubscription = '';
    this.newCourse.introvideo = ''
    this.filesToUpload = [];
    this.CourseLessons = [];

    this.fd = new FormData();
  }

  updateCourse(e: Event) {
    this.newCourse.submittedby = [this.teacher];
    this.newCourse.teachername = this.allIns.filter((e) => this.newCourse.submittedby.includes(e._id))[0].fullName
    this.courseService.updateCourse(this.newCourse, this.id).toPromise()
      .then(res => {
        setTimeout(() => {
          this.router.navigateByUrl('/admin/courses/course-list')
        }, 1000);
      }).catch(err => this.alertNotificationService.alertError(err))
    e.preventDefault();
  }

  postCourse(e: Event) {
    this.newCourse.submittedby = [this.teacher];
    this.newCourse.teachername = this.allIns.filter((e) => this.newCourse.submittedby.includes(e._id))[0].fullName
    this.courseService.postCourse(this.newCourse).toPromise()
      .then(res => {
        this.alertNotificationService.toastAlertSuccess('New Course Added Successfully')
        setTimeout(() => {
          this.router.navigateByUrl('/admin/courses/course-list')
        }, 1000);
      }).catch(err => this.alertNotificationService.alertError(err))
    e.preventDefault();
  }

  pm2sa() {
    this.newCourse.paymentmtwo.secondamount = Number(this.newCourse.paymentmtwo.totalamount) - Number(this.newCourse.paymentmtwo.firstamount);
  }
  pm3sa() {
    this.newCourse.paymentmthree.thirdamount = Number(this.newCourse.paymentmthree.totalamount) - Number(this.newCourse.paymentmthree.firstamount) - Number(this.newCourse.paymentmthree.secondamount);
  }
  
  StaffSearchFn(term: string, item: Instructor) {
    term = term.toLowerCase();
    return item.fullName.toLowerCase().indexOf(term) > -1 || item.invid.toLowerCase().indexOf(term) > -1;
  }
}
