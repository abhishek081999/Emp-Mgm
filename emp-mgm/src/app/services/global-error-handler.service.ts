import { HttpClient } from '@angular/common/http';
import { ErrorHandler, Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { AlertNotificationsService } from './alert-notifications.service';

@Injectable({
  providedIn: 'root'
})
export class GlobalErrorHandlerService implements ErrorHandler {
 
  constructor(
    private alertNotificationService: AlertNotificationsService,
    private router:Router,
    private http: HttpClient,
    private zone: NgZone) { 
  }

  handleError(error) {
    console.error('An error occurred:', error.message);
    console.error(error);
    var err={
      message:error.message,
      stack:error.stack
    }
    const chunkFailedMessage = /Loading chunk [\d]+ failed/;
    if (chunkFailedMessage.test(err.message)) {
      if (confirm("New version available. Load New Version?")) {
        window.location.reload();
      }
    }
    if(!error.message.includes('NG0100')){
      this.http.post('/api/v2/newerror',err,{responseType: 'text'}).toPromise()
      .then().catch();
      this.zone.run(() =>{
        if(!error.message.includes('NG0100')){
          this.alertNotificationService.alertError(error.message);
          this.router.navigate(['/error/400']);
        }
      })
    }
 }

}
