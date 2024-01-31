import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Feedback } from '../model/feedback.model';
import { Regstucount } from '../model/regstucount.model';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {

  constructor(private http: HttpClient) { }

  postFeedback(feedback: Feedback){
    return this.http.post<Feedback>('/api/v2/newfeedback',feedback);
  }

  getAllQuestion(){
    return this.http.get<any>('/api/v2/getfeedbackquestion');
  }

  getAllfeedback(){
    return this.http.get<Feedback[]>('/api/v2/feedbacks');
  }
  getAvgRatingOfTeacher(){
    return this.http.get<Regstucount[]>('/api/v2/getavgratingofteacher');
  }

  updateFeedback(feedback: Feedback){
    return this.http.patch<any>('/api/v2/updatefeedback/'+feedback._id,feedback);
  }
}
