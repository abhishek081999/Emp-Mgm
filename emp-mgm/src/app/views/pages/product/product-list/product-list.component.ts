import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Languages } from 'src/app/Enums/staticdata';
import { Products, ProductsDisplay } from 'src/app/model/product.model';
import { AlertNotificationsService } from 'src/app/services/alert-notifications.service';
import { PackageService } from 'src/app/services/package.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {


  languagefilter: any;
  languages = Languages

  constructor(
    private productService: PackageService,
    private alertNotificationService: AlertNotificationsService,
    private router: Router) { }

  ngOnInit(): void {
    this.refresh();
  }
  allProduct: ProductsDisplay[] = []
  isLoading = false
  totalSize: number
  currentPage: number = 1
  pageSize: number = 10
  imageurl = environment.imageUrl;
  searchq: string = '';
  pagefilter: string = '';
  alllistfinal: ProductsDisplay[] = []
  refresh() {
    this.isLoading = true;
    this.productService.getallProduct().toPromise()
      .then(res => {
        this.allProduct = res;
        this.isLoading = false
        this.filter()
      }).catch(err => this.alertNotificationService.alertError(err))
  }

  onApprove(c) {
    this.alertNotificationService.alertApprove()
      .then(result => {
        if (result.isConfirmed) {
          var data = { new_batch: false, productid: null }
          if (c.productid) {
            data = { new_batch: true, productid: c.productid.split('-')[0] }
          }
          this.productService.approveProduct(data, c._id).toPromise()
            .then(res => {
              this.refresh()
              this.alertNotificationService.toastAlertSuccess('Product Approved Successfully')
            }).catch(err => this.alertNotificationService.alertError(err))
        }
      })

  }

  editproduct(product) {
    this.router.navigateByUrl('/admin/products/edit-products/' + product._id)
  }

  duplicateproduct(product) {
    this.router.navigate(['/admin/products/add-products'], { queryParams: { code: product._id } })
  }

  duplicateproduct1(product) {
    this.router.navigate(['/admin/products/add-products'], { queryParams: { code: product._id, new: 'batch' } })
  }

  filter() {
    this.alllistfinal = [...this.allProduct]
    if (this.pagefilter == "approved") {
      this.alllistfinal = this.alllistfinal.filter(e => e.approve);
    }
    if (this.pagefilter == "Pending") {
      this.alllistfinal = this.alllistfinal.filter(e => !e.approve);
    }

    if (this.languagefilter) {
      this.alllistfinal = this.alllistfinal.filter(l => l.language == this.languagefilter);
    }

    if (this.searchq) {
      this.searchq = this.searchq.toLowerCase()
      this.alllistfinal = this.alllistfinal.filter((e) => (e.productid && e.productid.toLowerCase().indexOf(this.searchq) > -1) || (e.name && e.name.toLowerCase().indexOf(this.searchq) > -1) || (e.type && e.type.toString().toLowerCase().indexOf(this.searchq) > -1));
    }

    if (this.totalSize != this.alllistfinal.length) {
      this.currentPage = 1
    }
    this.totalSize = this.alllistfinal.length
  }

  pagechange() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }

  onDelete(product) {
    this.alertNotificationService.alertDelete()
      .then(result => {
        if (result.isConfirmed) {
          this.productService.deletePackage(product._id).toPromise()
            .then(res => {
              this.alertNotificationService.toastAlertSuccess('Product Deleted Successfully')
              this.refresh();
            })
            .catch(err => this.alertNotificationService.alertError(err))
        }
      })
  }
}
