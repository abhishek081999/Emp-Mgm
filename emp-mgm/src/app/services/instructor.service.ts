import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Instructor } from '../model/instructor.model';

@Injectable({
  providedIn: 'root'
})
export class InstructorService {

  constructor(private http: HttpClient) { }

  ApplyInstructor(ins: Instructor){
    return this.http.post<Instructor>('/api/v2/instructor-apply',ins);
  }

  getInstructor(id){
    return this.http.get<Instructor>('/api/v2/getinstructorbyid/'+id);
  }

  getAllInstructor(){
    return this.http.get<Instructor[]>('/api/v2/getallinstructor');
  }

  updateInstructor(ins:Instructor){
    return this.http.patch<Instructor>('/api/v2/updateinstructor/'+ins._id,ins);
  }

  updateInstructorAc(ins:Instructor){
    return this.http.patch<any>('/api/v2/updateinstructorac/'+ins._id,ins);
  }

  getDeactivatereq(){
    return this.http.get('/api/v2/deactivate');
  }
  updatedeactivatereq(id){
    return this.http.patch<any>('/api/v2/deactivate/'+id,id);
  }
  deletereq(id){
    return this.http.delete<any>('/api/v2/deactivate/'+id);
  }
}
