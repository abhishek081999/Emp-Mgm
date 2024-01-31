import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SupportSlaService {
  private apiUrl = 'http://localhost:3000/support-sla'

  constructor(private http: HttpClient) { }

  createSlaPolicy(slaData: any) {
    return this.http.post(this.apiUrl, slaData);
  }
  getSlaPolicies() {
    return this.http.get(this.apiUrl);
  }

  getSlaPolicyById(id:string) {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get(url);
  }

  updateSlaPolicy(slaId: string, updatedSlaData: any){
    const url = `${this.apiUrl}/${slaId}`;
    return this.http.patch(url, updatedSlaData);
  }

deleteSlaPolicy(groupId: string){
  const url = `${this.apiUrl}/${groupId}`;
  return this.http.delete(url);
}

}
