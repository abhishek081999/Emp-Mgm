import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppVersionSettings } from '../model/appsettings.model';
import { Devices, LoginHistory } from '../model/devices.model';

@Injectable({
  providedIn: 'root'
})
export class MobileAppService {

  constructor(private http: HttpClient) { }

  getAllDevices(){
    return this.http.get<Devices[]>('/api/v2/devices');
  }
  getAllLoginHistory(){
    return this.http.get<LoginHistory[]>('/api/v2/devices/login-history');
  }
  getDevicesSettings(){
    return this.http.get<AppVersionSettings>('/api/v2/device/settings');
  }
  postDevicesSettings(data){
    return this.http.post<AppVersionSettings>('/api/v2/device/settings',data);
  }
  getAppRedirectionList(){
    return this.http.get('/api/v2/device/mobile-redirections');
  }
}
