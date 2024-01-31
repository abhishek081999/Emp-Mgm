import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AlertNotificationsService {
  

  constructor(private router:Router) { }
  
  toastAlertSuccess(title){
    Swal.fire({
      toast:true,
      icon: 'success',
      title: title,
      timer: 5000,
      showConfirmButton:false,
      position: 'bottom'
    })
  }
  toastAlertSuccessAddExtraTime(title){
    Swal.fire({
      toast:true,
      icon: 'success',
      title: title,
      timer: 7000,
      showConfirmButton:false,
      position: 'bottom'
    })
  }
  alertError(text){
    Swal.fire({
      icon: 'error', 
      title: 'Oops..',
      text: text
    })
  }

  alertInfo(text){
    Swal.fire({
      icon: 'info', 
      text: text
    })
  }

  alertChanges(){
    return Swal.fire({
      icon: 'question',
      title: 'Do you want to Save the Changes?',
      showCancelButton: true,
      confirmButtonText: `Save`,
    })
  }

  alertCustomMsg(title){
    return Swal.fire({
      icon: 'question',
      title: title,
      showCancelButton: true,
      confirmButtonText: `Yes`,
    })
  }

  alertApprove(){
    return Swal.fire({
      icon: 'question',
      title: 'Do you want to Approve?',
      showCancelButton: true,
      confirmButtonText: `Approve`,
    })
  }

  alertDelete(){
    return Swal.fire({
      icon: 'question',
      title: 'Do you want to Delete?',
      showCancelButton: true,
      confirmButtonText: `Delete`,
    })
  }

  alertRestore(){
    return Swal.fire({
      icon: 'question',
      title: 'Do you want to Restore the Database?',
      showCancelButton: true,
      confirmButtonText: `Restore`,
    })
  }
  notification: Notification = null
  displayNotification(title, msg) {
    var icon = 'assets/icons/icon-128x128.png'
    if (Notification.permission === "granted") {
      var options: NotificationOptions = {
        body: msg,
        icon: icon,
        dir: "ltr"
      };
      if(this.notification){
        this.notification.close();
      }
      this.notification = new Notification(title, options);
      this.notification.onshow = function () {
        let audio: HTMLAudioElement = new Audio('assets/images/chat_notifiation.wav');
        if(audio){
          audio.play();
        }
      }
      this.notification.onclick = function(){
        window.focus()
      }
      setTimeout(e => {
        if (this.notification) {
          this.notification.close();
        }
        console.log('close')
      }, 7000)
    }
  }

}
