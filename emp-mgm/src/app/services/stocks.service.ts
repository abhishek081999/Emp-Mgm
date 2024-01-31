import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { StockInstruments } from '../model/stockinstruments.model';
import { PortfolioCheckup } from '../model/portfolio-checkup.model';

@Injectable({
  providedIn: 'root'
})
export class StocksService {

  constructor(private http: HttpClient) { }

  getStocks(){
    return this.http.get<StockInstruments[]>('/api/v2/stock-instruments-list?q=all');
  }
  getPdf(portfolio_id){
    return this.http.get('/api/v2/portfolio-review-pdf/'+portfolio_id,{responseType: 'blob' as 'json'});
  }
}
