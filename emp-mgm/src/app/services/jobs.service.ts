import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Jobapplication, Jobs } from '../model/jobs.model';

@Injectable({
  providedIn: 'root'
})
export class JobsService {

  constructor(private http: HttpClient) { }

  postjob(job: FormData) {
    return this.http.post<Jobs>('/api/v2/jobs', job);
  }

  activateJob(data) {
    return this.http.patch('/api/v2/jobs/activate', data);
  }

  sheildJob(data) {
    return this.http.patch('/api/v2/jobs/sheild', data);
  }

  deletejob(id) {
    return this.http.delete('/api/v2/jobs/' + id);
  }

  getjobbyid(id) {
    return this.http.get<Jobs>('/api/v2/jobs/' + id);
  }

  getalljob() {
    return this.http.get<Jobs[]>('/api/v2/jobs');
  }

  getallapplication() {
    return this.http.get<Jobapplication[]>('/api/v2/jobs/applications');
  }



}
