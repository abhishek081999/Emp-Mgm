import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Kits } from 'src/app/model/kits.model';
import { AlertNotificationsService } from 'src/app/services/alert-notifications.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-training-kit',
  templateUrl: './training-kit.component.html',
  styleUrls: ['./training-kit.component.scss']
})
export class TrainingKitComponent implements OnInit {
  allkits: Kits[]=[];

  constructor(private userService:UserService,private alertNotificationService:AlertNotificationsService) { }

  kits:Kits={
    _id:'',
    url:'',
    approved:false
  }
  totalSize:number
  currentPage:number=1
  pageSize:number=16
  
  iskitsavailable=false
  ngOnInit() {
    this.refresh()
  }

  refresh(){
    this.userService.getkits().toPromise()
    .then(res=>{ 
      this.allkits = res; 
      this.iskitsavailable = this.allkits.length>0;
      this.totalSize = this.allkits.length
    })
    .catch(err=>this.alertNotificationService.alertError(err))
  }

  submit(f:NgForm){
    this.kits.url=this.kits.url.trim()
    this.kits.approved=false;
    this.userService.postkits(this.kits).toPromise()
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
        this.userService.deletekits(id).toPromise()
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
        this.userService.approveKits(id).toPromise()
      .then(
        res=>{
          this.alertNotificationService.toastAlertSuccess('Approved Successfully');
          this.refresh()
        }).catch(err=>this.alertNotificationService.alertError(err))
      }
    })
  }

}
