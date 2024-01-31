import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OnboardingService {

  constructor(private http: HttpClient) {

  }

  postOnboardingSetting(data) {       // ----------> OnBoarding Setting Post API
    return this.http.post('/api/v2/onboarding/setting', data);
  }

  getAllonboardingsetting(department, status){      // ----> OnBoarding Setting Get API
    let params = new HttpParams();
    if (department) {
      params = params.append('department', department);
    }
    if (status) {
      params = params.append('status', status);
    }
    return this.http.get<any>('/api/v2/onboarding/setting', { params: params });
  }


updateOnboardingSetting(id: string, updatedData: any) {  // --------> OnBoarding Setting update API
  return this.http.patch(`/api/v2/onboarding/setting/${id}`, updatedData);
}


updateOffboardingSetting(id: string, updatedData: any) {  // --------> OffBoarding Setting update API
  return this.http.patch(`/api/v2/onboarding/setting/${id}`, updatedData);
}

  deleteOnBoardingSetting(id) {       // --------> OnBoarding Setting Delete API
    return this.http.delete('/api/v2/onboardingsetting/' + id);
  }

  // ----> ON-Boarding APIs

  getAllOnBoardingTask(department, taskOwner, verificationOwner, tasktype, status){    // ----> Task Get API On-Boarding
    let params = new HttpParams();
    if (department) {
      params = params.append('department', department);
    }
    if (taskOwner) {
      params = params.append('taskOwner', taskOwner);
    }
    if (verificationOwner) {
      params = params.append('verificationOwner', verificationOwner);
    }
    if (tasktype) {
      params = params.append('tasktype', tasktype);
    }
    if (status) {
      params = params.append('status', status);
    }
    return this.http.get<any>('/api/v2/onboarding/tasklist', { params: params });
  }

  postOnboardingtask(data) {                // ----------> Add Special Task Post API
    return this.http.post('/api/v2/onboarding/addedspecial', data);  
  }

  updateOnboardingTask(data: any) {
    return this.http.patch('/api/v2/onboarding/taskassignmanager', data);
  }

  // ----> OFF-Boarding APIs

  postOffboardingtask(data) {
    return this.http.post('/api/v2/offboarding/task', data);
  }

  updateOffboardingTask(data: any) {
    return this.http.patch('/api/v2/offboarding/taskassign', data);
  }

  getAllOffBoardingTask(department, taskOwner, verificationOwner, tasktype, status){    // ----> Task Get API OFF-Boarding
    let params = new HttpParams();
    if (department) {
      params = params.append('department', department);
    }
    if (taskOwner) {
      params = params.append('taskOwner', taskOwner);
    }
    if (verificationOwner) {
      params = params.append('verificationOwner', verificationOwner);
    }
    if (tasktype) {
      params = params.append('tasktype', tasktype);
    }
    if (status) {
      params = params.append('status', status);
    }
    return this.http.get<any>('/api/v2/offboarding/tasklist', { params: params });
  }

  postspecialOffboardingtask(data) {                // ----------> Add Special Task Post API Off-Boarding 
    return this.http.post('/api/v2/offboarding/addedspecial', data);  
  }
}
