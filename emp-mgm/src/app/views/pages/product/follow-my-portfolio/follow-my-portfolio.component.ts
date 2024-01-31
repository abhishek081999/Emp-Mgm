import { Component, OnInit } from '@angular/core';
import {  Router } from '@angular/router';
import { AlertNotificationsService } from 'src/app/services/alert-notifications.service';
import { FollowMyPortfolioService } from 'src/app/services/follow-my-portfolio.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FollowMyPortfoliofoAddedModelComponent } from '../follow-my-portfoliofo-added-model/follow-my-portfoliofo-added-model.component';

@Component({
  selector: 'app-follow-my-portfolio',
  templateUrl: './follow-my-portfolio.component.html',
  styleUrls: ['./follow-my-portfolio.component.scss']
})
export class FollowMyPortfolioComponent implements OnInit {

  totalSize: number
  currentPage: number = 1
  pageSize: number = 10
  isLoading: boolean;
  allfollowmyportfolios = [];
  searchq: string = '';

  constructor(
    private alertNotificationService: AlertNotificationsService,
    private router: Router,
    private followmyportfolioService: FollowMyPortfolioService,
    private modalService: NgbModal,
  ) { }

  ngOnInit() {
    this.refreshList();
  }

  refreshList() {
    this.isLoading = true
    this.followmyportfolioService.getfollowmyportfolioList().toPromise()
      .then(res => {
        this.allfollowmyportfolios = res;
        this.isLoading = false
        this.filter()
      }).catch(err => { this.isLoading = false; this.alertNotificationService.alertError(err) })

  }

  Showstocklist(_id) {
    this.router.navigateByUrl('/admin/products/follow-my-portfolio-stocklist/' + _id)
  }

  addedPortfolio() {
    const modalRef: NgbModalRef = this.modalService.open(FollowMyPortfoliofoAddedModelComponent, {
      size: 'xl',
      scrollable: true,
      centered: true,
      backdrop: 'static',
    });
    modalRef.componentInstance.followmyportfolio = {
      _id: '',
      portfolio_name: '',
      risk: '',
      category: '',
      short_description:'',
      about: ''
    };
    modalRef.result.then(
      result => {
        this.refreshList();
      }
    ).catch(
      error => {
        console.error('Error opening the modal:', error);
      }
    );
  }

  filteredData = []
  filter() {
    this.filteredData = [...this.allfollowmyportfolios]
    if (this.searchq) {
      this.searchq = this.searchq.toLowerCase();
      this.filteredData = this.filteredData.filter((e) => e.portfolio_name.toString().toLowerCase().indexOf(this.searchq) > -1 || e.risk.toString().toLowerCase().indexOf(this.searchq) > -1 || e.category.toString().toLowerCase().indexOf(this.searchq) > -1);
    }

    if (this.totalSize != this.filteredData.length) {
      this.currentPage = 1
    }
    this.totalSize = this.filteredData.length
  }


  pagechange() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }

}
