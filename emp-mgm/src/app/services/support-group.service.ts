import { Injectable } from '@angular/core';
import { HttpClient,HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

type displayType = 'all' 
@Injectable({
  providedIn: 'root'
})
export class SupportGroupService {
  private apiUrl = 'http://localhost:3000/create-group'
  constructor(private http: HttpClient) { }

  postFormData(formData: any): Observable<any> {
    return this.http.post(this.apiUrl, formData);
  }

  getFormData() {
    return this.http.get(this.apiUrl);
  }
 
  updateData(data: any) {
    return this.http.patch(`${this.apiUrl}/${data._id}`, data);
  }

  deleteGroup(groupId: string) {
    return this.http.delete(`http://localhost:3000/create-group/${groupId}`);
  }
  

}
