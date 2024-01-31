import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SettingService {

  private apiUrl = 'http://localhost:3000/business-hour'
  constructor(private http: HttpClient) { }
  sendData(formData: any) {
    return this.http.post(this.apiUrl, formData);
  }
  getData() {
    return this.http.get(this.apiUrl);
  }

}
