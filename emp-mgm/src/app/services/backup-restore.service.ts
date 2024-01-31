import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BackupRestoreService {


  constructor(private http: HttpClient) { }

  backup() {
    return this.http.get<Blob>('/api/v2/backupDB',{observe: 'response',responseType: 'blob' as 'json'});
  }
  restore(payload: { filename: string; }) {
    return this.http.post('/api/v2/restoreDB',payload);
  }
}
