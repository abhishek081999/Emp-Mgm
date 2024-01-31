import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Quiz } from '../model/quiz.model';

@Injectable({
  providedIn: 'root'
})
export class QuizService {

  constructor(private http: HttpClient) { }

  noAuthHeader = { headers: new HttpHeaders({ 'NoAuth': 'True' }) };

  postQuiz(quiz: Quiz){
    return this.http.post<Quiz>('/api/v2/newquiz',quiz);
  }

  deleteQuiz(id){
    return this.http.delete<any>('/api/v2/deletequiz/'+id);
  }

  updateQuiz(id,quiz:Quiz){
    return this.http.patch<Quiz>('/api/v2/updatequiz/'+id,quiz);
  }

  getQuizById(id){
    return this.http.get<Quiz>('/api/v2/getquizbyid/'+id);
  }

  getallQuiz(){
    return this.http.get<Quiz[]>('/api/v2/getallquiz');
  }
}
