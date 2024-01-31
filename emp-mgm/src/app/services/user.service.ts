import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../model/user.model';
import { Kits } from '../model/kits.model';
import { Books } from '../model/books.model';
import { Tutorials } from '../model/tutorials.model';
import { environment } from 'src/environments/environment';
import { Referrals } from '../model/referral.model';
import { Devices, LoginHistory } from '../model/devices.model';


@Injectable({
  providedIn: 'root'
})
export class UserService {


  selectedUser: User = {
    _id: '',
    invid: '',
    fullName: '',
    email: '',
    telephone: '',
    address: '',
    city: '',
    pincode: '',
    role: '',
    password: '',
    profileid: ''
  };

  loggedUser: User = {
    _id: '',
    invid: '',
    fullName: '',
    email: '',
    telephone: '',
    address: '',
    city: '',
    pincode: '',
    role: '',
    password: '',
    profileid: ''
  };

  noAuthHeader = { headers: new HttpHeaders({ 'NoAuth': 'True' }) };
  user: any;
  redirectedurl: string;

  constructor(private http: HttpClient) { }

  emailverify = {
    email: '',
    otp: ''
  }

  //HttpMethods

  postUser(user: User) {
    return this.http.post<User>('/api/v2/register', user, this.noAuthHeader);
  }
  postService(s) {
    return this.http.post<any>('/api/v2/student-service-map', s);
  }

  login(authCredentials) {
    return this.http.post<any>('/api/v2/authenticate', authCredentials, this.noAuthHeader);
  }

  getUserProfile() {
    return this.http.get<User>('/api/v2/userProfile');
  }

  getStudents() {
    return this.http.get<User[]>('/api/v2/studentsprofile');
  }

  getuseremails(ids) {
    return this.http.post<string[]>('/api/v2/getemailfromids', ids);
  }

  getUserbyEmail(email) {
    return this.http.get<User>('/api/v2/getuserbyemail/' + email);
  }

  updateUserProfile(id, user: User) {
    return this.http.patch<User>('/api/v2/user/' + id, user);
  }

  getUser(id) {
    return this.http.get<User>('/api/v2/user/' + id);
  }
  getCountryCode() {
    return this.http.get('/api/v2/getCountryCodes')
  }
  getReferralforuser(user_id) {
    return this.http.get<Referrals[]>('/api/v2/referrals/' + user_id);
  }
  getDeviceDetails(user_id) {
    return this.http.get<Devices[]>('/api/v2/devices/' + user_id);
  }
  getloginHistory(user_id) {
    return this.http.get<LoginHistory>('/api/v2/devices/login-history/' + user_id);
  }

  getusermobile(allids: String[]) {
    return this.http.post('/api/v2/getusermobile', allids);
  }

  forgetPassword(email) {
    return this.http.post<any>('/api/v2/forgetpassword', email);
  }

  resetPassword(password, id, token) {
    return this.http.post<any>('/api/v2/reset?token=' + token + '&id=' + id, password);
  }

  emailverification(emailverify) {
    return this.http.post<any>('/api/v2/emailverification', emailverify);
  }

  changePassword(payload) {
    return this.http.post<any>('/api/v2/changepassword', payload);
  }

  postTutorial(tutorial) {
    return this.http.post<Tutorials>('/api/v2/newtutorial', tutorial);
  }

  getTutorial() {
    return this.http.get<Tutorials[]>('/api/v2/gettutorial');
  }

  updateTutorial(tutorial: Tutorials) {
    return this.http.patch<Tutorials>('/api/v2/updatetutorial/' + tutorial._id, tutorial);
  }
  logutAllUser(body) {
    return this.http.patch<any>('/api/v2/devices/log-out', body)
  }
  logoutUser(body) {
    return this.http.patch<any>('/api/v2/devices/log-out/', body)
  }
  deleteTutorial(id) {
    return this.http.delete<any>('/api/v2/deletetutorial/' + id);
  }

  postBooks(book: Books) {
    return this.http.post<Books>('/api/v2/newbooks', book);
  }

  getBooks() {
    return this.http.get<Books[]>('/api/v2/getbooks');
  }

  deleteBooks(id) {
    return this.http.delete<any>('/api/v2/deletebooks/' + id);
  }
  approveBooks(id: any) {
    return this.http.patch<any>('/api/v2/approvebooks/' + id, id);
  }

  getkits() {
    return this.http.get<Kits[]>('/api/v2/getkits');
  }
  postkits(kits: Kits) {
    return this.http.post<Kits>('/api/v2/newkits', kits);

  }
  deletekits(id: string) {
    return this.http.delete<any>('/api/v2/deletekits/' + id);
  }
  approveKits(id: string) {
    return this.http.patch<any>('/api/v2/approvekits/' + id, id);
  }
  updateProfilePic(data) {
    return this.http.patch('/api/v2/updateImages', data);
  }
  updateUserIsactive(data) {
    return this.http.patch<any>('/api/v2/userActive', data)
  }
  getlogs() {
    return this.http.get('/api/v2/getlogs');
  }

  deletelogs(id) {
    return this.http.delete('/api/v2/deletelogs/' + id);
  }

  deleteMultiplelogs(ids: string[]) {
    return this.http.post('/api/v2/deletemultiplelogs', ids);
  }

  resetpassword(data) {
    return this.http.post('/api/v2/reset-password-i', data);
  }


  isAdmin() {
    this.getUserProfile().subscribe(res => {
      this.user = res['user'];
    });
    if (this.user && this.user.role == "admin") {
      return true;
    };
  }

  addallcounter(counter) {
    return this.http.post('/api/v2/addallcounter', counter);
  }


  //Helper Methods

  setToken(token: string) {
    localStorage.setItem('token', token);
    this.createCookie(environment.webisteRedirectCookie + '-token', token, 1)
  }

  getToken() {
    // return localStorage.getItem('token');
    return this.readCookie(environment.webisteRedirectCookie + '-token');
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

  createCookie(name, value, days) {
    if (days) {
      var date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      var expires = "; expires=" + date.toUTCString();
    }
    else var expires = "";
    document.cookie = name + "=" + value + expires + "; domain=.invesmate.com; path=/";
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
    this.createCookie(name, "", -1);
  }




}
