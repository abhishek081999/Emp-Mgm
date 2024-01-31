import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Languages, Short_code, duration } from 'src/app/Enums/staticdata';
import { Ibundle, Invesmentor, InvesmentorItem } from 'src/app/model/invesmentor.model';
import { Package } from 'src/app/model/package.model';
import { AlertNotificationsService } from 'src/app/services/alert-notifications.service';
import { InvesmentorService } from 'src/app/services/invesmentor.service';
import { InvesmentorListComponent } from '../invesmentor-list/invesmentor-list.component';


@Component({
  selector: 'app-add-invesmentor',
  templateUrl: './add-invesmentor.component.html',
  styleUrls: ['./add-invesmentor.component.scss']
})
export class AddInvesmentorComponent implements OnInit {

  filesToUpload: File;
  invesmentor: Invesmentor = {
    _id: '',
    name: '',
    code: '',
    price: 0,
    discountedprice: 0,
    duration: '',
    description: '',
    approved: false,
    validity: 0,
    language: '',
    disable: false,
    bundle: [],
    upgrades: [],
    addOns: [],
    short_code: '',
    min_selling_price: 0,
  }

  isUpdate = false;
  progressvalue: number;
  fd = new FormData();
  dates = ''
  allPackage: Package[];
  invesmentorItem: InvesmentorItem[];
  invesmentorList: Invesmentor[];
  ibundle: Ibundle[] = []
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
  languages = Languages;
  short_codes = Short_code;
  durations = duration;
  isapproved: Boolean = false;
  code: string;
  isduplicate = false;
  numPattern = /([1-9][0-9]*)|0/;
  duration: any = [];
  staticdata: any;
  filterproduct: InvesmentorItem[] = []
  filterinvesmentor: Invesmentor[] = []
  language: string = '';
  filterterm: any;
  selectedvalidity: any;
  validity: any;



  constructor(
    private alertNotificationService: AlertNotificationsService,
    private invesmentorService: InvesmentorService,
    private route: ActivatedRoute,
    private router: Router,

  ) { }

  ngOnInit() {
    this.clearform();
    this.route.paramMap.subscribe(params => {
      this.id = params.get('id');

    });
    this.route.queryParamMap.subscribe(query => {
      this.code = query.get('code');
    })
    this.dates = Date.now().toString();
    this.refresh()


  }

  // ==> Filter Addons and upgrades <== //

  onduration() {
    if (this.invesmentor.duration) {
      this.invesmentor.validity = this.durations.find((e) => e.Duration === this.invesmentor.duration)?.days
    }
  }

  onlanguage() {
    if (this.invesmentor.language) {
      this.filterproduct = this.ProductItem.filter((p) => p.language === this.invesmentor.language)
      this.filterinvesmentor = this.invesmentorList.filter((l) => l.language === this.invesmentor.language)
    }
  }

  // ==> Image upload <== //

  isImageUploaded = false
  handelFileInput(event) {
    this.filesToUpload = <File>event.target.files[0];
    let element: HTMLElement = document.querySelector("#img + .input-group .file-upload-info") as HTMLElement;
    element.setAttribute('value', event.target.files[0].name);
    this.isImageUploaded = true;
  }

  openFileBrowser(event: any) {
    event.preventDefault();
    let element: HTMLElement = document.querySelector("#img") as HTMLElement;
    element.click()
  }


  //  ==> Productitem get <== //

  ProductItem: InvesmentorItem[] = []
  async refresh() {
    await this.invesmentorService.getInvesmentor().toPromise()
      .then(res => {
        console.log(res)
        this.invesmentorItem = res as InvesmentorItem[];
        this.ProductItem = this.invesmentorItem.filter(e => e.itemType == 'PRODUCT');
        this.onlanguage();
      }).catch(err => this.alertNotificationService.alertError(err))

    if (this.id) {
      this.invesmentorService.getInvesmentorbyId(this.id).toPromise()
        .then(res => {
          this.invesmentor = res as Invesmentor;

          if (this.invesmentor.bundle) {
            this.insbundle = this.invesmentor.bundle as Ibundle[];
          }
          this.isUpdate = true;
          this.isapproved = this.invesmentor.approved;
        }).catch(err => this.alertNotificationService.alertError(err))
    }

    if (this.code) {
      this.isduplicate = true;
      this.invesmentorService.getInvesmentorbyId(this.code).toPromise()
        .then(res => {
          this.invesmentor = res as Invesmentor;
          if (this.invesmentor.bundle) {
            this.insbundle = this.invesmentor.bundle as Ibundle[];
          }
          this.invesmentor._id = '';
          this.invesmentor.image = '';
          this.invesmentor.approved = false;
          this.invesmentor.disable = false;
          this.invesmentor.code = '';
          this.isapproved = this.invesmentor.approved;
        }).catch(err => this.alertNotificationService.alertError(err))
    }
    if (!this.id && !this.code) {
      this.addForm()
    }

    this.invesmentorService.getInvesmentorList().toPromise()
      .then(res => {
        console.log(res)
        this.invesmentorList = res as Invesmentor[];
        this.invesmentorList = this.invesmentorList.filter((e) => e.approved && e._id != this.invesmentor._id)
        this.onlanguage();
      }).catch(err => this.alertNotificationService.alertError(err))

  }


  onChange(r) {
    this.invesmentorItem = this.invesmentorItem.filter(e => e.itemType == r);
  }

  clearform() {
    this.invesmentor.code = '';
    this.invesmentor.description = '';
    this.invesmentor.duration = '';
    this.invesmentor.name = '';
    this.invesmentor.price = 0;
    this.invesmentor.discountedprice = 0;
    this.invesmentor.approved = false;
    this.invesmentor.disable = false
    this.invesmentor.validity = 0;
    this.fd = new FormData();
  }


  submitForm(e: Event) {

    this.fd = new FormData();
    this.fd.append("_id", this.invesmentor._id);
    this.fd.append("name", this.invesmentor.name.toString());
    if (this.invesmentor.code) {
      this.fd.append("code", this.invesmentor.code?.toString());
    }
    this.fd.append("price", this.invesmentor.price.toString());
    this.fd.append("discountedprice", this.invesmentor.discountedprice.toString());
    this.fd.append("description", this.invesmentor.description.toString());
    this.fd.append("duration", this.invesmentor.duration.toString());
    this.fd.append("validity", this.invesmentor.validity.toString());
    this.fd.append("language", this.invesmentor.language.toString());
    this.fd.append("disable", this.invesmentor.disable ? "true" : "false");
    this.fd.append("bundle", JSON.stringify(this.insbundle))
    this.fd.append("short_code", this.invesmentor.short_code.toString())
    this.fd.append("min_selling_price", this.invesmentor.min_selling_price.toString())
    if (this.invesmentor.addOns && this.invesmentor.addOns.length > 0) {
      this.fd.append("addons", JSON.stringify(this.invesmentor.addOns))
    }
    if (this.invesmentor.upgrades && this.invesmentor.upgrades.length > 0) {
      this.fd.append("upgrades", JSON.stringify(this.invesmentor.upgrades))
    }
    if (this.isImageUploaded) {
      this.fd.append("file", this.filesToUpload, this.filesToUpload['name']);
    }

    if (this.isUpdate) {
      this.updateInvesmentor(e);
    }
    else {
      this.postInvesmentor(e);
    }
    e.preventDefault();
  }

  postInvesmentor(e: Event) {
    this.invesmentorService.postInvesmentorbundle(this.fd).toPromise()
      .then(_res => {
        this.alertNotificationService.toastAlertSuccess('Invesmentor Added Successfully')
        setTimeout(() => {
          this.router.navigateByUrl('/admin/invesmentor/invesmentor-list')
        }, 1000);
      }).catch(err => this.alertNotificationService.alertError(err));
    e.preventDefault();
  }
  updateInvesmentor(e: Event) {
    this.invesmentorService.updateInvesmentor(this.fd).toPromise()
      .then(_res => {
        this.alertNotificationService.toastAlertSuccess('Invesmentor Updated Successfully')
        setTimeout(() => {
          this.router.navigateByUrl('/admin/invesmentor/invesmentor-list')
        }, 1000);
      }).catch(err => this.alertNotificationService.alertError(err))
    e.preventDefault();
  }

  addForm() {
    var c = new Ibundle();
    c.FullpaymentAccess = false
    c.defaultAccess = true
    c.itemType = "PRODUCT"
    this.insbundle.push(c);
  }

  removeForm(index) {
    this.insbundle.splice(index, 1);
  }

  SearchFn(term: string, item: InvesmentorItem) {
    term = term.toLowerCase();
    return item.name.toLowerCase().indexOf(term) > -1 || item._id.toLowerCase().indexOf(term) > -1;
  }

}
