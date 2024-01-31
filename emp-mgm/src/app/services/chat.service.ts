import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
// import { io } from "socket.io-client";
import { environment } from 'src/environments/environment';
import { Chat } from '../model/chat.model';
import { Conversation, SupportCategory } from '../model/conversation.model';
import { UserService } from './user.service';
@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private socket
  constructor(private http: HttpClient, private userService: UserService) {
    var payload = userService.getUserPayload();
    /*this.socket = io(environment.socketLink);
    this.socket.on('connect', () => {
      this.socket.emit('active_agent', { agent_id: payload._id })
      console.log("Socket Connected")
    })
    this.socket.on("reconnect", (attempt) => {
      //this.socket.emit('active_agent', { agent_id: payload._id })
      console.log("Successful Reconnect Attempt: " + attempt)
    });
    this.socket.on("reconnect_attempt", (attempt) => {
      console.log("Reconnect Attempt: " + attempt)
    });
    this.socket.on("reconnect_error", (error) => {
      console.error("Reconnect Error: ", error)
    })
    this.socket.on("reconnect_failed", () => {
      console.error("Reconnect Failed")
    });
    this.socket.on("disconnect", (reason) => {
      console.log("Socket Disconnected Reason: " + reason)
      if (reason === "io server disconnect") {
        // the disconnection was initiated by the server, you need to reconnect manually
        this.socket.connect();
      }
      // else the socket will automatically try to reconnect
    });
    this.socket.on("connect_error", (error) => {
      console.error("Connect Error: ", error)
    });*/
  }

  listen(event_name) {
    return new Observable(subs => {
      // this.socket.on(event_name, (data) => {
      //   subs.next(data);
      // })
      // this.socket.on(event_name, (data) => {
      //   subs.next(data);
      // })
    })
  }

  emit(event_name, data) {
    // this.socket.emit(event_name, data);
  }

  getConversations() {
    return this.http.get<Conversation[]>('/api/v2/support-conversations');
  }
  getChatFeedback() {
    return this.http.get('/api/v2/support/feedback');

  }
  getChatHistory(id) {
    return this.http.get<Chat[]>('/api/v2/chat-history/' + id);
  }

  uploadChatImage(file: FormData) {
    return this.http.post('/api/v2/upload-chat-file', file, {
      reportProgress: true,
      observe: 'events'
    });
  }

  newCategory(data: SupportCategory) {
    return this.http.post('/api/v2/support/category', data);
  }

  saveSettings(data) {
    return this.http.post('/api/v2/support/settings', data);
  }

  GetSettings() {
    return this.http.get('/api/v2/support/settings');
  }

  updateCategory(data: SupportCategory) {
    return this.http.patch('/api/v2/support/category', data);
  }
}
