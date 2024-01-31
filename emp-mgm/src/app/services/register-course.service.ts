import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { RegisterCourse } from '../model/registercourse.model';
import { Regstucount } from '../model/regstucount.model';

@Injectable({
  providedIn: 'root'
})
export class RegisterCourseService {


  constructor(private http: HttpClient) { }

  getAllRegisterCourse() {
    return this.http.get<RegisterCourse[]>('/api/v2/getallregistercourse');
  }

  setExpiry(registercourse) {
    return this.http.patch<RegisterCourse>('/api/v2/setexpiry/' + registercourse._id, registercourse);
  }

  bannedRegistraion(data: any) {
    return this.http.patch<any>('/api/v2/bannedregistration', data);
  }

  getstudentscount() {
    return this.http.get<Regstucount[]>('/api/v2/getstudentscount');
  }

  getstudentscountforteacher() {
    return this.http.get<Regstucount[]>('/api/v2/getstudentscountforteacher');
  }
  
  batchchange(data) {
    return this.http.post<any>('/api/v2/reg-batch-change', data);
  }

  getCourseRegistrationList(start_date, end_date, code, status) {    // Get API For Course Registration
    let params = new HttpParams();
    if (start_date) {
      params = params.append('start_date', start_date);
    }
    if (end_date) {
      params = params.append('end_date', end_date);
    }
    if (code) {
      params = params.append('code', code);
    }
    if (status) {
      params = params.append('status', status);
    }
    
    return this.http.get<any>('/api/v2/course-registration', { params: params });
  }

}
