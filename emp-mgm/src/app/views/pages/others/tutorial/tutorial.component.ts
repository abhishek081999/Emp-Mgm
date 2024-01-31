import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Tutorials } from 'src/app/model/tutorials.model';
import { AlertNotificationsService } from 'src/app/services/alert-notifications.service';
import { ExportService } from 'src/app/services/export.service';
import { UserService } from 'src/app/services/user.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-tutorial',
  templateUrl: './tutorial.component.html',
  styleUrls: ['./tutorial.component.scss']
})
export class TutorialComponent implements OnInit {
  


  constructor(
    private userService:UserService,
    private alertNotificationService: AlertNotificationsService,
    private exportService:ExportService) { }

  tutorial:Tutorials={
    _id:'',
    url:'',
    title:'',
    type:'',
    language:'',
    device:'',
    approved:false
  }
  
  languages=['Assamese','Bengali','English','Gujrati','Hindi', 'Kannada','Kashmiri','Malayalam','Marathi',
            'Nepali','Odia','Punjabi','Sindhi','Tamil','Telugu','Urdu']

  alltutorial:Tutorials[] = []
  filterQuery="";
  rowsOnPage = 5;
  sortBy = "id";
  sortOrder = "asc";
  today = Date();
  dataLength;
  displayedColumns: string[];
  dataSource: MatTableDataSource<Tutorials>;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  ngOnInit() {
    this.displayedColumns = ['type','language','device','title','url','approved','id'];
    this.refreshlist()
  }

  refreshlist(){
    this.userService.getTutorial().toPromise()
    .then(res=>{
        this.alltutorial=res
        this.dataSource=new MatTableDataSource(this.alltutorial);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }).catch(err=>this.alertNotificationService.alertError(err))
  }

  isupdate=false;
  
  postTutorial(f:NgForm){
    if(this.isupdate){
      this.tutorial.approved=false
      this.userService.updateTutorial(this.tutorial).toPromise()
      .then(
        res=>{
          f.resetForm()
          this.isupdate=false
          this.alertNotificationService.toastAlertSuccess('Update Successfully');
          this.refreshlist()
        }).catch(err=>this.alertNotificationService.alertError(err))
    }
    else{
      this.tutorial.approved=false
      this.userService.postTutorial(this.tutorial).toPromise()
      .then(
        res=>{
          f.resetForm()
          this.alertNotificationService.toastAlertSuccess('Added Successfully');
          this.refreshlist()
        }).catch(err=>this.alertNotificationService.alertError(err))
    }
    
  }

  

  onEdit(tutorial){
    this.tutorial=tutorial;
    this.isupdate=true;
  }

  onDelete(id){
    this.alertNotificationService.alertDelete()
    .then((result) => {
      if (result.isConfirmed) {
        this.userService.deleteTutorial(id).toPromise()
        .then(
          res=>{
            this.alertNotificationService.toastAlertSuccess('Deleted Successfully');
            this.refreshlist()
          }).catch(err=>this.alertNotificationService.alertError(err))
      }
    })
  }
  

  onApprove(tutorial){
    this.alertNotificationService.alertApprove()
    .then((result) => {
      if (result.isConfirmed) {
        tutorial.approved=true
      this.userService.updateTutorial(tutorial).toPromise()
      .then(
        res=>{
          this.alertNotificationService.toastAlertSuccess('Approved Successfully');
          this.refreshlist()
        }).catch(err=>this.alertNotificationService.alertError(err))
      }
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  export(){
    this.exportService.exportonesheet('Tutorials',this.alltutorial)
  }
}
