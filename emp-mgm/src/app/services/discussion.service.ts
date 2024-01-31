import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Discussion } from '../model/discussion.model';

@Injectable({
  providedIn: 'root'
})
export class DiscussionService {
  

  constructor(private http: HttpClient) { }

  noAuthHeader = { headers: new HttpHeaders({ 'NoAuth': 'True' }) };

  replyDiscussion(discussion){
    return this.http.patch<Discussion>('/api/v2/discussion/reply',discussion);
  }

  deleteDiscussionMessage(discussion){
    return this.http.patch<Discussion>('/api/v2/discussion/delete',discussion);
  }

  updateunreadDiscussion(discussion: Discussion,id){
    return this.http.patch<any>('/api/v2/discussion/unread/'+id,discussion);
  }

  deleteDiscussion(id){
    return this.http.delete<any>('/api/v2/discussion/'+id);
  }

  getAllDiscussion(){
    return this.http.get<Discussion[]>('/api/v2/discussion');
  }

  getDiscussionById(id){
    return this.http.get<Discussion>('/api/v2/discussion/'+id);
  }

}
