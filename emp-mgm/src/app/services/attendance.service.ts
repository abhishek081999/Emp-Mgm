import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Attendence, Policy } from '../model/employee.model';

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {
  AvailableDate


  constructor(private http: HttpClient) {

  }

  postAttendance(data) {
    return this.http.post('/api/v2/attendance', data);
  }

  editAttendance(data) {
    return this.http.patch('/api/v2/attendance', data);
  }

  getAllAttendance(startdate: string, enddate: string, department: string, manager: string, status: string, employee: string[]) {
    let params = new HttpParams();
    if (startdate) {
      params = params.append('startdate', startdate);
    }
    if (enddate) {
      params = params.append('enddate', enddate);
    }
    if (department) {
      params = params.append('department', department);
    }
    if (manager) {
      params = params.append('manager', manager);
    }
    if (status) {
      params = params.append('status', status);
    }
    if (employee && employee.length > 0) {
      employee.forEach(e => params = params.append('employee[]', e))
    }
    return this.http.get<Attendence[]>('/api/v2/attendance', { params: params });
  }

  approveAttendance(data) {
    return this.http.patch('/api/v2/attendance/approve', data);
  }
  deleteAttendance(data) {
    return this.http.delete('/api/v2/attendance/' + (data));
  }
  checkEmployeePresent(id, date?) {
    let params = new HttpParams();
    if (date) {
      params = params.append('date', date);
    }
    return this.http.get('/api/v2/attendance/employee/' + id, { params: params });
  }
  postAttendancesettings(data) {
    return this.http.post('/api/v2/attendance/settings', data);
  }
  getAttendancesettingslist() {
    return this.http.get<any>('/api/v2/attendance/settings'); // --> Get Attendance Settings List
  }

  getPendingApprovalCount() {
    return this.http.get<any>('/api/v2/attendance/attendance-dashboard');
  }
  getManagerwisePendingReport(department: string, manager: string,) {
    let params = new HttpParams();

    if (department) {
      params = params.append('department', department);
    }
    if (manager) {
      params = params.append('manager', manager);
    }
    return this.http.get<any>('/api/v2/attendance/manager-pending-count', { params: params });
  }
  postRegularize(data) {
    return this.http.post('/api/v2/attendance/regularize', data); // Post API
  }

  getAllRegularize(startdate, enddate, department: string, manager: string, status: string, employee: string[]) {
    let params = new HttpParams();
    if (startdate) {
      params = params.append('startdate', startdate); // Get API
    }
    if (enddate) {
      params = params.append('enddate', enddate);
    }
    if (department) {
      params = params.append('department', department);
    }
    if (manager) {
      params = params.append('manager', manager);
    }
    if (status) {
      params = params.append('status', status);
    }
    if (employee && employee.length > 0) {
      employee.forEach(e => params = params.append('employee[]', e))
    }
    return this.http.get<Attendence[]>('/api/v2/attendance/regularize', { params: params });
  }

  getEmployeeRegularize(employee, startdate, enddate) {
    let params = new HttpParams();
    if (startdate) {
      params = params.append('startdate', startdate); // Get API
    }
    if (enddate) {
      params = params.append('enddate', enddate);
    }
    return this.http.get<Attendence[]>('/api/v2/attendance/regularize/' + employee, { params: params });
  }

  approveRegularize(data) {
    return this.http.patch('/api/v2/attendance/regularize', data);  //approve or reject
  }

  deleteRegularizerequest(data) {

    return this.http.post('/api/v2/attendance/regularize/delete', data);  //  Delete API 
  }

  // ********************************** => Attendance Report <= ******************************** //

  getAttendanceReport(startdate: string, enddate: string, department: string, employee: string[], manager: string) {
    let params = new HttpParams();
    if (startdate) {
      params = params.append('startdate', startdate); // Get API
    }
    if (enddate) {
      params = params.append('enddate', enddate);
    }
    if (department) {
      params = params.append('department', department);
    }
    if (employee && employee.length > 0) {
      employee.forEach(e => params = params.append('employee[]', e))
    }
    if (manager) {
      params = params.append('manager', manager);
    }

    return this.http.get<any>('/api/v2/attendance/report', { params: params });
  }

  // ********************************** => Leave Request <= ******************************** //

  getLeaverequest(startdate: string, enddate: string, department: string, manager: string, employee: string[], managerStatus: string, hrStatus: string) {
    let params = new HttpParams();
    if (startdate) {
      params = params.append('startdate', startdate); // Get API
    }
    if (enddate) {
      params = params.append('enddate', enddate);
    }
    if (department) {
      params = params.append('department', department);
    }
    if (manager) {
      params = params.append('manager', manager);
    }
    if (employee && employee.length > 0) {
      employee.forEach(e => params = params.append('employee[]', e))
    }
    if (managerStatus) {
      params = params.append('managerStatus', managerStatus);
    }
    if (hrStatus) {
      params = params.append('hrStatus', hrStatus);
    }
    return this.http.get<any>('/api/v2/leave/request', { params: params });
  }


  approveLeaverequest(data) {
    return this.http.patch('/api/v2/leave/request/approve', data);   // Approve Leave Request 
  }

  applyForLeave(data) {
    return this.http.post('/api/v2/leave/request', data);   // Apply Leave Request 
  }

  deleteLeaverequest(data) {
    return this.http.post('/api/v2/leave/request/delete', data);  //  Delete API 
  }

  getleavebalance(employee: string[], policy: string, department: string, manager: string) { // Get Leave Balanace API
    let params = new HttpParams();

    if (department) {
      params = params.append('department', department);
    }
    if (policy) {
      params = params.append('policy', policy);
    }
    if (employee && employee.length > 0) {
      employee.forEach(e => params = params.append('employee[]', e))
    }
    if (manager) {
      params = params.append('manager', manager);
    }

    return this.http.get<any>('/api/v2/leave/balance', { params: params });
  }

  updateleavebalance(data) {
    return this.http.post('/api/v2/leave/balance', data); // updated the leave balance change balance
  }





  ///////////////!!POLICY!!//////////////////////////
  newPolicy(data) {
    return this.http.post('/api/v2/leave/policy', data);   // Apply Leave Request 
  }

  getPolicylist() {
    return this.http.get<Policy[]>('/api/v2/leave/policy'); // Get policy List
  }

  getMyPolicylist(id) {
    return this.http.get<Policy[]>('/api/v2/leave/policy/employee/' + id); // Get My policy List
  }

  Approvepolicy(data) {
    return this.http.patch('/api/v2/leave/policy', data);   //  Approve policy 
  }

  updatePolicybyId(p: Policy, id) {
    return this.http.patch<any>('/api/v2/leave/policy/' + id, p); // Updated Policy By id
  }

  getPolicyById(id) {
    return this.http.get<Policy>('/api/v2/leave/policy/' + id);   // Get Policy By id
  }


  // --------> Shift Roster APIs <-----------

  shiftTimingsEmployees(Shiftroster) {              // -------> Post API for Shift Roster
    return this.http.post('/api/v2/shiftroster', Shiftroster);
  }

  getAllShifttimings(startdate, enddate, department: string, manager: string, employee: string, status, workinglocation) {
    let params = new HttpParams();
    if (startdate) {
      params = params.append('startdate', startdate); // ----------> Get API for Shift Roster
    }
    if (enddate) {
      params = params.append('enddate', enddate);
    }
    if (department) {
      params = params.append('department', department);
    }
    if (manager) {
      params = params.append('manager', manager);
    }
    if (employee) {
      params = params.append('employee', employee);
    }
    if (status) {
      params = params.append('status', status);
    }
    if (workinglocation) {
      params = params.append('workinglocation', workinglocation);
    }
    return this.http.get<any>('/api/v2/shiftroster', { params: params });
  }

  ApproveShiftRoster(data) {
    return this.http.patch('/api/v2/shiftroster/approve', data);  // ------> Approvel API For Shift Roster
  }

  deleteShiftRoster(data) {
    return this.http.post('/api/v2/shiftroster/delete', data);  // ------> Delete API For Shift Roster 
  }

  getTodaysRoaster() {
    // let params = new HttpParams();
    // if (department) {
    //   params = params.append('department', department);
    // }
    // if (team) {
    //   params = params.append('team', team);
    // }
    return this.http.get<any>('/api/v2/shiftroster/today');
  }


}


