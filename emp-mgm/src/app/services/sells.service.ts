import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PendingPayments } from '../model/sales.model';
import { SalesProjectionCommit, SalesProjectionDisp } from '../model/salesprojection.model';

@Injectable({
  providedIn: 'root'
})
export class SellsService {
  

  constructor(private http: HttpClient) { }

  pendingpaymentlists(id) {
    let params = new HttpParams();
    params = params.append('q', id);
    return this.http.get<PendingPayments[]>('/api/v2/getpendingpayment', { params: params });
  }

  CommitProjection(data) {
    return this.http.post<SalesProjectionCommit>('/api/v2/commitprojection', data);
  }

  getCommitProjection(month: string, year: string, staff: string[], status: string, team: string) {
    let params = new HttpParams();
    if (month) {
      params = params.append('month', month);
    }
    if (year) {
      params = params.append('year', year);
    }
    if (staff && staff.length > 0) {
      staff.forEach(e => params = params.append('staff[]', e))
    }
    if (status) {
      params = params.append('status', status);
    }
    if (team) {
      params = params.append('team', team);
    }
    return this.http.get<SalesProjectionCommit[]>('/api/v2/commitprojection', { params: params });
  }

  getIndiCommitProjection(month: number, year: string, staff: string) {
    let params = new HttpParams();
    if (month) {
      params = params.append('month', month.toString());
    }
    if (year) {
      params = params.append('year', year);
    }
    if (staff) {
      params = params.append('staff', staff);
    }
    return this.http.get<SalesProjectionDisp[]>('/api/v2/commitprojection/report/individual', { params: params });
  }

  getTeamCommitProjection(month: number, year: string, team: string) {
    let params = new HttpParams();
    if (month) {
      params = params.append('month', month.toString());
    }
    if (year) {
      params = params.append('year', year);
    }
    if (team) {
      params = params.append('team', team);
    }
    return this.http.get<SalesProjectionDisp[]>('/api/v2/commitprojection/report/team', { params: params });
  }

  bulkprojectionapprove(ids) {
    return this.http.post('/api/v2/commitprojection/approve', ids);
  }

  bulkprojectiondelete(ids) {
    return this.http.post('/api/v2/commitprojection/delete', ids);
  }

  insigniaReport1(start, end) {
    let params = new HttpParams();
    if (start) {
      params = params.append('start', start);
    }
    if (end) {
      params = params.append('end', end);
    }
    return this.http.get('/api/v2/sales/report/insignia/report1', { params: params });
  }

  insigniaReport2(year) {
    let params = new HttpParams();
    if (year) {
      params = params.append('year', year);
    }
    return this.http.get('/api/v2/sales/report/insignia/report2', { params: params });
  }


  insigniaReport3(start, end) {
    let params = new HttpParams();
    if (start) {
      params = params.append('start', start);
    }
    if (end) {
      params = params.append('end', end);
    }
    return this.http.get('/api/v2/sales/report/insignia/report3', { params: params });
  }

  insigniaReport4(month, year) {
    let params = new HttpParams();
    if (month) {
      params = params.append('month', month);
    }
    if (year) {
      params = params.append('year', year);
    }
    return this.http.get('/api/v2/sales/report/insignia/report4', { params: params });
  }

  insigniaReport4studentdata(month, year) {
    let params = new HttpParams();
    if (month) {
      params = params.append('month', month);
    }
    if (year) {
      params = params.append('year', year);
    }
    return this.http.get('/api/v2/sales/report/insignia/report4/studentdata', { params: params });
  }

  insigniaReport5(start, end) {
    let params = new HttpParams();
    if (start) {
      params = params.append('start', start);
    }
    if (end) {
      params = params.append('end', end);
    }
    return this.http.get('/api/v2/sales/report/insignia/report5', { params: params });
  }

  insigniaReport6(start, end) {
    let params = new HttpParams();
    if (start) {
      params = params.append('start', start);
    }
    if (end) {
      params = params.append('end', end);
    }
    return this.http.get('/api/v2/sales/report/insignia/report6', { params: params });
  }

  insigniaReport7(month, year) {
    let params = new HttpParams();
    if (month) {
      params = params.append('month', month);
    }
    if (year) {
      params = params.append('year', year);
    }
    return this.http.get('/api/v2/sales/report/insignia/report7', { params: params });
  }

  insigniaReport8(start, end) {
    let params = new HttpParams();
    if (start) {
      params = params.append('start', start);
    }
    if (end) {
      params = params.append('end', end);
    }
    return this.http.get('/api/v2/sales/report/insignia/report8', { params: params });
  }

  insigniaReport9() {
    return this.http.get('/api/v2/sales/report/insignia/report9');
  }

  insigniaReport10(start, end, team, employee) {
    let params = new HttpParams();
    if (start) {
      params = params.append('start', start);
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
    return this.http.get('/api/v2/sales/report/insignia/report10', { params: params });
  }

  bcmbReport1(start, end, team, employee, coursecode) {
    let params = new HttpParams();
    if (start) {
      params = params.append('start', start);
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
    if (coursecode) {
      params = params.append('coursecode', coursecode);
    }
    return this.http.get('/api/v2/sales/report/bcmb/report1', { params: params });
  }

  getConversionList(startdate, enddate, status, mode, student, employee, servicecode){

    let params = new HttpParams();                            // Get API For Conversion List
    if (startdate) {
      params = params.append('startdate', startdate);
    }
    if (enddate) {
      params = params.append('enddate', enddate);
    }
    if (status) {
      params = params.append('status', status);
    }
    if (mode) {
      params = params.append('mode', mode);
    }
    if (student) {
      params = params.append('student', student);
    }
    if (employee) {
      params = params.append('employee', employee);
    }
    if (servicecode) {
      params = params.append('servicecode', servicecode);
    }
    return this.http.get('/api/v2/sales/conversion-list', { params: params })
  }

  getCourseRevenueDetails( startdate, enddate, employee, courseCode){

    let params = new HttpParams();                            // Get API For Conversion List
    if (startdate) {
      params = params.append('startdate', startdate);
    }
    if (enddate) {
      params = params.append('enddate', enddate);
    }
    if (employee) {
      params = params.append('employee', employee);
    }
    if (courseCode) {
      params = params.append('courseCode', courseCode);
    }
    return this.http.get('/api/v2/sales/course-batch-revenue', { params: params })  // Get API For Course Revenue Details
  }
  getsellsReport(employee, month, year){
    let params = new HttpParams();                            // Get API For Conversion List
    if (month) {
      params = params.append('month', month);
    }
    if (year) {
      params = params.append('year', year);
    }
    if (employee) {
      params = params.append('employee', employee);
    }
    return this.http.get('/api/v2/sales/individual-sales', { params: params });   // Get API For Employee Sales report
  }

  getsellsTeamReport(team_id, month, year){
    let params = new HttpParams();                            // Get API For Conversion List
    if (month) {
      params = params.append('month', month);
    }
    if (year) {
      params = params.append('year', year);
    }
    if (team_id) {
      params = params.append('team', team_id);
    }
    return this.http.get('/api/v2/sales/team-sales', { params: params });   // Get API For Team Sales report
  }

  getsellsTeamMemberReport(team_id, month, year) {
    let params = new HttpParams();                            // Get API For Conversion List
    if (month) {
      params = params.append('month', month);
    }
    if (year) {
      params = params.append('year', year);
    }
    if (team_id) {
      params = params.append('team', team_id);
    }
    return this.http.get('/api/v2/sales/team-mem-sales', { params: params });  // Get API For Team Member sales report
  }

  getDashboardsells() {
    return this.http.get('/api/v2/sales/sales-dashboard');   // Get API For Total Earning and Total Due
  }


  appReport1(start: any, end: any) {
    let params = new HttpParams();
    if (start) {
      params = params.append('start', start);
    }
    if (end) {
      params = params.append('end', end);
    }
    return this.http.get('/api/v2/report/app/report1', { params: params });
  }
  
}
