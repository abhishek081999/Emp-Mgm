import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { FollowMyPortfolio, FollowMyPortfolioStocks, FollowMyPortfolioupdate } from 'src/app/model/follow-my-portfolio.model';
import { AlertNotificationsService } from 'src/app/services/alert-notifications.service';
import { ExportService } from 'src/app/services/export.service';
import { FollowMyPortfolioService } from 'src/app/services/follow-my-portfolio.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { StocksService } from 'src/app/services/stocks.service';
import { StockInstruments } from 'src/app/model/stockinstruments.model';
import { FollowMyPortfoliofoAddedModelComponent } from '../follow-my-portfoliofo-added-model/follow-my-portfoliofo-added-model.component';
import { Languages } from 'src/app/Enums/staticdata';
import { ApexAxisChartSeries, ApexNonAxisChartSeries, ApexGrid, ApexChart, ApexXAxis, ApexYAxis, ApexMarkers, ApexStroke, ApexLegend, ApexResponsive, ApexTooltip, ApexFill, ApexDataLabels, ApexPlotOptions, ApexTitleSubtitle } from 'ng-apexcharts';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  nonAxisSeries: ApexNonAxisChartSeries;
  colors: string[];
  grid: ApexGrid;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  markers: ApexMarkers,
  stroke: ApexStroke,
  legend: ApexLegend,
  responsive: ApexResponsive[],
  tooltip: ApexTooltip,
  fill: ApexFill
  dataLabels: ApexDataLabels,
  plotOptions: ApexPlotOptions,
  labels: string[],
  title: ApexTitleSubtitle
};
@Component({
  selector: 'app-follow-my-portfolio-stocklist',
  templateUrl: './follow-my-portfolio-stocklist.component.html',
  styleUrls: ['./follow-my-portfolio-stocklist.component.scss']
})
export class FollowMyPortfolioStocklistComponent implements OnInit {

  myPortfolio = new FollowMyPortfolio();
  total_invested_amount = 0;
  public lineChartOptions: Partial<ChartOptions>;
  graphDuration = '1y'
  constructor(
    private route: ActivatedRoute,
    private alertNotificationService: AlertNotificationsService,
    private followmyportfolioService: FollowMyPortfolioService,
    private exportService: ExportService,
    private modalService: NgbModal,
    private stocksService: StocksService
  ) {
    this.lineChartOptions = {
      series: [],
      colors: ["#7ee5e5", "#4d8af0"],
      grid: {
        borderColor: "rgba(77, 138, 240, .1)",
        padding: {
          bottom: 0
        }
      },
      chart: {
        height: 320,
        type: "line",
        parentHeightOffset: 0
      },
      xaxis: {
        type: "datetime",
        labels: {
          datetimeFormatter: {
            year: 'yyyy',
            month: 'MMM \'yy',
            day: 'dd MMM'
          },
        }
      },
      markers: {
        size: 0
      },
      stroke: {
        width: 3,
        curve: "smooth",
        lineCap: "round"
      },
      legend: {
        show: true,
        position: "top",
        horizontalAlign: 'left',
        containerMargin: {
          top: 30
        }
      },
      yaxis: {
        show: true,
        seriesName: "Return(%)",
        labels: {
          show: true,
          formatter: function (value) {
            return value + "%"
          }
        }
      },
      tooltip: {
        y: {
          formatter: function (value) {
            return value + "%";
          }
        },
        x: {
          format: 'dd MMM, yyyy'
        }
      },
      responsive: [
        {
          breakpoint: 500,
          options: {
            legend: {
              fontSize: "11px"
            }
          }
        }
      ]
    };
  }
  allBseStocksSell = [];
  allNseStocksSell = [];
  Myholdingbuysell = [];
  dataSourceBS: MatTableDataSource<any>;
  displayedColumnsbuysell: string[];
  Myportfolioupdate = [];
  statusFilter = 'All';

  typeFilter;
  languageFilter;
  currentPage3: number = 1
  totalSize3: number = 10

  allStocks: StockInstruments[] = []

  id: string;
  dataSource: MatTableDataSource<FollowMyPortfolioStocks>;
  isavailable = true
  isLoading = false
  @ViewChild('paginatorUS', { static: false }) paginatorUS!: MatPaginator;
  @ViewChild('paginatorPS', { static: false }) paginatorPS!: MatPaginator;
  @ViewChild('sortUS', { static: false }) sortUS!: MatSort;
  @ViewChild('sortPS', { static: false }) sortPS!: MatSort;
  displayedColumns: string[];
  myHoldings = [];
  dataLength: any;

  followMyPortfolioStocks: FollowMyPortfolioStocks = {
    _id: "",
    portfolio_id: '',
    ISIN: '',
    exchange: '',
    date: new Date(),
    is_Buy: false,
    price: 0,
    remarks: '',
    quantity: 0,
    total_invested_amount: 0,
    invested_amount: 0,
    average_price: 0,

  }

  followmyportfolioupdate: FollowMyPortfolioupdate = {
    _id: '',
    portfolio_id: '',
    details: '',
    type: '',
    image: '',
    video_link: '',
    approved: false,
    language: '',
    created_date: new Date(),
    created_by: '',
    approved_date: new Date(),
    approved_by: '',
    isEdited: false,
  }

  fd = new FormData();

  filesToUpload: File;

  isEdit: boolean;
  searchq: string = '';


  Type: string[] = ['text', 'image', 'video'];
  languages = Languages

  totalSize: number
  currentPage: number = 1
  pageSize: number = 10


  ngOnInit() {
    this.displayedColumns = ['sn', 'stock_name', 'market_cap', 'sector', 'last_added_date', 'last_added_price',
      'quantity', 'average_price', 'cmp', 'stock_return', 'weight',
      'amount_invested', 'invested_amount', 'day_change', 'amount_change'];

    this.displayedColumnsbuysell = ['sn', 'stock', 'market_cap', 'sector', 'exchange', 'is_Buy', 'date', 'price', 'average_price', 'quantity', 'weight', 'allocation', 'remarks', 'id'];
    this.route.paramMap.subscribe(params => {
      this.id = params.get('id');
      if (this.id) {
        this.refresh()
        this.refreshUpdates()
      }
    });
    this.stocksService.getStocks().toPromise()
      .then(res => {
        this.allStocks = res;
      }).catch(err => console.error(err));
  }

  onTabChange() {
    setTimeout(() => {
      if (this.paginatorPS && this.dataSourceBS) {
        this.dataSourceBS.paginator = this.paginatorPS;
      }
      if (this.sortPS && this.dataSourceBS) {
        this.dataSourceBS.sort = this.sortPS;
      }
      if (this.paginatorUS && this.dataSource) {
        this.dataSource.paginator = this.paginatorUS;
      }
      if (this.sortUS && this.dataSource) {
        this.dataSource.sort = this.sortUS;
      }
    }, 2000)
  }

  refreshGraph() {
    this.followmyportfolioService.getfollowMyPortfolio(this.id, this.graphDuration).toPromise()
      .then(res => {
        this.myPortfolio = res;
        if (this.myPortfolio?.graph_data) {
          var portfolio_value = [];
          var label = [];
          var index_value = [];
          if (Array.isArray(this.myPortfolio?.graph_data?.portfolio) && this.myPortfolio?.graph_data?.portfolio.length > 0) {
            portfolio_value = this.myPortfolio?.graph_data?.portfolio
          }
          if (Array.isArray(this.myPortfolio?.graph_data?.index) && this.myPortfolio?.graph_data?.index.length > 0) {
            index_value = this.myPortfolio?.graph_data?.index
          }
          this.lineChartOptions.series = [
            { name: this.myPortfolio.benchmark, data: index_value },
            { name: this.myPortfolio.portfolio_name, data: portfolio_value }
          ]
        }
      }).catch(err => this.alertNotificationService.alertError(err))
  }

  refresh() {
    this.refreshGraph();
    this.followmyportfolioService.followMyPortfolioHoldings(this.id).toPromise()
      .then(res => {
        this.myHoldings = res;
        this.isavailable = this.myHoldings.length > 0;
        this.isLoading = false
        this.dataSource = new MatTableDataSource(this.myHoldings);
        this.allBseStocksSell = this.myHoldings.filter(e => e.ISIN && e.exchange == "BSE").map(e => e.ISIN)
        this.allNseStocksSell = this.myHoldings.filter(e => e.ISIN && e.exchange == "NSE").map(e => e.ISIN)
        this.dataSource.paginator = this.paginatorUS;
        this.dataSource.sort = this.sortUS;
        this.dataLength = this.myHoldings.length;
      }).catch(e => this.alertNotificationService.alertError(e))

    this.followmyportfolioService.getmyportfoliostockList(this.id).toPromise()
      .then(res => {
        this.Myholdingbuysell = res;
        this.isavailable = this.Myholdingbuysell.length > 0;
        this.isLoading = false
        this.dataSourceBS = new MatTableDataSource(this.Myholdingbuysell);
        this.dataLength = this.Myholdingbuysell.length;

      }).catch(e => this.alertNotificationService.alertError(e))
  }

  refreshUpdates() {
    this.followmyportfolioService.getmyportfolioupdateList(this.id).toPromise()
      .then(res => {
        this.Myportfolioupdate = res;
        this.filter3()
      }).catch(err => this.alertNotificationService.alertError(err))
  }

  // ------------> My Portfolio Stocks <---------------

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  export() {
    this.exportService.exportonesheet(`${this.myPortfolio.portfolio_name} Holdings`, this.myHoldings)
  }
  // ------------> Buy and Sell <---------------


  applyFilter2(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceBS.filter = filterValue.trim().toLowerCase();

    if (this.dataSourceBS.paginator) {
      this.dataSourceBS.paginator.firstPage();
    }
  }

  export2() {
    this.exportService.exportonesheet(`${this.myPortfolio.portfolio_name} Buy Sell Alerts`, this.Myholdingbuysell)
  }


  Buynow(component) {
    this.followMyPortfolioStocks.is_Buy = true;
    this.clearBuySell()
    this.modalService.open(component, { size: 'lg', scrollable: true, centered: true, backdrop: 'static' }).result
      .then(resp => {
        if (resp == 'Save') {
          this.alertNotificationService.alertCustomMsg('Are you sure you want to Submit Data')
            .then(result => {
              if (result.isConfirmed) {
                var data = {
                  portfolio_id: this.id,
                  ISIN: this.followMyPortfolioStocks.ISIN,
                  exchange: this.followMyPortfolioStocks.exchange,
                  date: this.followMyPortfolioStocks.date,
                  is_Buy: true,
                  price: this.followMyPortfolioStocks.price,
                  remarks: this.followMyPortfolioStocks.remarks,
                  quantity: this.followMyPortfolioStocks.quantity,
                }
                this.followmyportfolioService.postholding(data).toPromise()
                  .then(res => {
                    this.alertNotificationService.toastAlertSuccess('Stock Buy Successfully Added');
                    this.followMyPortfolioStocks = new FollowMyPortfolioStocks();
                    this.refresh();
                    this.clearBuySell()
                  }).catch(err => this.alertNotificationService.alertError(err))
              }
            })
        }
      }).catch(err => console.log(err));
  }

  Sellnow(component) {
    this.followMyPortfolioStocks.is_Buy = false;
    this.clearBuySell()
    this.modalService.open(component, { size: 'lg', scrollable: true, centered: true, backdrop: 'static' }).result
      .then(resp => {
        if (resp == 'Save') {
          let sellingQty = Number(this.followMyPortfolioStocks.quantity)
          let holding = this.myHoldings.find(e => e.exchange == this.followMyPortfolioStocks.exchange && e.ISIN == this.followMyPortfolioStocks.ISIN)
          if (holding && holding.quantity >= sellingQty) {
            this.alertNotificationService.alertCustomMsg('Are you sure you want to Submit?')
              .then(result => {
                if (result.isConfirmed) {
                  var data = {
                    portfolio_id: this.id,
                    ISIN: this.followMyPortfolioStocks.ISIN,
                    exchange: this.followMyPortfolioStocks.exchange,
                    date: this.followMyPortfolioStocks.date,
                    is_Buy: false,
                    price: this.followMyPortfolioStocks.price,
                    remarks: this.followMyPortfolioStocks.remarks,
                    quantity: this.followMyPortfolioStocks.quantity
                  }
                  this.followmyportfolioService.postholding(data).toPromise()
                    .then(res => {
                      this.alertNotificationService.toastAlertSuccess('Successfully Sell Stock Added');
                      this.followMyPortfolioStocks = new FollowMyPortfolioStocks();
                      this.refresh()
                      this.clearBuySell()
                    }).catch(err => this.alertNotificationService.alertError(err))
                }
              })
          } else {
            this.alertNotificationService.alertError('Selling quantity could not be more than holding quantity');
          }
        }
      }).catch(err => console.log(err));
  }

  clearBuySell() {
    this.followMyPortfolioStocks.exchange = null;
    this.followMyPortfolioStocks.date = null;
    this.followMyPortfolioStocks.price = null;
    this.followMyPortfolioStocks.quantity = null;
    this.followMyPortfolioStocks.ISIN = null;
  }
  allStockAvailable: StockInstruments[] = [];
  exchangeSelect() {
    if (this.followMyPortfolioStocks.is_Buy) {
      this.allStockAvailable = this.allStocks.filter(e => e.exchange == this.followMyPortfolioStocks.exchange);
    } else {
      if (this.followMyPortfolioStocks.exchange == 'BSE') {
        this.allStockAvailable = this.allStocks.filter(e => e.exchange == this.followMyPortfolioStocks.exchange && this.allBseStocksSell.includes(e.ISIN));
      } else if (this.followMyPortfolioStocks.exchange == 'NSE') {
        this.allStockAvailable = this.allStocks.filter(e => e.exchange == this.followMyPortfolioStocks.exchange && this.allNseStocksSell.includes(e.ISIN));
      }
    }
  }

  SearchFn(term: string, item: StockInstruments) {
    term = term.toLowerCase();
    return item?.name?.toLowerCase().indexOf(term) > -1 || item?.stock_name?.toLowerCase().indexOf(term) > -1 || item?.tradingsymbol?.toLowerCase().indexOf(term) > -1;
  }

  // -----------> Update Follow My Portfoliofo <---------------

  filteredData3 = []
  filter3() {
    this.filteredData3 = [...this.Myportfolioupdate]
    if (this.statusFilter == 'Approved') {
      this.filteredData3 = this.filteredData3.filter(e => e.approved)
    }
    if (this.statusFilter == 'Pending') {
      this.filteredData3 = this.filteredData3.filter(e => !e.approved)
    }
    if (this.languageFilter) {
      this.filteredData3 = this.filteredData3.filter(e => e.language == this.languageFilter)
    }
    if (this.typeFilter) {
      this.filteredData3 = this.filteredData3.filter(e => e.type == this.typeFilter)
    }

    if (this.totalSize3! = this.filteredData3.length) {
      this.currentPage = 1
    }
    this.totalSize3 = this.filteredData3.length
  }


  pagechange3() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }


  getImage(name) {
    return `https://apps.invesmate.com/uploads/icons/${name}.png`
  }

  getUrl(s: string) {
    if (s.includes('/youtu.be/')) {
      return s.replace('/youtu.be/', '/www.youtube.com/embed/')
    }
    return s
  }

  onSelectionChanged = (event) => {
    if (event.oldRange == null) {
      this.onFocus();
    }
    if (event.range == null) {
      this.onBlur();
    }
  }

  onFocus = () => {
    console.log("On Focus");
  }

  onBlur = () => {
    console.log("Blurred");
  }

  quillConfig = {
    'emoji-toolbar': true,
    'emoji-textarea': true,
    'emoji-shortname': true,
    toolbar: {
      container: [
        ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
        // ['code-block'],
        //[{ 'header': 1 }, { 'header': 2 }],               // custom button values
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
        [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
        //  [{ 'direction': 'rtl' }],                         // text direction

        // [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
        // [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

        [{ 'align': [] }],
        ['emoji'],
        ['clean'],                                         // remove formatting button

        ['link'],
        // ['link', 'image', 'video']['emoji']
        //['link', 'image', 'video']
      ],
      handlers: { 'emoji': function () { } }
    },
  }

  // ==> Image upload <== //
  isImageUploaded = false
  handelFileInput3(event) {
    this.filesToUpload = <File>event.target.files[0];
    let element: HTMLElement = document.querySelector("#img + .input-group .file-upload-info") as HTMLElement;
    element.setAttribute('value', event.target.files[0].name);
    this.isImageUploaded = true;
  }

  openFileBrowser3(event: any) {
    event.preventDefault();
    let element: HTMLElement = document.querySelector("#img") as HTMLElement;
    element.click()
  }

  clearform3() {
    this.followmyportfolioupdate.details = '';
    this.followmyportfolioupdate.type = '';
    this.followmyportfolioupdate.language = '';
  }

  updatemyportfolio(Component) {
    this.modalService.open(Component, { size: 'xl', scrollable: true, centered: true, backdrop: 'static' });
  }

  myportfolioupdate(e: Event) {

    this.fd = new FormData();
    if (this.followmyportfolioupdate._id) {
      this.fd.append("_id", this.followmyportfolioupdate._id);
    }
    this.fd.append("portfolio_id", this.id);
    this.fd.append("details", this.followmyportfolioupdate.details.toString());
    this.fd.append("type", this.followmyportfolioupdate.type.toString());
    this.fd.append("language", this.followmyportfolioupdate.language.toString());
    this.fd.append("video_link", this.followmyportfolioupdate.video_link.toString());
    // this.fd.append("image", this.followmyportfolioupdate.image);
    if (this.isImageUploaded) {
      this.fd.append("file", this.filesToUpload, this.filesToUpload['name']);
    }
    this.followmyportfolioService.postmyportfolioupdate(this.fd).toPromise()
      .then(_res => {
        this.alertNotificationService.toastAlertSuccess('Portfolio Update Submitted Successfully')
        this.modalService.dismissAll();
        this.clearform3();
        this.refreshUpdates();
      }).catch(err => this.alertNotificationService.alertError(err))

  }

  editmyportfolioupdate(update, Component) {
    this.modalService.open(Component, { size: 'xl', scrollable: true, centered: true, backdrop: 'static' });
    this.isEdit = true
    this.followmyportfolioupdate = update
    this.pagechange3();
  }

  Approveupdate(id) {
    this.alertNotificationService.alertApprove()
      .then(result => {
        if (result.isConfirmed) {
          this.followmyportfolioService.approvemyportfolioupdates(id).toPromise()
            .then(res => {
              this.alertNotificationService.toastAlertSuccess("Approved Successfully.")
              this.refreshUpdates()
            }).catch(err => this.alertNotificationService.alertError(err))
        }
      })

  }


  Deleteupdate(id) {
    this.alertNotificationService.alertDelete()
      .then(result => {
        if (result.isConfirmed) {
          this.followmyportfolioService.deletemyportfolioupdates(id).toPromise()
            .then(res => {
              this.alertNotificationService.toastAlertSuccess("Deleted Successfully.")
              this.refresh();
            }).catch(err => this.alertNotificationService.alertError(err))
        }
      })
  }

  updateFMPholding: FollowMyPortfolioStocks = {
    ISIN: '',
    exchange: '',
    date: new Date(),
    is_Buy: false,
    price: 0,
    remarks: '',
    quantity: 0,
    allocation: 0,
    weight: 0,
    is_profit: true,
    invested_amount: 0,
    average_price: 0,
  }
  allStockAvailable1: StockInstruments[] = [];
  exchangeSelect1() {
    if (this.updateFMPholding.is_Buy) {
      this.allStockAvailable1 = this.allStocks.filter(e => e.exchange == this.updateFMPholding.exchange);
    } else {
      if (this.updateFMPholding.exchange == 'BSE') {
        this.allStockAvailable1 = this.allStocks.filter(e => e.exchange == this.updateFMPholding.exchange && this.allBseStocksSell.includes(e.ISIN));
      } else if (this.updateFMPholding.exchange == 'NSE') {
        this.allStockAvailable1 = this.allStocks.filter(e => e.exchange == this.updateFMPholding.exchange && this.allNseStocksSell.includes(e.ISIN));
      }
    }
  }
  onEdit(data, component) {
    this.updateFMPholding = data;
    this.exchangeSelect1();
    this.modalService.open(component, { size: 'lg', scrollable: true, centered: true, backdrop: 'static' }).result
      .then(resp => {
        if (resp == 'Save') {
          this.alertNotificationService.alertCustomMsg('Are you sure you want to Modify Data?')
            .then(result => {
              if (result.isConfirmed) {
                this.followmyportfolioService.updateHolding(this.updateFMPholding).toPromise()
                  .then(res => {
                    this.alertNotificationService.toastAlertSuccess('Modified Successfully');
                    this.followMyPortfolioStocks = new FollowMyPortfolioStocks();
                    this.refresh();
                  }).catch(err => this.alertNotificationService.alertError(err))
              }
            })
        }
      }).catch(err => console.log(err));
  }

  // -----------> Edit Follow My Portfoliofo <---------------



  editportfolio(item) {

    const modalRef: NgbModalRef = this.modalService.open(FollowMyPortfoliofoAddedModelComponent, {
      size: 'xl',
      scrollable: true,
      centered: true,
      backdrop: 'static',
    });
    modalRef.componentInstance.followmyportfolio = {
      _id: item._id,
      portfolio_name: item.portfolio_name,
      risk: item.risk,
      category: item.category,
      short_description: item.short_description,
      about: item.about,
    };
    modalRef.result.then(
      result => {
        this.refresh();
      }
    ).catch(
      error => {
        console.error('Error opening the modal:', error);
      }
    );
  }
}
