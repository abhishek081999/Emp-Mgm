import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Carts } from 'src/app/model/carts.model';
import { AlertNotificationsService } from 'src/app/services/alert-notifications.service';
import { OrdersService } from 'src/app/services/orders.service';

@Component({
  selector: 'app-cart-lists',
  templateUrl: './cart-lists.component.html',
  styleUrls: ['./cart-lists.component.scss']
})
export class CartListsComponent implements OnInit {

 
  
  allData: Array<Carts>=[];
  filterQuery="";
  rowsOnPage = 10;
  sortBy = "date";
  sortOrder = "desc";
  today = Date();
  dataLength;
  displayedColumns: string[];
  dataSource: MatTableDataSource<Carts>;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
 
  constructor(
    private orderService: OrdersService,
    private alertNotificationService: AlertNotificationsService,
    ) { }

    isavailable=true
    isLoading=false
  ngOnInit() {
    this.displayedColumns = ["device_id", "student_name",  "total_cart_price", "course_price", "product_price", "first_ins_amount", "second_ins_amount", "third_ins_amount", "discount", "is_coupon_applied", 
    "cart_items", "coupon_code", "mode", "order_id","part_payment", "products", "accounts", "sales", "registration","paid", "createdAt" ];
    this.refreshlist();
  }

  async refreshlist(){
    this.isLoading=true
    await this.orderService.getAllCarts().toPromise()
    .then(res=>{
      this.allData = res as Carts[]
    }).catch(err=>this.alertNotificationService.alertError(err));

    this.isavailable=this.allData.length>0;
    this.isLoading=false
    this.dataSource=new MatTableDataSource(this.allData.reverse());
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataLength=this.allData.length;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}

