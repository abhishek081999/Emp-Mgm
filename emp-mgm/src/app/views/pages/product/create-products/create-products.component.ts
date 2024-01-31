import { TitleCasePipe } from '@angular/common';
import { HttpEventType } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Languages } from 'src/app/Enums/staticdata';
import { Instructor } from 'src/app/model/instructor.model';
import { Products, ProductsDisplay } from 'src/app/model/product.model';
import { AlertNotificationsService } from 'src/app/services/alert-notifications.service';
import { courseService } from 'src/app/services/course.service';
import { InstructorService } from 'src/app/services/instructor.service';
import { PackageService } from 'src/app/services/package.service';

@Component({
  selector: 'app-create-products',
  templateUrl: './create-products.component.html',
  styleUrls: ['./create-products.component.scss'],
  providers: [TitleCasePipe]
})
export class CreateProductsComponent implements OnInit, OnDestroy {

  progressvalue: number;
  serverErrorMessages: any;
  isedit = false;
  isavailable = false;
  postfile: Subscription

  constructor(
    private courseService: courseService,
    private packageService: PackageService,
    private alertNotificationService: AlertNotificationsService,
    private instructorService: InstructorService,
    private router: Router,
    private route: ActivatedRoute,
    private titleCasePipe: TitleCasePipe) { }

  ngOnDestroy(): void {
    if (this.postfile) {
      this.postfile.unsubscribe();
    }
  }


  product: Products = {
    _id: '',
    name: '',
    audience: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    benefits: [],
    createdBy: '',
    updatedBy: '',
    cross_sale: [],
    up_sale: [],
    description: '',
    disable: false,
    discounted_price: 0,
    duration: '',
    intro: '',
    language: '',
    no_of_sessions: null,
    no_of_stocks: null,
    type: '',
    sidepanel: {
      title: '',
      details: []
    },
    url: '',
    image: '',
    validity: 0,
    price: 0,
    productid: '',
    approve: false,
    device_type: '',
    min_selling_price: null,
    market_research_category: []
  }

  languages = Languages

  today = Date();

  allProduct: Array<ProductsDisplay> = [];
  selectedFile: File = null;
  filesToUpload: File;
  fd = new FormData();

  dates = ''
  id = null
  code = null;
  batch = null;
  market_research_category = [];
  wealth_insights_category = [];
  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.id = params.get('id');
    });
    this.route.queryParamMap.subscribe(query => {
      this.code = query.get('code');
      this.batch = query.get('new');
    })
    this.dates = new Date().getTime().toString();
    this.refresh();
    this.packageService.getSendResearchCatergory().toPromise()
      .then(res => {
        this.market_research_category = res;
      }).catch(err => this.alertNotificationService.alertError(err))
      
    this.packageService.getSendWealthInsightsCatergory().toPromise()
      .then(res => {
        this.wealth_insights_category = res;
      }).catch(err => this.alertNotificationService.alertError(err))
  }

  allMentors: Instructor[]
  imagechange = false
  productaudience: String = '';
  productbenefits: String = '';
  sidepaneldetails: String = '';
  isupload = false;

  async refresh() {
    if (this.id || this.code) {
      var id = this.id ? this.id : this.code
      await this.packageService.getPackagebyId(id).toPromise()
        .then(res => {
          this.product = res;
          if (this.product.sidepanel) {
            this.sidepaneldetails = this.product.sidepanel.details ? this.product.sidepanel.details.join(';') : ''
          }
          else {
            this.product.sidepanel = {
              title: '',
              details: []
            }
          }
          this.productaudience = this.product.audience ? this.product.audience.toString() : ''
          this.productbenefits = this.product.benefits ? this.product.benefits.toString() : ''
        }).catch(err => this.alertNotificationService.alertError(err))
    }
    if (this.id && !this.code) {
      this.isedit = true;
    }
    if (!this.id && this.code && this.batch == 'batch') {
      this.product.productid = this.product.productid.split('-')[0] + '-B'
    } else if (!this.id && this.code && this.batch != 'batch') {
      this.product.productid = null
    }
    this.instructorService.getAllInstructor().toPromise()
      .then(res => this.allMentors = res as Instructor[])
      .catch(err => this.alertNotificationService.alertError(err))

    this.packageService.getallProduct().toPromise()
      .then(res => {
        this.allProduct = res;
      }).catch(err => this.alertNotificationService.alertError(err))

  }

  submitForm(f: NgForm) {

    if (this.product.type == 'Live Market Practice' || this.product.type == 'One to One Mentorship' || this.product.type == 'Live Technical Support Chat') {
      this.product.no_of_stocks = 0;
      this.product.no_of_sessions = Number(this.product.no_of_sessions)
    }
    if (this.product.type == 'Portfolio Checkup') {
      this.product.no_of_sessions = 0;
      this.product.no_of_stocks = Number(this.product.no_of_stocks)
    }
    if (this.product.type == 'Normal') {
      this.product.no_of_sessions = 0;
      this.product.no_of_stocks = 0;
    }
    this.product.sidepanel.details = this.sidepaneldetails.split(';')
    this.product.benefits = this.productbenefits.split(',')
    this.product.audience = this.productaudience.split(',')
    this.product.name = this.titleCasePipe.transform(this.product.name);
    if (this.imagechange) {
      this.product.image = this.product.image.split('\\').pop();
      const files: File = this.filesToUpload;
      this.fd.append("file", files, this.dates + files['name']);
      this.isupload = true;
      this.postfile = this.courseService.postFile(this.fd).subscribe(
        res => {
          if (res.type === HttpEventType.UploadProgress) {
            this.progressvalue = Math.round(100 * res.loaded / res.total);
          }
          if (res.type === HttpEventType.Response) {

          }
        },
        err => {
          this.alertNotificationService.alertError(err)
        }
      );
    }
    if (this.isedit) {
      this.updatePackage(f);
    }
    else {
      this.postPackage(f);
    }
  }

  postPackage(f: NgForm) {
    this.packageService.postPackage(this.product).toPromise()
      .then(res => {
        this.router.navigateByUrl('/admin/products/products')
        this.alertNotificationService.toastAlertSuccess('Product Added Successfully')
      }).catch(err => this.alertNotificationService.alertError(err))
  }

  updatePackage(f: NgForm) {
    this.alertNotificationService.alertChanges()
      .then(result => {
        if (result.isConfirmed) {
          this.packageService.updatePackagebyId(this.product, this.product._id).toPromise()
            .then(res => {
              this.isedit = false;
              this.alertNotificationService.toastAlertSuccess('Product Updated Successfully')
              this.router.navigateByUrl('/admin/products/products')
            }).catch(err => this.alertNotificationService.alertError(err))
        }
      })
  }



  handelFileInput1(event) {
    this.imagechange = true
    this.product.image = this.dates + event.target.files[0].name;
    this.filesToUpload = <File>event.target.files[0];
    let element: HTMLElement = document.querySelector("#img + .input-group .file-upload-info") as HTMLElement;
    element.setAttribute('value', event.target.files[0].name)
  }

  openFileBrowser(event: any) {
    event.preventDefault();
    let element: HTMLElement = document.querySelector("#img") as HTMLElement;
    element.click()
  }
}
