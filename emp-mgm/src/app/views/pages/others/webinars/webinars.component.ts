import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Webinar } from 'src/app/model/webinar.model';
import { AlertNotificationsService } from 'src/app/services/alert-notifications.service';
import { courseService } from 'src/app/services/course.service';

@Component({
  selector: 'app-webinars',
  templateUrl: './webinars.component.html',
  styleUrls: ['./webinars.component.scss']
})
export class WebinarsComponent implements OnInit {

  
  
  allData: Array<Webinar>=[];
  filterQuery="";
  rowsOnPage = 10;
  sortBy = "date";
  sortOrder = "desc";
  today = Date();
  dataLength;
  displayedColumns: string[];
  displayedColumns1: string[];
  dataSource: MatTableDataSource<Webinar>;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
 
  constructor(
    private courseService: courseService,
    private alertNotificationService: AlertNotificationsService,
    ) { }

    isavailable=true
    isLoading=false
  ngOnInit() {
    this.displayedColumns = ['host_id','topic','start_time','duration','created_at','id','password','account','webinar_type','leadid','invesScheduleID'];
    this.displayedColumns1 = ['host_id','topic','start_time','duration','created_at','id','password','account','webinar_type','leadid','invesScheduleID','opt'];
    this.refreshlist();
  }

  async refreshlist(){
    this.isLoading=true
    await this.courseService.getallWebinar().toPromise()
    .then(res=>{
      this.allData = res 
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

  deletewebi(id){
    this.courseService.deletewebi(id).toPromise()
    .then(res=>{
      this.alertNotificationService.toastAlertSuccess('Webinar Deleted');
      this.refreshlist();
    }).catch(err=>this.alertNotificationService.alertError(err));
  }
}
