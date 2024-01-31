import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FollowMyPortfolio, FollowMyPortfolioupdate } from '../model/follow-my-portfolio.model';

@Injectable({
  providedIn: 'root'
})
export class FollowMyPortfolioService {

  constructor(private http: HttpClient) { }

  postFollowMyPortfolio(MyPortfolio: FormData) {
    return this.http.post<FollowMyPortfolio>('/api/v2/follow-my-portfolio', MyPortfolio);  // --> Post API For My Portfolio
  }

  getfollowmyportfolioList() {
    return this.http.get<FollowMyPortfolio[]>('/api/v2/follow-my-portfolio');  // --> Get API For My Portfolio List
  }

  getfollowMyPortfolio(id, duration) {
    return this.http.get<FollowMyPortfolio>('/api/v2/follow-my-portfolio/' + id + "?duration=" + duration);  // --> Get API For My Portfolio selected One
  }

  postholding(data) {
    return this.http.post('/api/v2/follow-my-portfolio/holding', data);   // --> Post API For My Portfolio Holdings
  }

  updateHolding(data) {
    return this.http.patch('/api/v2/follow-my-portfolio/holding', data);   // --> Post API For My Portfolio Holdings
  }

  followMyPortfolioHoldings(id) {
    return this.http.get<any>('/api/v2/follow-my-portfolio/holding/' + id);  // --> Get API For My Portfolio selected Holdings List
  }

  getmyportfoliostockList(id) {
    return this.http.get<any>('/api/v2/follow-my-portfolio/buy-sell/' + id);  // --> Get API For My Portfolio Buy And Sell Table
  }

  getmyportfolioupdateList(id) {
    return this.http.get<any>('/api/v2/follow-my-portfolio/updates/' + id);  // --> Get API For Holding Update
  }

  postmyportfolioupdate(MyPortfolioupdate: FormData) {
    return this.http.post<FollowMyPortfolioupdate>('/api/v2/follow-my-portfolio/updates', MyPortfolioupdate);  // --> Post API For My Portfolio Update
  }

  deletemyportfolioupdates(id) {
    return this.http.delete<any>('/api/v2/follow-my-portfolio/updates/' + id);  // --> Delete API For My Portfolio Update
  }

  approvemyportfolioupdates(id) {
    return this.http.patch<any>('/api/v2/follow-my-portfolio/updates/approve', { id: id });  // --> Approve API For My Portfolio Update
  }
}
