import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private http: HttpClient) { }

  postNotification(notification) {
    return this.http.post('/api/v2/notification', notification);
  }


  getAllNotification() {
    return this.http.get<Notification[]>('/api/v2/notification');
  }

  deleteNotification(id) {
    return this.http.delete('/api/v2/notification/' + id);
  }

  approveNotification(id) {
    return this.http.patch('/api/v2/notification', {
      _id: id
    });
  }

}
