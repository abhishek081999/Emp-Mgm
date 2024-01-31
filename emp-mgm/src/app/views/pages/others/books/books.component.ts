import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Books } from 'src/app/model/books.model';
import { AlertNotificationsService } from 'src/app/services/alert-notifications.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.scss']
})
export class BooksComponent implements OnInit {
  allbooks: Books[]=[];

  constructor(private userService:UserService,private alertNotificationService:AlertNotificationsService) { }

  books:Books={
    _id:'',
    url:'',
    approved:false
  }
  
  today = Date();

  totalSize:number
  currentPage:number=1
  pageSize:number=16

  ngOnInit() {
    this.refresh()
  }
  isbookavailable=false
  refresh(){
    this.userService.getBooks().toPromise()
    .then(res=>{ 
      this.allbooks = res; 
      this.isbookavailable = this.allbooks.length>0
      this.totalSize = this.allbooks.length
    })
    .catch(err=>this.alertNotificationService.alertError(err))
  }

  submit(f:NgForm){
    this.books.url=this.books.url.trim()
    this.books.approved=false;
    this.userService.postBooks(this.books).toPromise()
    .then(res=>{
        f.resetForm()
        this.alertNotificationService.toastAlertSuccess('Added Successfully');
        this.refresh();
      }).catch(err=>this.alertNotificationService.alertError(err))
  }

  onDelete(id){
    this.alertNotificationService.alertDelete()
    .then((result) => {
      if (result.isConfirmed) {
        this.userService.deleteBooks(id).toPromise()
        .then(
          res=>{
            this.alertNotificationService.toastAlertSuccess('Deleted Successfully');
            this.refresh()
        }).catch(err=>this.alertNotificationService.alertError(err))
      }
    })
  }
  
  onApprove(id){
    this.alertNotificationService.alertApprove()
    .then((result) => {
      if (result.isConfirmed) {
        this.userService.approveBooks(id).toPromise()
      .then(
        res=>{
          this.alertNotificationService.toastAlertSuccess('Approved Successfully');
          this.refresh()
        }).catch(err=>this.alertNotificationService.alertError(err))
      }
    })
  }

}
