import { Component, OnInit } from '@angular/core';
import { Subscription } from 'src/app/model/subscription.model';
import { Subscriptionpackage } from 'src/app/model/subscriptionpackage.model';
import { AlertNotificationsService } from 'src/app/services/alert-notifications.service';
import { SubscriptionService } from 'src/app/services/subscription.service';

@Component({
  selector: 'app-subscriptions',
  templateUrl: './subscriptions.component.html',
  styleUrls: ['./subscriptions.component.scss']
})
export class SubscriptionsComponent implements OnInit {

  feature: Subscriptionpackage;
  allfeature: Array<Subscriptionpackage>=[];
  newpackage: Subscription={
    _id: '',
    name: '',
    package:[],
    approve:false
  }
  allPackage: Subscription[];
  isedit: boolean;

  constructor(
    private alertNotificationService:AlertNotificationsService,
     private subscriptionService: SubscriptionService) { }
 
 
  ngOnInit() {
    this.refresh();
    
  }

  addForm(){
    this.feature= new Subscriptionpackage;

    this.allfeature.push(this.feature);
  }
  removeForm(index){
    this.allfeature.splice(index,1);
  }
  refresh(){
    this.newpackage.name=" ";
    this.allfeature=[]
    this.addForm()
    this.subscriptionService.getallPackage().toPromise()
    .then(res=>this.allPackage = res as Subscription[])
    .catch(err=>this.alertNotificationService.alertError(err))
  }

  submitForm(){
    this.newpackage.package=this.allfeature;
    this.newpackage.approve=false;
    if(this.isedit){
      this.alertNotificationService.alertChanges()
      .then(result=>{
        if(result.isConfirmed){
          this.subscriptionService.updatePackagebyId(this.newpackage,this.newpackage._id).toPromise()
          .then(res=>{
            this.isedit=false;
            this.alertNotificationService.toastAlertSuccess('Updated Successfully')
            this.refresh();
          }).catch(err=>this.alertNotificationService.alertError(err))
        }
      })
    }
    else{
      this.subscriptionService.postPackage(this.newpackage).toPromise()
      .then(res=>{
        this.alertNotificationService.toastAlertSuccess('Added Successfully')
        this.refresh();
      }).catch(err=>this.alertNotificationService.alertError(err))
    }
  }

  onEdit(p:Subscription){
    document.documentElement.scrollTop=0;
    this.newpackage=p
    this.allfeature=p.package as Subscriptionpackage[];
    this.isedit=true;
  }

  onDelete(id){
    this.alertNotificationService.alertDelete()
    .then(result=>{
      if(result.isConfirmed){
        this.subscriptionService.deletePackage(id).toPromise()
        .then(res=>{
          this.alertNotificationService.toastAlertSuccess('Deleted Successfully')
          this.refresh();
        }).catch(err=>this.alertNotificationService.alertError(err))
      }
    })
  }
  onApprove(p:Subscription){
    this.alertNotificationService.alertApprove()
    .then(result=>{
      if(result.isConfirmed){
        p.approve=true;
        this.subscriptionService.updatePackagebyId(p,p._id).toPromise()
        .then(res=>{
          this.alertNotificationService.toastAlertSuccess('Approved Successfully')
          this.refresh();
        }).catch(err=>this.alertNotificationService.alertError(err))
      }
    })
  }
}
