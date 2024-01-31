import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Coursedatabase } from '../model/coursedatabase.model';

@Injectable({
  providedIn: 'root'
})
export class CoursedatabaseService {

  constructor(private http: HttpClient) { }

  postData(cd:Coursedatabase){
    return this.http.post('/api/v2/newcoursedatabase',cd);
  }

  updateData(cd:Coursedatabase){
    return this.http.patch('/api/v2/updatecoursedatabases/'+cd._id,cd);
  }

  getData(){
    return this.http.get('/api/v2/getcoursedatabases');
  }

  deleteData(id){
    return this.http.delete('/api/v2/deletecoursedatabases/'+id);
  }
}
