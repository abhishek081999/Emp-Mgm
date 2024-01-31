import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Department, Employee, Team } from '../model/employee.model';
import { environment } from 'src/environments/environment';
import { Roles } from '../model/roles.model';
import { Router } from '@angular/router';

type displayType = ('all' | 'display')
@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  noAuthHeader = { headers: new HttpHeaders({ 'NoAuth': 'True' }) };
  redirectedurl: string;

  constructor(private http: HttpClient, private router: Router) { }

  newEmployee(emp: Employee) {
    return this.http.post('/api/v2/employees/register', emp);
  }

  getAllEmployees(q: displayType, department: string, team: string) {
    let params = new HttpParams();
    if (q) {
      params = params.append('q', q);
    }
    if (department) {
      params = params.append('department', department);
    }
    if (team) {
      params = params.append('team', team);
    }
    return this.http.get<Employee[]>('/api/v2/employees', { params: params });
  }

  getAllDepartment(q: displayType) {
    let params = new HttpParams();
    params = params.append('q', q);
    return this.http.get<Department[]>('/api/v2/departments', { params: params });
  }

  addDepartment(data) {
    return this.http.post('/api/v2/departments', data);
  }

  deleteDepartment(id) {
    return this.http.delete(`/api/v2/departments/${id}`);
  }

  getAllTeams(q: displayType, department: string) {
    let params = new HttpParams();
    if (q) {
      params = params.append('q', q);
    }
    if (department) {
      params = params.append('department', department);
    }
    return this.http.get<Team[]>('/api/v2/teams', { params: params });
  }

  addTeam(data) {
    return this.http.post('/api/v2/teams', data);
  }

  deleteTeam(id) {
    return this.http.delete(`/api/v2/teams/${id}`);
  }

  getAllDesignation(q: displayType) {
    let params = new HttpParams();
    if (q) {
      params = params.append('q', q);
    }
    return this.http.get<Team[]>('/api/v2/designations', { params: params });
  }

  getemployeedetails(invid: string) {
    return this.http.get<any>('/api/v2/employee/' + invid);
  }
  addDesignation(data) {
    return this.http.post('/api/v2/designations', data);
  }

  deleteDesignation(id) {
    return this.http.delete(`/api/v2/designations/${id}`);
  }

  designationOrderUpdate(data) {
    return this.http.patch('/api/v2/designations/order', data);
  }

  getemployeedepartments(id){
    return this.http.get<any>('/api/v2/departments/' + id);
  }

  getEmployeeProfile(id, q: displayType) {
    let params = new HttpParams();
    params = params.append('q', q);
    return this.http.get<Employee>(`/api/v2/employees/${id}`, { params: params });
  }

  getEmployeeDashboard() {
    return this.http.get('/api/v2/employees/dashboard');
  }

  getPersonalDetails(id) {
    return this.http.get<Employee>(`/api/v2/employees/personal-details/${id}`);
  }

  updateProfilePic(data) {
    return this.http.patch('/api/v2/employees/profile-image', data);
  }

  updateUserProfile(id: string, employee: Employee) {
    return this.http.patch(`/api/v2/employees/${id}`, employee);  //
  }

  resetPassword(password, id, token) {
    return this.http.post('/api/v2/employees/reset-password?token=', + token + '&id=' + id, password);
  }

  forgetPassword(email) {
    return this.http.post<any>('/api/v2/employees/forget-password', email);
  }

  changePassword(payload) {
    return this.http.post<any>('/api/v2/employees/change-password', payload);
  }

  submitAllocation(data) {
    return this.http.patch('/api/v2/employees/allocation', data)
  }
  submitPersonalDetails(id, body) {
    return this.http.post(`/api/v2/employees/personal-details/${id}`, body)

  }
  addPersonalDocuments(data) {
    return this.http.post('/api/v2/employees/personal-documents', data);
  }

  getOrgChart() {
    return this.http.get('/api/v2/employees/org-chart');
  }

  getrole(role: string) {
    return this.http.get<Roles>('/api/v2/getrole/' + role);
  }

  getallrole() {
    return this.http.get<Roles[]>('/api/v2/getallroles');
  }

  addrole(role: Roles) {
    return this.http.post<Roles>('/api/v2/addrole', role);
  }

  editrole(role: Roles) {
    return this.http.patch<Roles>('/api/v2/editrole', role);
  }

  login(authCredentials) {
    return this.http.post<any>('/api/v2/employees/login', authCredentials, this.noAuthHeader);
  }

  logout() {
    this.deleteToken()

    if (!this.isLoggedIn()) {
      this.router.navigate(['/auth/login']);
    }
  }

  setToken(token: string) {
    // localStorage.setItem('token', token);
    var date = new Date()
    date.setDate(date.getDate() + 3);
    this.createCookie(environment.webisteRedirectCookie + '-token', token, date)
  }

  getToken() {
    // return localStorage.getItem('token');
    return this.readCookie(environment.webisteRedirectCookie + '-token')
  }

  deleteToken() {
    // localStorage.removeItem('token');
    this.eraseCookie(environment.webisteRedirectCookie + '-token')
  }

  getUserPayload() {
    var token = this.getToken();
    if (token) {
      var userpayload = atob(token.split('.')[1]);
      var userPayload = JSON.parse(userpayload);
      userPayload.name = decodeURIComponent(userPayload.name);
      //console.log(JSON.parse(userPayload));
      return userPayload;
    }
    else {
      token = this.readCookie(environment.webisteRedirectCookie + '-token');
      if (token) {
        var userpayload = atob(token.split('.')[1]);
        var userPayload = JSON.parse(userpayload);
        userPayload.name = decodeURIComponent(userPayload.name);
        //console.log(JSON.parse(userPayload));
        return userPayload;
      }
    }
    return null;
  }

  isLoggedIn() {
    var userPayload = this.getUserPayload();
    if (userPayload)
      return userPayload.exp > Date.now() / 1000;
    else
      return false;
  }

  createCookie(name, value, date) {
    if (date) {
      var expires = "; expires=" + date.toUTCString();
    }
    else var expires = "";
    // document.cookie = name + "=" + value + expires + "; domain=" + environment.cookieDomain + "; path=/";
    document.cookie = name + "=" + value + expires + "; localhost; path=/";
  }

  readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  }

  eraseCookie(name) {
    this.createCookie(name, "", new Date());
  }
}
