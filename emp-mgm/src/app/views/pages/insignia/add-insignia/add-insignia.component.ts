import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Course } from 'src/app/model/course.model';
import { Ibundle, Insignia, InsigniaItem } from 'src/app/model/insignia.model';
import { Package } from 'src/app/model/package.model';
import { Subscription } from 'src/app/model/subscription.model';
import { AlertNotificationsService } from 'src/app/services/alert-notifications.service';
import { SubscriptionService } from 'src/app/services/subscription.service';
import { courseService } from 'src/app/services/course.service';
import { InsigniaService } from 'src/app/services/insignia.service';
import { Subscription as subs } from 'rxjs';
import { HttpEventType } from '@angular/common/http';
import { InstructorService } from 'src/app/services/instructor.service';
import { Instructor } from 'src/app/model/instructor.model';
import { Languages } from 'src/app/Enums/staticdata';
import { TitleCasePipe } from '@angular/common';


@Component({
  selector: 'app-add-insignia',
  templateUrl: './add-insignia.component.html',
  styleUrls: ['./add-insignia.component.scss'],
  providers: [TitleCasePipe]
})
export class AddInsigniaComponent implements OnInit, OnDestroy {
  today = new Date()

  insignia: Insignia = {
    _id: '',
    introvideo: '',
    name: '',
    code: '',
    price: 0,
    discountedprice: 0,
    duration: '',
    picture: null,
    description: '',
    category: [],
    approved: false,
    validity: 0,
    subscription: '',
    language: '',
    crosssale: [],
    benefits: [],
    audience: [],
    batchtime: '',
    brochure: '',
    upcoming: false,
    paymentmethodtwo: false,
    paymentmethodthree: false,
    paymentmtwo: {
      date: 0,
      totalamount: 0,
      firstamount: 0,
      secondamount: 0
    },
    paymentmthree: {
      firstdate: 0,
      seconddate: 0,
      totalamount: 0,
      firstamount: 0,
      secondamount: 0,
      thirdamount: 0
    },
    disable: false,
    sidepanel: {
      title: '',
      details: []
    },
    emiavailable: false,
    bundle: [],
    isCustomCreated: false,
    instructors: [],
    short_code: '',
    min_selling_price: 0,
    paymentmethodfour: false,
    paymentmfour: {
      firstdate: 0,
      seconddate: 0,
      thirddate: 0,
      totalamount: 0,
      firstamount: 0,
      secondamount: 0,
      thirdamount: 0,
      forthamount: 0
    },
  }
  isupload = false;
  isUpdate = false;
  progressvalue: number;
  fd = new FormData();
  dates = ''
  sidepaneldetails: string = '';
  allPackage: Package[];
  allCourse: Course[];
  insigniaItem: InsigniaItem[];
  insigniaList: Insignia[];
  insigniaaudience: String = '';
  insigniabenefits: String = '';
  //ibundle: Ibundle[] = []
  insbundle: Ibundle[] = []
  inbundle: Ibundle = {
    id: '',
    itemType: '',
    defaultAccess: false,
    FullpaymentAccess: false,
    itemPrice: 0,
    accessDate: 0
  }
  id;
  filesToUpload: Array<File> = [];
  languages = Languages
  allSubscription: Subscription[];
  postFile: subs;
  isapproved: Boolean = false;
  categories: string[];
  teachernames: Instructor[];
  mentor;
  code: string;
  isduplicate = false;
  numPattern = /([1-9][0-9]*)|0/;
  insigniaSeriesList = ["Insignia Series 1",
    "Insignia Series 2",
    "Insignia Series 3",
    "Insignia Series 4",
    "Insignia Series 5",
    "Insignia Series 6",
    "Insignia Series 7",
    "Insignia Series 8",
    "Insignia Series 9",
    "Insignia Series 10",
    "Insignia Personalized"]

  constructor(
    private alertNotificationService: AlertNotificationsService,
    private insigniaService: InsigniaService,
    private instructorService: InstructorService,
    private courseService: courseService,
    private route: ActivatedRoute,
    private router: Router,
    private subscriptionService: SubscriptionService,
    private titleCasePipe: TitleCasePipe
  ) { }

  batch = '';
  ngOnDestroy() {
    if (this.postFile)
      this.postFile.unsubscribe()
  }
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
  CourseItem: InsigniaItem[] = []
  ProductItem: InsigniaItem[] = []
  InvesmentorItem: InsigniaItem[] = []
  async refresh() {
    await this.insigniaService.getInsignia().toPromise()
      .then(res => {
        this.insigniaItem = res as InsigniaItem[];
        this.CourseItem = this.insigniaItem.filter(e => e.itemType == 'COURSE');
        this.ProductItem = this.insigniaItem.filter(e => e.itemType == 'PRODUCT');
        this.InvesmentorItem = this.insigniaItem.filter(e => e.itemType == 'INVESMENTOR');
      }).catch(err => this.alertNotificationService.alertError(err))

    if (this.id) {
      this.insigniaService.getInsigniabyId(this.id).toPromise()
        .then(res => {
          this.insignia = res as Insignia;

          this.insbundle = this.insignia.bundle as Ibundle[];
          this.isUpdate = true;

          this.isapproved = this.insignia.approved;

          if (this.insignia.sidepanel) {
            this.sidepaneldetails = this.insignia.sidepanel.details ? this.insignia.sidepanel.details.join(';') : ''
          }
          else {
            this.insignia.sidepanel = {
              title: '',
              details: []
            }
          }

          this.insigniaaudience = this.insignia.audience ? this.insignia.audience.toString() : ''
          this.insigniabenefits = this.insignia.benefits ? this.insignia.benefits.toString() : ''
          this.insignia.paymentmethodthree = this.insignia.paymentmethodthree ? true : false
          if (!this.insignia.paymentmethodthree) {
            this.insignia.paymentmthree = {
              firstamount: 0,
              secondamount: 0,
              thirdamount: 0,
              totalamount: 0,
              firstdate: 0,
              seconddate: 0
            }
          }
          this.insignia.paymentmethodtwo = this.insignia.paymentmethodtwo ? true : false
          if (!this.insignia.paymentmethodtwo) {
            this.insignia.paymentmtwo = {
              firstamount: 0,
              secondamount: 0,
              totalamount: 0,
              date: 0
            }
          }
        }).catch(err => this.alertNotificationService.alertError(err))
    }

    if (this.code) {
      this.isduplicate = true;
      this.insigniaService.getInsigniabyId(this.code).toPromise()
        .then(res => {
          //console.log(res);
          this.insignia = res as Insignia;
          this.insbundle = this.insignia.bundle as Ibundle[];
          this.insignia._id = '';
          this.insignia.approved = false;
          this.insignia.disable = false;
          this.insignia.code = '';
          if (this.batch != 'batch')
            this.insignia.code = '';

          //this.courseService.print();
          this.isapproved = this.insignia.approved;
          // console.log(!this.isUpdate);
          if (this.insignia.sidepanel) {
            this.sidepaneldetails = this.insignia.sidepanel.details ? this.insignia.sidepanel.details.join(';') : ''
          }
          else {
            this.insignia.sidepanel = {
              title: '',
              details: []
            }
          }
          this.insigniaaudience = this.insignia.audience ? this.insignia.audience.toString() : ''
          this.insigniabenefits = this.insignia.benefits ? this.insignia.benefits.toString() : ''
          this.insignia.paymentmethodthree = this.insignia.paymentmethodthree ? true : false
          if (!this.insignia.paymentmethodthree) {
            this.insignia.paymentmthree = {
              firstamount: 0,
              secondamount: 0,
              thirdamount: 0,
              totalamount: 0,
              firstdate: 0,
              seconddate: 0
            }
          }
          this.insignia.paymentmethodtwo = this.insignia.paymentmethodtwo ? true : false
          if (!this.insignia.paymentmethodtwo) {
            this.insignia.paymentmtwo = {
              firstamount: 0,
              secondamount: 0,
              totalamount: 0,
              date: 0
            }
          }
          this.insignia.paymentmethodfour = this.insignia.paymentmethodfour ? true : false
          if (!this.insignia.paymentmethodfour) {
            this.insignia.paymentmfour = {
              firstamount: 0,
              secondamount: 0,
              totalamount: 0,
              firstdate: 0,
              seconddate: 0,
              thirddate: 0,
              thirdamount: 0,
              forthamount: 0
            }
          }
        }).catch(err => this.alertNotificationService.alertError(err))
    }
    if (!this.id && !this.code) {
      this.addForm()
    }


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

    this.insigniaService.getInsigniaList().toPromise()
      .then(res => {
        this.insigniaList = res as Insignia[];
        this.insigniaList = this.insigniaList.filter((e) => e.approved)
      }).catch(err => this.alertNotificationService.alertError(err))

    this.instructorService.getAllInstructor().toPromise()
      .then(res => {
        this.teachernames = res as Instructor[];
        this.teachernames = this.teachernames.filter(e => e.approved && !e.rejected)
      }
      )
      .catch(err => this.alertNotificationService.alertError(err))
  }

  onChange(r) {
    this.insigniaItem = this.insigniaItem.filter(e => e.itemType == r);

  }

  clearform() {
    this.insignia.category = '';
    this.insignia.code = '';
    this.insignia.description = '';
    this.insignia.duration = '';
    this.insignia.name = '';
    this.insignia.picture = '';
    this.insignia.price = 0;
    this.insignia.discountedprice = 0;
    this.insignia.approved = false;
    this.insignia.validity = 0;
    this.insignia.subscription = '';
    this.insignia.introvideo = ''
    this.filesToUpload = [];
    this.fd = new FormData();
  }

  submitForm(e: Event) {

    this.insignia.bundle = this.insbundle;
    // this.insignia.bundle.forEach((e) => {

    // })

    this.insignia.name = this.titleCasePipe.transform(this.insignia.name);
    const files: Array<File> = this.filesToUpload;
    for (let i = 0; i < files.length; i++) {
      this.fd.append("file", files[i], this.dates + files[i]['name']);
    }

    if (this.insignia.brochure) {
      this.insignia.brochure = this.insignia.brochure.split('\\').pop();
    }
    this.insignia.picture = this.insignia.picture.split('\\').pop();
    this.insignia.sidepanel.details = this.sidepaneldetails.split(';')
    this.insignia.benefits = this.insigniabenefits.split(',')
    this.insignia.audience = this.insigniaaudience.split(',')


    this.isupload = true;
    this.postFile = this.courseService.postFile(this.fd).subscribe(
      res => {
        if (res.type === HttpEventType.UploadProgress) {
          this.progressvalue = Math.round(100 * res.loaded / res.total);
        }
        if (res.type === HttpEventType.Response) {
          if (this.isUpdate) {
            this.updateInsignia(e);
          }
          else {
            this.postInsignia(e);
          }
        }
      },
      err => this.alertNotificationService.alertError(err)
    );
    e.preventDefault();
  }

  postInsignia(e: Event) {
    this.insigniaService.postInsigniabundle(this.insignia).toPromise()
      .then(res => {
        this.alertNotificationService.toastAlertSuccess('Insignia Added Successfully')
        setTimeout(() => {
          this.router.navigateByUrl('/admin/insignia/insignia-list')

        }, 1000);
      }).catch(err => this.alertNotificationService.alertError(err));
    e.preventDefault();
  }
  updateInsignia(e: Event) {
    this.insigniaService.updateInsignia(this.insignia).toPromise()
      .then(res => {
        this.alertNotificationService.toastAlertSuccess('Insignia Updated Successfully')
        setTimeout(() => {
          this.router.navigateByUrl('/admin/insignia/insignia-list')
        }, 1000);
      }).catch(err => this.alertNotificationService.alertError(err))
    e.preventDefault();
  }
  handelFile(event, m: Insignia, a) {
    if (a == 'brochure')
      m.brochure = this.dates + event.target.files[0].name;
    else
      m.picture = this.dates + event.target.files[0].name;
    this.filesToUpload.push(<File>event.target.files[0]);
  }
  addForm() {
    var c = new Ibundle();
    c.FullpaymentAccess = false
    c.defaultAccess = false
    this.insbundle.push(c);
  }
  removeForm(index) {
    this.insbundle.splice(index, 1);
  }
  pm2() {

    if (this.insignia.paymentmethodtwo == false) {
      this.insignia.paymentmtwo.firstamount = 0
      this.insignia.paymentmtwo.secondamount = 0
      this.insignia.paymentmtwo.totalamount = 0
    }
  }
  pm2sa() {
    this.insignia.paymentmtwo.secondamount = Number(this.insignia.paymentmtwo.totalamount) - Number(this.insignia.paymentmtwo.firstamount);
  }
  pm3() {
    if (!this.insignia.paymentmethodthree == false) {
      this.insignia.paymentmthree.firstamount = 0
      this.insignia.paymentmthree.secondamount = 0
      this.insignia.paymentmthree.thirdamount = 0
      this.insignia.paymentmthree.totalamount = 0
    }
  }
  pm3sa() {
    this.insignia.paymentmthree.thirdamount = Number(this.insignia.paymentmthree.totalamount) - Number(this.insignia.paymentmthree.firstamount) - Number(this.insignia.paymentmthree.secondamount);
  }
  pm4() {
    if (!this.insignia.paymentmethodfour == false) {
      this.insignia.paymentmfour.firstamount = 0
      this.insignia.paymentmfour.secondamount = 0
      this.insignia.paymentmfour.thirdamount = 0
      this.insignia.paymentmfour.forthamount = 0
      this.insignia.paymentmfour.totalamount = 0
    }
  }
  pm4sa() {
    this.insignia.paymentmfour.forthamount = Number(this.insignia.paymentmfour.totalamount) - Number(this.insignia.paymentmfour.firstamount) - Number(this.insignia.paymentmfour.secondamount) - Number(this.insignia.paymentmfour.thirdamount);
  }

  SearchFn(term: string, item: InsigniaItem) {
    term = term.toLowerCase();
    return item.name.toLowerCase().indexOf(term) > -1 || item._id.toLowerCase().indexOf(term) > -1;
  }

}
