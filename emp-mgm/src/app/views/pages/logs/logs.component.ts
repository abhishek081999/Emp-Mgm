import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertNotificationsService } from 'src/app/services/alert-notifications.service';
import { UserService } from 'src/app/services/user.service';
import { ExportService } from 'src/app/services/export.service';

class logsData{
  _id?:string;
  method?:string;
  url?:string;
  ip?:string;
  statusCode?:number;
  message?:string;
  stack?:any;
  body?:any;
  createdAt?: Date;
  expiresAt?: Date;
}

@Component({
  selector: 'app-logs',
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.scss']
})
export class LogsComponent implements OnInit {

  constructor(
    private userService:UserService,
    private alertNotificationService:AlertNotificationsService,
    private modalService: NgbModal,
    private exportService: ExportService,) { }
    logsdata:logsData[]=[]

    displayedColumns: string[];
  dataSource: MatTableDataSource<logsData>;
  isLoading:boolean
  selection = new SelectionModel<logsData>(true, []);

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  ngOnInit(): void {
    this.displayedColumns=['select','statusCode','method','url','ip','message','expiresAt','id']
    this.isLoading=true
    this.refresh()

  }

  refresh(){
    this.userService.getlogs().toPromise()
    .then(res=>{
      console.log(res)
      this.logsdata=res as logsData[]
      this.dataSource=new MatTableDataSource(this.logsdata);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.isLoading=false
    }).catch(err=>this.alertNotificationService.alertError(err))
  }
  data:logsData
  details(content,data){
    this.data=data
    this.modalService.open(content, {scrollable: true, size:'xl'}).result.then((result) => {
    }).catch((res) => {});
  }

  export(){
    // let theJSON = JSON.stringify(this.logsdata);
    // let blob = new Blob([theJSON], { type: 'text/json' });
    // var a = document.createElement('a')
    // a.download = 'logs.json';
    // a.href = window.URL.createObjectURL(blob);
    // a.click() 
    var d =this.logsdata
    d.forEach(e=>{
      e.createdAt = new Date(e.createdAt)
      e.expiresAt = new Date(e.expiresAt)
      e._id = null
      e.ip= null
      e.message = null
      e.stack = null
      e.body = null
    })
    this.exportService.exportonesheet('logs',this.logsdata)
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getData(data){
    if(data){
      try{
        return JSON.stringify(data, undefined, 2);
      }catch{
        return data
      }
      
    }
    return data
  }

  delete(id){
    this.alertNotificationService.alertDelete()
    .then(result=>{
      if(result.isConfirmed){
        this.userService.deletelogs(id).toPromise()
        .then(res=>{this.alertNotificationService.toastAlertSuccess('Deleted');this.refresh()})
        .catch(err=>this.alertNotificationService.alertError(err))
      }
    })
  }

  getPageData() {
    if(this.dataSource)
      return this.dataSource._pageData(this.dataSource._orderData(this.dataSource.filteredData));
    return []
  }

  isEntirePageSelected() {
    return this.getPageData().every((row) => this.selection.isSelected(row));
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    if(this.dataSource){
      const numSelected = this.selection.selected.length;
      const numRows = this.dataSource.filteredData.length;
      return numSelected === numRows;
    }
    return false
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
 /* masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    //this.selection.select(...this.dataSource.filteredData);
  }*/

  masterToggle() {
    this.isEntirePageSelected() ?
      this.selection.deselect(...this.getPageData()) :
      this.selection.select(...this.getPageData());
  }

  /** The label for the checkbox on the passed row */
  /*checkboxLabel(row?: logsData,i?:number): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${i}`;
  }*/

  checkboxLabel(row?,i?): string {
    if (!row) {
      return `${this.isEntirePageSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${i}`;
  }

  deleteSelected(){
    console.log(this.selection)
    var ids = this.selection.selected.map(e=>e._id)
    console.log(ids)
    this.alertNotificationService.alertCustomMsg('Delete '+ids.length+' logs?')
    .then(result=>{
      if(result.isConfirmed){
        this.userService.deleteMultiplelogs(ids).toPromise()
        .then(res=>{this.alertNotificationService.toastAlertSuccess('Deleted');this.refresh()})
        .catch(err=>this.alertNotificationService.alertError(err))
      }
    })
  }

}
