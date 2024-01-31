import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {

  constructor(private http: HttpClient) { }

  // ----------> IVR Reports APIs
  
  getivrreport(startdate: string, enddate: string, queryFilter: string, calltypeFilter: string, team: string, employee: string, department:string) {
    let params = new HttpParams();
    if (startdate) {
      params = params.append('startdate', startdate); // Get API For IVR Report-1
    }
    if (enddate) {
      params = params.append('enddate', enddate);
    }
    if (queryFilter) {
      params = params.append('queryFilter', queryFilter);
    }
    if (calltypeFilter) {
      params = params.append('calltypeFilter', calltypeFilter);
    }
    if (team) {
      params = params.append('team', team);
    }
    if (employee) {
      params = params.append('employee', employee);
    }
    if (department) {
      params = params.append('department', department);
    }
    return this.http.get<any>('/api/v2/report/ivr/call-logs', { params: params });
  }

  getivrreportA(start: string, end: string, team: string, employee: string, department: string) {
    let params = new HttpParams();
    if (start) {
      params = params.append('start', start); // Get API For IVR Report-1
    }
    if (end) {
      params = params.append('end', end);
    }
    if (team) {
      params = params.append('team', team);
    }
    if (employee) {
      params = params.append('employee', employee);
    }
    if (department) {
      params = params.append('department', department);
    }
    return this.http.get<any>('/api/v2/report/ivr/report1', { params: params });
  }


  getivrreportB(month, year, team, employee,  department) {
    let params = new HttpParams();                            // Get API For Conversion List
    if (month) {
      params = params.append('month', month);
    }
    if (year) {
      params = params.append('year', year);
    }
    if (team) {
      params = params.append('team', team);
    }
    if (employee) {
      params = params.append('employee', employee);
    }
     if (department) {
      params = params.append('department', department);
    }
    return this.http.get('/api/v2/report/ivr/report2', { params: params });  // Get API For Team Member sales report
  }

  getSmsLog(startdate: string, enddate: string,) {
    let params = new HttpParams();
    if (startdate) {
      params = params.append('startdate', startdate); 
    }
    if (enddate) {
      params = params.append('enddate', enddate);
    }
    return this.http.get<any>('/api/v2/smslog', { params: params });
  }
  getEmailLog(startdate: string, enddate: string,) {
    let params = new HttpParams();
    if (startdate) {
      params = params.append('startdate', startdate); 
    }
    if (enddate) {
      params = params.append('enddate', enddate);
    }
    return this.http.get<any>('/api/v2/emaillog', { params: params });
  }
  getWhatsappLog(startdate: string, enddate: string,) {
    let params = new HttpParams();
    if (startdate) {
      params = params.append('startdate', startdate); 
    }
    if (enddate) {
      params = params.append('enddate', enddate);
    }
    return this.http.get<any>('/api/v2/whatsapplog', { params: params });
  }
}
