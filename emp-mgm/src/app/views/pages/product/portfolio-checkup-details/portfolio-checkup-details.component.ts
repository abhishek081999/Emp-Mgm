import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PortfolioCheckup, PortfolioCheckupStocks } from 'src/app/model/portfolio-checkup.model';
import { PackageService } from 'src/app/services/package.service';
import { Subscription as subs } from 'rxjs';
import { AlertNotificationsService } from 'src/app/services/alert-notifications.service';
import { MatTableDataSource } from '@angular/material/table';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Lessonsection } from 'src/app/model/lessonsection.model';
import { HttpEventType } from '@angular/common/http';
import { courseService } from 'src/app/services/course.service';
import { roundOff } from 'src/app/utility/roundOff';
import { StocksService } from 'src/app/services/stocks.service';
import { StockInstruments } from 'src/app/model/stockinstruments.model';
import { Products } from 'src/app/model/product.model';
import { environment } from 'src/environments/environment';
import { ExportService } from 'src/app/services/export.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';


@Component({
  selector: 'app-portfolio-checkup-details',
  templateUrl: './portfolio-checkup-details.component.html',
  styleUrls: ['./portfolio-checkup-details.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class PortfolioCheckupDetailsComponent implements OnInit, OnDestroy {
  filesToUpload: Array<File> = [];
  dates: string;
  Products = new Products();

  constructor(
    private productService: PackageService,
    private courseService: courseService,
    private route: ActivatedRoute,
    private alertNotificationService: AlertNotificationsService,
    private router: Router,
    private exportService: ExportService,
    private stocksService: StocksService) { }

  portfolioCheckup = new PortfolioCheckup();
  portfolioStocks: PortfolioCheckupStocks[] = []
  isLoading = true
  paramSub: subs
  id
  downloadable: boolean = false;
  visible: boolean = false;
  filterQuery = "";
  rowsOnPage = 10;
  sortBy = "date";
  sortOrder = "desc";
  dataLength;
  displayedColumns: string[];
  dataSource: MatTableDataSource<PortfolioCheckupStocks>;
  expandedElement: PortfolioCheckupStocks | null;
  replyDocs: Lessonsection[] = []
  isupload
  progressvalue
  fd = new FormData();
  postFile: subs;
  totalAmount = 0
  currentTotalValue = 0
  per1
  per2
  percentage
  totalReturn = 0
  totalReturnPerc = 0
  allStocks: StockInstruments[] = []
  allExchangeStocks: StockInstruments[] = [];
  allBseStocks: StockInstruments[] = [];
  allNseStocks: StockInstruments[] = [];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  ngOnDestroy() {
    if (this.paramSub)
      this.paramSub.unsubscribe()

    if (this.postFile)
      this.postFile.unsubscribe()
  }

  ngOnInit(): void {
    this.dates = new Date().getTime().toString();
    this.displayedColumns = ['sr_no', 'exchange', 'stock_name', 'holding_for', 'holding_qty', 'buying_price', 'percentage', 'ltp', 'invested_amount', 'status', 'expand'];
    this.paramSub = this.route.paramMap.subscribe(params => {
      this.id = params.get('id');
      if (this.id)
        this.refresh()
    });
  }

  async refresh() {
    await this.stocksService.getStocks().toPromise()
      .then(res => {
        this.allStocks = res;
        this.allNseStocks = this.allStocks.filter(e => e.exchange == 'NSE');
        this.allBseStocks = this.allStocks.filter(e => e.exchange == 'BSE');
      }).catch(err => console.error(err));
    await this.productService.getPortfolioCheckupDetails(this.id).toPromise()
      .then(res => {
        this.portfolioCheckup = res;
        this.portfolioStocks = this.portfolioCheckup.portfolio_stocks;
        this.dataSource = new MatTableDataSource(this.portfolioStocks);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.calculate()
        if (this.portfolioCheckup.reply && this.portfolioCheckup.reply.length > 0) {
          this.replyDocs = this.portfolioCheckup.reply;
          if (this.replyDocs) {
            this.downloadable = true
          }
        } else {
          this.addReplyDocs()
        }
        this.isLoading = false

      }).catch(err => this.alertNotificationService.alertError(err))

    this.portfolioStocks.forEach((e) => {
      if (!e.IsStudentVisibility) {
        var a = this.allStocks.find(r => r.name == e.stock_name && r.exchange == e.exchange);
        if (a && a.fundamentalAnalysis) {
          e.fundamentalReply = a.fundamentalAnalysis
        }
        if (a && a.technicalAnalysis) {
          e.technicalReply = a.technicalAnalysis
        }
        if (a && a.invesmateAnalysis) {
          e.reply = a.invesmateAnalysis
        }
      }
    })
  }
  hold: string[] = ['Long Term', 'Mid Term', 'Short Term'];
  isedit = false
  async editform() {
    await this.stocksService.getStocks().toPromise()
      .then(res => {
        this.allStocks = res;
        this.allNseStocks = this.allStocks.filter(e => e.exchange == 'NSE');
        this.allBseStocks = this.allStocks.filter(e => e.exchange == 'BSE');
      }).catch(err => console.error(err));

    await this.productService.getPackagebyId(this.portfolioCheckup.product_id).toPromise()
      .then(res => {
        this.Products = res;
      }).catch(err => console.error(err));
    this.isedit = true
  }

  calculate() {
    this.totalAmount = this.portfolioStocks.filter(f => f.invested_amount).map(e => e.invested_amount).reduce((acc, value) => Number(acc) + Number(value), 0)
    this.currentTotalValue = this.portfolioStocks.filter(f => f.ltp && f.holding_qty).map(e => e.ltp * e.holding_qty).reduce((acc, value) => Number(acc) + Number(value), 0)
    this.totalReturn = this.currentTotalValue - this.totalAmount;
    this.totalReturnPerc = roundOff((this.totalReturn / this.totalAmount) * 100);


    this.per1 = this.portfolioStocks.filter(e => e.buying_price).map(e => e.buying_price)
    this.percentage = (this.per1 / this.currentTotalValue)
  }
  addReplyDocs() {
    this.replyDocs.push(new Lessonsection());
  }

  calc(p: PortfolioCheckupStocks) {
    if (p.holding_qty && p.buying_price) {
      p.holding_qty = Number(p.holding_qty);
      p.buying_price = Number(p.buying_price);
      p.invested_amount = p.holding_qty * p.buying_price;
    }
  }

  removeReplyDocs(i) {
    this.replyDocs.splice(i, 1)
  }

  visibleReplies(p: PortfolioCheckupStocks) {
    if (p.IsStudentVisibility) {
      p.IsStudentVisibility = false;
      this.alertNotificationService.toastAlertSuccess('Replies are hidden(You need to submit for changes)');
    }
    else {
      p.IsStudentVisibility = true;
      this.alertNotificationService.toastAlertSuccess('Now Student can see the replies(You need to submit for changes)');
    }
  }
  getPdf(portfolioCheckup: PortfolioCheckup) {
    this.stocksService.getPdf(portfolioCheckup._id).toPromise()
      .then(res => {
        const blob = res as Blob;
        const url = window.URL.createObjectURL(blob);
        var link = document.createElement('a');
        link.href = url;
        link.download = 'Student_' + portfolioCheckup.student_invid + '_Portfolio_Report_' + '.pdf';
        link.click();
        window.URL.revokeObjectURL(url);
        this.alertNotificationService.toastAlertSuccess('Downloaded Successfully');
      }).catch(err => this.alertNotificationService.alertError(err));
  }

  handelFileInput(event, m: Lessonsection) {
    m.file = this.dates + event.target.files[0].name;
    this.filesToUpload.push(<File>event.target.files[0]);
  }

  submit() {
    for (let cs of this.replyDocs) {
      if (cs.type == "Document")
        cs.file = cs.file.split('\\').pop();
    }
    this.portfolioCheckup.reply = this.replyDocs;
    const files: Array<File> = this.filesToUpload;

    for (let i = 0; i < files.length; i++) {
      this.fd.append("file", files[i], this.dates + files[i]['name']);
    }

    this.portfolioStocks.forEach(e => e.isValidated = true);
    this.portfolioCheckup.portfolio_stocks = this.portfolioStocks;
    this.isupload = true;
    this.postFile = this.courseService.postFile(this.fd).subscribe(
      res => {
        if (res.type === HttpEventType.UploadProgress) {
          this.progressvalue = Math.round(100 * res.loaded / res.total);
        }
        if (res.type === HttpEventType.Response) {

          this.productService.portfolioCheckupReply(this.portfolioCheckup).toPromise()
            .then(res => {
              this.alertNotificationService.toastAlertSuccess('Reply Added Successfully');
              this.router.navigate(['/admin/products/portfolio-checkup']);
              this.isedit = false
            }).catch(err => {
              this.alertNotificationService.alertError(err)
            })
        }
      },
      err => {
        this.alertNotificationService.alertError(err)
      }
    );

  }

  validated(p: PortfolioCheckupStocks) {
    if (p.isValidated) {
      p.isValidated = false
    } else {
      p.isValidated = true
    }
    for (let cs of this.replyDocs) {
      if (cs.type == "Document")
        cs.file = cs.file.split('\\').pop();
    }
    this.portfolioCheckup.reply = this.replyDocs;
    const files: Array<File> = this.filesToUpload;

    for (let i = 0; i < files.length; i++) {
      this.fd.append("file", files[i], this.dates + files[i]['name']);
    }

    this.isupload = true;
    this.portfolioCheckup.portfolio_stocks = this.portfolioStocks;
    this.postFile = this.courseService.postFile(this.fd).subscribe(
      res => {
        if (res.type === HttpEventType.UploadProgress) {
          this.progressvalue = Math.round(100 * res.loaded / res.total);
        }
        if (res.type === HttpEventType.Response) {
          this.productService.portfolioCheckupReply(this.portfolioCheckup).toPromise()
            .then(res => {
              this.alertNotificationService.toastAlertSuccess('Saved Successfully');
              this.isupload = false
            }).catch(err => {
              this.alertNotificationService.alertError(err)
            })
        }
      },
      err => {
        this.alertNotificationService.alertError(err)
      }
    );
  }
  getprice(p: PortfolioCheckupStocks) {
    if (p.ltp && p.buying_price) {
      p.ltp = Number(p.ltp)
      p.buying_price = Number(p.buying_price)
      return roundOff(((p.ltp - p.buying_price) / p.buying_price) * 100)
    }
    return 0;

  }
  getCurrentValue(p: PortfolioCheckupStocks) {
    if (p.ltp && p.holding_qty) {
      p.ltp = Number(p.ltp)
      p.holding_qty = Number(p.holding_qty)
      return p.ltp * p.holding_qty;
    }
    return 0;
  }

  getper(p: PortfolioCheckupStocks) {
    if (this.currentTotalValue && p.buying_price) {
      p.buying_price = Number(p.buying_price);
      return roundOff((this.getCurrentValue(p) / this.currentTotalValue) * 100);
    }
    return 0;
  }

  export() {
    this.exportService.exportonesheet('Portfolio Stocks_' + this.portfolioCheckup.student_invid, this.portfolioStocks);
  }

  addStock() {
    if (this.portfolioStocks.length <= this.Products.no_of_stocks) {
      this.portfolioStocks.push(new PortfolioCheckupStocks())
      this.dataSource = new MatTableDataSource(this.portfolioStocks);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  stockSelect(p: PortfolioCheckupStocks) {
    var s = this.allExchangeStocks.find(e => e.name == p.stock_name)
    p.ltp = s ? s.last_price : 0;
    p.stock_name = s ? s.name : null;
  }

  exchangeSelect(p: PortfolioCheckupStocks) {
    this.allExchangeStocks = this.allStocks.filter(e => e.exchange == p.exchange)
    this.stockSelect(p);
  }


  imageurl = environment.imageUrl;
  downloaddoc(p) {
    if (p.type == "Document") {
      if (p.file && this.downloadable) {
        var link = document.createElement('a');
        link.href = this.imageurl + p.file
        link.download = String(p.title);
        link.click();

      }
    }
  }
  SearchFn(term: string, item: StockInstruments) {
    term = term.toLowerCase();
    return item?.name?.toLowerCase().indexOf(term) > -1 || item?.stock_name?.toLowerCase().indexOf(term) > -1 || item?.tradingsymbol?.toLowerCase().indexOf(term) > -1;
  }
}
