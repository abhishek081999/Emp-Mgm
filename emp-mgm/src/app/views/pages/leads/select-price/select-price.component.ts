import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Coupon } from 'src/app/model/coupon.model';
import { Course } from 'src/app/model/course.model';
import { Insignia } from 'src/app/model/insignia.model';
import { Invesmentor } from 'src/app/model/invesmentor.model';
import { Package } from 'src/app/model/package.model';
import { Subscription } from 'src/app/model/subscription.model';
import { AlertNotificationsService } from 'src/app/services/alert-notifications.service';
import { courseService } from 'src/app/services/course.service';
import { SubscriptionService } from 'src/app/services/subscription.service';

@Component({
  selector: 'app-select-price',
  templateUrl: './select-price.component.html',
  styleUrls: ['./select-price.component.scss']
})
export class SelectPriceComponent implements OnInit {

  constructor(
    public activeModal: NgbActiveModal,
    private courseService: courseService,
    private alertNotificationService: AlertNotificationsService,
    private subscriptionService: SubscriptionService) { }

  @Input() data
  allCoupons: Coupon[] = []
  course: Course
  product: Package
  insignia: Insignia
  invesmentor: Invesmentor
  iscourse = false
  isproduct = false
  isinsignia = false
  issub = false
  subscription: Subscription
  nosub = false
  isinvesmentor = false
  async ngOnInit() {
    var currentDate = new Date()
    await this.courseService.getallcoupons().toPromise()
      .then(res => {
        this.allCoupons = res as Coupon[];
        if (this.data.staff) {
          this.allCoupons = this.allCoupons.filter(e => e.approve && !e.isexpired && e.staffid == this.data.staff && new Date(e.startdate).getTime() <= currentDate.getTime() && new Date(e.expirydate).getTime() >= currentDate.getTime())
        } else {
          this.allCoupons = this.allCoupons.filter(e => e.approve && !e.isexpired && e.prefixcode == 'SP' && new Date(e.startdate).getTime() <= currentDate.getTime() && new Date(e.expirydate).getTime() >= currentDate.getTime())
        }
      }).catch(err => this.alertNotificationService.alertError(err))
    switch (this.data.servicetype) {
      case 'course':
        this.course = this.data.service
        this.iscourse = true
        this.createcourse()
        break;
      case 'insignia':
        this.isinsignia = true
        this.insignia = this.data.service
        this.createinsignia()
        break;
      case 'invesmentor':
        this.isinvesmentor = true
        this.invesmentor = this.data.service
        this.createinvesmentor()
        break;
      case 'product':
        this.isproduct = true
        this.product = this.data.service
        this.createproduct()
        break;
      case 'subscription':
        this.issub = true
        this.course = this.data.service
        if (this.course.coursesubscription) {
          this.createsubs(this.course.coursesubscription)
        } else {
          this.nosub = true
        }
        break;
      case 'insignia_subscription':
        this.issub = true
        this.insignia = this.data.service
        if (this.insignia.subscription) {
          this.createsubs(this.insignia.subscription)
        } else {
          this.nosub = true
        }
        break;
      default:
        break;
    }

  }
  allData: any[] = []
  createcourse() {
    var data = {
      mode: 'Mode 1',
      couponcode: 'No Coupon',
      firstins: this.course.discountedprice != 0 ? this.course.discountedprice : this.course.courseprice,
      secondins: null,
      secondinsdate: null,
      thirdins: null,
      thirdinsdate: null,
      total: this.course.discountedprice != 0 ? this.course.discountedprice : this.course.courseprice,
    }
    this.allData.push(data)
    if (this.course.paymentmethodtwo) {
      data = {
        mode: 'Mode 2',
        couponcode: 'No Coupon',
        firstins: this.course.paymentmtwo.firstamount,
        secondins: this.course.paymentmtwo.secondamount,
        secondinsdate: this.course.paymentmtwo.date,
        thirdins: null,
        thirdinsdate: null,
        total: this.course.paymentmtwo.totalamount
      }
      this.allData.push(data)
    }
    if (this.course.paymentmethodthree) {
      data = {
        mode: 'Mode 3',
        couponcode: 'No Coupon',
        firstins: this.course.paymentmthree.firstamount,
        secondins: this.course.paymentmthree.secondamount,
        secondinsdate: this.course.paymentmthree.firstdate,
        thirdins: this.course.paymentmthree.thirdamount,
        thirdinsdate: this.course.paymentmthree.seconddate,
        total: this.course.paymentmtwo.totalamount
      }
      this.allData.push(data)
    }
    if (this.course.paymentmethodfive) {
      data = {
        mode: 'Mode 5',
        couponcode: 'No Coupon',
        firstins: this.course.paymentmfive.firstamount,
        secondins: this.course.paymentmfive.secondamount,
        secondinsdate: this.course.paymentmfive.date,
        thirdins: null,
        thirdinsdate: null,
        total: this.course.paymentmfive.totalamount
      }
      this.allData.push(data)
    }
    if (this.allCoupons.length > 0) {
      this.allCoupons.forEach(e => {
        var price = this.course.discountedprice != 0 ? this.course.discountedprice : this.course.courseprice
        if (e.minimumbal <= price) {
          data = {
            mode: 'Mode 1',
            couponcode: e.couponcode,
            firstins: e.type == 'fixed' ? price - e.price : price - (price * e.price * 0.01),
            secondins: null,
            secondinsdate: null,
            thirdins: null,
            thirdinsdate: null,
            total: e.type == 'fixed' ? price - e.price : price - (price * e.price * 0.01),
          }
          this.allData.push(data)
        }
        if (this.course.paymentmethodtwo && e.minimumbal <= this.course.paymentmtwo.totalamount) {
          var discount = e.type == 'fixed' ? e.price : (this.course.paymentmtwo.totalamount * e.price * 0.01)
          data = {
            mode: 'Mode 2',
            couponcode: e.couponcode,
            firstins: this.course.paymentmtwo.firstamount,
            secondins: this.course.paymentmtwo.secondamount - (discount ? discount : 0),
            secondinsdate: this.course.paymentmtwo.date,
            thirdins: null,
            thirdinsdate: null,
            total: this.course.paymentmtwo.totalamount - (discount ? discount : 0)
          }
          this.allData.push(data)
        }
        if (this.course.paymentmethodthree && e.minimumbal <= this.course.paymentmthree.totalamount) {
          var discount = e.type == 'fixed' ? e.price : (this.course.paymentmthree.totalamount * e.price * 0.01)
          data = {
            mode: 'Mode 3',
            couponcode: e.couponcode,
            firstins: this.course.paymentmthree.firstamount,
            secondins: this.course.paymentmthree.secondamount - (discount ? discount : 0),
            secondinsdate: this.course.paymentmthree.firstdate,
            thirdins: this.course.paymentmthree.thirdamount,
            thirdinsdate: this.course.paymentmthree.seconddate,
            total: this.course.paymentmtwo.totalamount - (discount ? discount : 0)
          }
          this.allData.push(data)
        }
        if (this.course.paymentmethodfive && e.minimumbal <= this.course.paymentmfive.totalamount) {
          var discount = e.type == 'fixed' ? e.price : (this.course.paymentmfive.totalamount * e.price * 0.01)
          data = {
            mode: 'Mode 5',
            couponcode: e.couponcode,
            firstins: this.course.paymentmfive.firstamount,
            secondins: this.course.paymentmfive.secondamount - (discount ? discount : 0),
            secondinsdate: this.course.paymentmfive.date,
            thirdins: null,
            thirdinsdate: null,
            total: this.course.paymentmfive.totalamount - (discount ? discount : 0)
          }
          this.allData.push(data)
        }
      })
    }
    this.allData = this.allData.sort(e => e.mode)
  }

  createinsignia() {
    var data = {
      mode: 'Mode 1',
      couponcode: 'No Coupon',
      firstins: this.insignia.discountedprice != 0 ? this.insignia.discountedprice : this.insignia.price,
      secondins: null,
      secondinsdate: null,
      thirdins: null,
      thirdinsdate: null,
      forthins: null,
      forthinsdate: null,
      total: this.insignia.discountedprice != 0 ? this.insignia.discountedprice : this.insignia.price,
    }
    this.allData.push(data)
    if (this.insignia.paymentmethodtwo) {
      data = {
        mode: 'Mode 2',
        couponcode: 'No Coupon',
        firstins: this.insignia.paymentmtwo.firstamount,
        secondins: this.insignia.paymentmtwo.secondamount,
        secondinsdate: this.insignia.paymentmtwo.date,
        thirdins: null,
        thirdinsdate: null,
        forthins: null,
        forthinsdate: null,
        total: this.insignia.paymentmtwo.totalamount
      }
      this.allData.push(data)
    }
    if (this.insignia.paymentmethodthree) {
      data = {
        mode: 'Mode 3',
        couponcode: 'No Coupon',
        firstins: this.insignia.paymentmthree.firstamount,
        secondins: this.insignia.paymentmthree.secondamount,
        secondinsdate: this.insignia.paymentmthree.firstdate,
        thirdins: this.insignia.paymentmthree.thirdamount,
        thirdinsdate: this.insignia.paymentmthree.seconddate,
        forthins: null,
        forthinsdate: null,
        total: this.insignia.paymentmtwo.totalamount
      }
      this.allData.push(data)
    }
    if (this.insignia.paymentmethodfour) {
      data = {
        mode: 'Mode 4',
        couponcode: 'No Coupon',
        firstins: this.insignia.paymentmfour.firstamount,
        secondins: this.insignia.paymentmfour.secondamount,
        secondinsdate: this.insignia.paymentmfour.firstdate,
        thirdins: this.insignia.paymentmfour.thirdamount,
        thirdinsdate: this.insignia.paymentmfour.seconddate,
        forthins: this.insignia.paymentmfour.forthamount,
        forthinsdate: this.insignia.paymentmfour.thirddate,
        total: this.insignia.paymentmfour.totalamount
      }
      this.allData.push(data)
    }
    if (this.allCoupons.length > 0) {
      this.allCoupons.forEach(e => {
        var price = this.insignia.discountedprice != 0 ? this.insignia.discountedprice : this.insignia.price
        if (e.minimumbal <= price) {
          data = {
            mode: 'Mode 1',
            couponcode: e.couponcode,
            firstins: e.type == 'fixed' ? price - e.price : price - (price * e.price * 0.01),
            secondins: null,
            secondinsdate: null,
            thirdins: null,
            thirdinsdate: null,
            forthins: null,
            forthinsdate: null,
            total: e.type == 'fixed' ? price - e.price : price - (price * e.price * 0.01),
          }
          this.allData.push(data)
        }
        if (this.insignia.paymentmethodtwo && e.minimumbal <= this.insignia.paymentmtwo.totalamount) {
          var discount = e.type == 'fixed' ? e.price : (this.insignia.paymentmtwo.totalamount * e.price * 0.01)
          data = {
            mode: 'Mode 2',
            couponcode: e.couponcode,
            firstins: this.insignia.paymentmtwo.firstamount,
            secondins: this.insignia.paymentmtwo.secondamount - (discount ? discount : 0),
            secondinsdate: this.insignia.paymentmtwo.date,
            thirdins: null,
            thirdinsdate: null,
            forthins: null,
            forthinsdate: null,
            total: this.insignia.paymentmtwo.totalamount - (discount ? discount : 0)
          }
          this.allData.push(data)
        }
        if (this.insignia.paymentmethodthree && e.minimumbal <= this.insignia.paymentmthree.totalamount) {
          var discount = e.type == 'fixed' ? e.price : (this.insignia.paymentmthree.totalamount * e.price * 0.01)
          data = {
            mode: 'Mode 3',
            couponcode: e.couponcode,
            firstins: this.insignia.paymentmthree.firstamount,
            secondins: this.insignia.paymentmthree.secondamount - (discount ? discount : 0),
            secondinsdate: this.insignia.paymentmthree.firstdate,
            thirdins: this.insignia.paymentmthree.thirdamount,
            thirdinsdate: this.insignia.paymentmthree.seconddate,
            forthins: null,
            forthinsdate: null,
            total: this.insignia.paymentmtwo.totalamount - (discount ? discount : 0)
          }
          this.allData.push(data)
        }
        if (this.insignia.paymentmethodfour && e.minimumbal <= this.insignia.paymentmfour.totalamount) {
          var discount = e.type == 'fixed' ? e.price : (this.insignia.paymentmfour.totalamount * e.price * 0.01)
          data = {
            mode: 'Mode 4',
            couponcode: e.couponcode,
            firstins: this.insignia.paymentmfour.firstamount,
            secondins: this.insignia.paymentmfour.secondamount - (discount ? discount : 0),
            secondinsdate: this.insignia.paymentmfour.firstdate,
            thirdins: this.insignia.paymentmfour.thirdamount,
            thirdinsdate: this.insignia.paymentmfour.seconddate,
            forthins: this.insignia.paymentmfour.forthamount,
            forthinsdate: this.insignia.paymentmfour.thirddate,
            total: this.insignia.paymentmtwo.totalamount - (discount ? discount : 0)
          }
          this.allData.push(data)
        }
      })
    }
    this.allData = this.allData.sort(e => e.mode)

  }

  createinvesmentor() {
    var data = {
      mode: 'Mode 1',
      couponcode: 'No Coupon',
      total: this.invesmentor.discountedprice != 0 ? this.invesmentor.discountedprice : this.invesmentor.price,
    }
    this.allData.push(data)
    if (this.allCoupons.length > 0) {
      this.allCoupons.forEach(e => {
        var price = this.invesmentor.discountedprice != 0 ? this.invesmentor.discountedprice : this.invesmentor.price
        if (e.minimumbal <= price) {
          data = {
            mode: 'Mode 1',
            couponcode: e.couponcode,
            total: e.type == 'fixed' ? price - e.price : price - (price * e.price * 0.01),
          }
          this.allData.push(data)
        }
      })
    }
    this.allData = this.allData.sort(e => e.mode)

  }

  createproduct() {
    var data = {
      couponcode: 'No Coupon',
      total: this.product.price
    }
    this.allData.push(data)
    if (this.allCoupons.length > 0) {
      this.allCoupons.forEach(e => {
        if (e.minimumbal <= this.product.price) {
          data = {
            couponcode: e.couponcode,
            total: e.type == 'fixed' ? this.product.price - e.price : this.product.price - (this.product.price * e.price * 0.01),
          }
          if (data.total > 0)
            this.allData.push(data)
        }
      })
    }
  }

  createsubs(id) {
    this.subscriptionService.getPackagebyId(id).toPromise()
      .then(res => {
        this.subscription = res as Subscription;
        var data
        this.subscription.package.forEach(s => {
          data = {
            day: s.days,
            couponcode: 'No Coupon',
            total: s.price
          }
          this.allData.push(data)
          if (this.allCoupons.length > 0) {
            this.allCoupons.forEach(e => {
              if (e.minimumbal <= s.price) {
                data = {
                  day: s.days,
                  couponcode: e.couponcode,
                  total: e.type == 'fixed' ? s.price - e.price : s.price - (s.price * e.price * 0.01),
                }
                this.allData.push(data)
              }
            })
          }
        })
        this.allData.sort(e => e.day)
      })
  }

}
