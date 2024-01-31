import { AfterViewChecked, AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { PerfectScrollbarConfigInterface, PerfectScrollbarDirective } from 'ngx-perfect-scrollbar';
import { Chat } from 'src/app/model/chat.model';
import { Conversation } from 'src/app/model/conversation.model';
import { AlertNotificationsService } from 'src/app/services/alert-notifications.service';
import { ChatService } from 'src/app/services/chat.service';
import { UserService } from 'src/app/services/user.service';
import { ImageUploaderComponent } from '../../others/image-uploader/image-uploader.component';
import { DomSanitizer } from '@angular/platform-browser';
import { HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-chat-window',
  templateUrl: './chat-window.component.html',
  styleUrls: ['./chat-window.component.scss']
})
export class ChatWindowComponent implements OnInit, AfterViewInit, AfterViewChecked {

  allconversations: Conversation[] = []
  queuedconversations: Conversation[] = []
  historyconversations: Conversation[] = []
  activeconversations: Conversation[] = []
  activeconvids = new Set();
  queuedconvids = new Set()
  defaultNavActiveId = 1;
  public config: PerfectScrollbarConfigInterface = {};
  @ViewChild(PerfectScrollbarDirective, { static: false }) directiveRef?: PerfectScrollbarDirective;
  @ViewChild("messageContainer") mContainer: ElementRef
  payload
  disableScrollDown = false
  typingList = new Set()
  unreadconvids = new Set()
  constructor(
    private chatService: ChatService,
    private userService: UserService,
    private alertNotificationService: AlertNotificationsService,
    private modalService: NgbModal,
    private santizer: DomSanitizer
  ) {
    this.notifyMe();
    this.chatService.listen('active_chats')
      .subscribe(res => {
        var data = res as Conversation[]
        console.log(data)
        data.forEach(e => {
          if (!this.activeconvids.has(e._id)) {
            this.activeconversations.push(e)
            this.activeconvids.add(e._id)
          }
          if (e.agent_unread_count != 0) {
            this.unreadconvids.add(e._id)
          }
        })
        console.log(this.activeconvids)
      })

    this.chatService.listen('queued_chats')
      .subscribe(res => {
        var data = res as Conversation[]
        console.log(data)
        data.forEach(e => {
          if (!this.queuedconvids.has(e._id)) {
            this.queuedconversations.push(e)
            this.queuedconvids.add(e._id)
          }
          if (e.agent_unread_count != 0) {
            this.unreadconvids.add(e._id)
          }
        })
        if (data.length > 0) {
          // this.alertNotificationService.displayNotification("Students are Wating", "Students are wating in Queue.");
        }
      })

    this.chatService.listen('new_conversation')
      .subscribe(res => {
        var data = res as Conversation
        console.log(data)
        if (!this.queuedconvids.has(data._id)) {
          this.queuedconversations.push(data)
          this.queuedconvids.add(data._id)
          // this.alertNotificationService.displayNotification("Students are Wating", "Students are wating in Queue.");
        }
      })

    this.chatService.listen('remove_conversation')
      .subscribe(res => {
        var index = this.queuedconversations.findIndex(e => e._id == res['conversation_id'])
        console.log(res, 'remove')
        this.queuedconversations.splice(index, 1)
        this.queuedconvids.delete(res['conversation_id'])
        var index1 = this.activeconversations.findIndex(e => e._id == res['conversation_id'])
        this.activeconversations.splice(index1, 1)
        this.activeconvids.delete(res['conversation_id'])
        if (this.currentConversation._id == res['conversation_id']) {
          this.isConvSelected = false
        }
      })

    this.chatService.listen('receive_message')
      .subscribe(res => {
        var data = res as Chat
        console.log(data)
        if (data.conversation_id == this.currentConversation._id) {
          this.message_history.push(data)
          this.disableScrollDown = false
          this.scrollToBottom()
          this.currentConversation.last_message = data.message;
          this.currentConversation.last_message_time = new Date(data.time);
          this.currentConversation.is_image = data.msg_type == 'image'
          this.chatService.emit('msg_seen', {
            message_id: data._id,
            isUser_Msg: false
          })
        } else {
          var d = this.activeconversations.find(e => e._id == data.conversation_id)
          if (d) {
            d.last_message = data.message;
            d.last_message_time = new Date(data.time);
            d.is_image = data.msg_type == 'image';
            if (!d.agent_unread_count) {
              d.agent_unread_count = 0
            }
            d.agent_unread_count++;
          } else {
            var q = this.queuedconversations.find(e => e._id == data.conversation_id)
            if (q) {
              q.last_message = data.message;
              q.last_message_time = new Date(data.time);
              q.is_image = data.msg_type == 'image';
              if (!q.agent_unread_count) {
                q.agent_unread_count = 0
              }
              q.agent_unread_count++;
            }
          }
          this.unreadconvids.add(data.conversation_id)
        }

        // this.alertNotificationService.displayNotification(data.name, data.msg_type == 'image' ? '📷 Photo' : data.message);
      })

    this.chatService.listen('agent_connected')
      .subscribe(res => {
        var data = res as Conversation
        console.log(data)
        this.currentConversation = data;
        this.isConvSelected = true
      })

    this.chatService.listen('chat_error')
      .subscribe(res => {
        console.log('chat_error', res)
      })

    this.chatService.listen('typing_keydown')
      .subscribe(res => {
        //console.log(res)
        this.typingList.add(res['conversation_id'])
        setTimeout(e => {
          if (this.typingList.has(res['conversation_id'])) {
            this.typingList.delete(res['conversation_id'])
          }
        }, 3000)
      })

    this.chatService.listen('typing_keyup')
      .subscribe(res => {
        //console.log(res)
        if (this.typingList.has(res['conversation_id'])) {
          this.typingList.delete(res['conversation_id'])
        }
      })

    this.chatService.listen('user_reconnected')
      .subscribe(res => {
        var data = res as Conversation;
        console.log('user_reconnected', data)
        var s = this.activeconversations.find(e => e._id == data._id)
        if (s) {
          s = data
        } else {
          var q = this.queuedconversations.find(e => e._id == data._id)
          if (q) {
            q = data
          }
        }
        if (this.currentConversation._id == data._id) {
          this.currentConversation = data
        }
        console.log('user_reconnected', data)
      })

    this.chatService.listen('resolve_chat')
      .subscribe(res => {
        var index = this.activeconversations.findIndex(e => e._id == res['conversation_id'])
        this.activeconversations.splice(index, 1)
        this.activeconvids.delete(res['conversation_id'])
        // this.alertNotificationService.displayNotification("Query Closed", `${res['ended_by_name']}} closed his Query`);
        if (this.currentConversation._id == res['conversation_id']) {
          this.isConvSelected = false
        }
        console.log(res)
      })

    this.chatService.listen('close_chat')
      .subscribe(res => {
        var index = this.queuedconversations.findIndex(e => e._id == res['conversation_id'] || e.user_socket_id == res['socket_id'])
        this.queuedconversations.splice(index, 1)
        this.queuedconvids.delete(res['conversation_id'])
        // this.alertNotificationService.displayNotification("Leaved From Queue", `Student Leaved from Queue`);
        console.log(res)
      })
    var payload = userService.getUserPayload();
    //chatService.emit('active_agent', { agent_id: payload._id })
  }
  ngAfterViewChecked(): void {
    // console.log('ngAfterViewChecked')
    this.scrollToBottom()
  }

  ngOnInit(): void {
    //this.chatService.emit('test_emit',{})
    this.payload = this.userService.getUserPayload()
  }

  ngAfterViewInit(): void {
    // Show chat-content when clicking on chat-item for tablet and mobile devices
    // document.querySelectorAll('.chat-list .chat-item').forEach(item => {
    //   console.log(item)
    //   item.addEventListener('click', event => {
    //     document.querySelector('.chat-content').classList.toggle('show');
    //   })
    // });
    // console.log('ngAfterViewInit')
    this.scrollToBottom()
  }

  getconvhistory() {
    this.chatService.getConversations().toPromise()
      .then(res => {
        this.historyconversations = res
      }).catch(err => this.alertNotificationService.alertError(err))
  }

  // back to chat-list for tablet and mobile devices
  backToChatList() {
    document.querySelector('.chat-content').classList.toggle('show');
  }

  chattime(date: Date) {
    var d = moment(date);
    if (d.isAfter(moment().startOf('day')) && d.isBefore(moment().endOf('day'))) {
      return d.format('H:mm A')
    } else if (d.isAfter(moment().subtract(1, 'day').startOf('day')) && d.isBefore(moment().startOf('day'))) {
      return 'Yesterday'
    } else if (d.isAfter(moment().startOf('week')) && d.isBefore(moment().subtract(1, 'day').startOf('day'))) {
      return d.format('dddd')
    }
    return d.format('DD/MM/YYYY')

  }

  currentConversation = new Conversation()
  message_history: Chat[] = []
  isConvSelected = false
  isautoscroll = true
  acceptChat() {
    this.chatService.emit("connect_user", {
      agent_id: this.payload._id,
      conversation_id: this.currentConversation._id
    })
    console.log(this.currentConversation)
    this.queuedconversations.splice(this.queuedconvid, 1)
    this.activeconversations = [this.currentConversation, ...this.activeconversations]
    this.activeconvids.add(this.currentConversation._id)
    this.queuedconvids.delete(this.currentConversation._id)
    this.defaultNavActiveId = 1
    this.selectChat(this.currentConversation)
    this.disableScrollDown = false
    this.queuedconvid = null
    this.currentConversation.is_acknowledged = true
  }

  queuedconvid = null

  selectqueuedChat(conv: Conversation, i) {
    this.queuedconvid = i
    this.selectChat(conv)
  }

  selectChat(conv: Conversation) {
    this.message_history = []
    this.currentConversation = conv
    this.isConvSelected = true
    /**Chat history api call */
    this.chatService.getChatHistory(conv.user_id).toPromise()
      .then(res => {
        this.message_history = res
        this.disableScrollDown = false
        console.log('selectChat')
        this.isautoscroll = true;
        this.scrollToBottom();
      }).catch(err => this.alertNotificationService.alertError(err))
    this.unreadconvids.delete(this.currentConversation._id)
    this.currentConversation.agent_unread_count = 0
    this.chatService.emit('conv_seen', {
      conversation_id: conv._id,
      isUser_Msg: false
    })
  }

  msgdata: string = ''

  sendmsg() {
    if (this.msgdata) {
      var data1 = {
        conversation_id: this.currentConversation._id,
        socket_id: this.currentConversation.user_socket_id,
        msg_type: 'text',
        message: this.msgdata,
        isUser_Msg: false,
        time: new Date(),
        name: this.currentConversation.agent_name
      }
      console.log(data1)
      this.chatService.emit("send_message", data1)
      this.currentConversation.last_message = this.msgdata;
      this.currentConversation.last_message_time = new Date();
      this.currentConversation.is_image = false
      this.msgdata = ''
    }
    this.message_history.push(data1)
    this.disableScrollDown = false
    this.scrollToBottom()
  }

  onScroll() {
    // console.log('scroll')
    let element = this.mContainer.nativeElement
    let atBottom = element.scrollHeight - element.scrollTop == element.clientHeight
    // console.log(element.scrollHeight - element.scrollTop , element.clientHeight)
    if (this.disableScrollDown && atBottom) {
      this.disableScrollDown = false
    } else {
      this.disableScrollDown = true
    }
  }

  scrollToBottom(): void {
    if (this.disableScrollDown) {
      return
    }
    try {
      this.mContainer.nativeElement.scrollTop = this.mContainer.nativeElement.scrollHeight;
      this.isautoscroll = false;
      // console.log(this.mContainer.nativeElement.scrollTop , this.mContainer.nativeElement.scrollHeight)
    } catch (err) { console.error(err) }
  }

  typing_keyup() {
    if (this.isConvSelected) {
      // console.log({
      //   conversation_id: this.currentConversation._id,
      //   socket_id: this.currentConversation.user_socket_id,
      // })
      this.chatService.emit("typing_keyup", {
        conversation_id: this.currentConversation._id,
        socket_id: this.currentConversation.user_socket_id,
      })
    }

  }

  typing_keydown() {
    if (this.isConvSelected) {
      // console.log({
      //   conversation_id: this.currentConversation._id,
      //   socket_id: this.currentConversation.user_socket_id,
      // })
      this.chatService.emit("typing_keydown", {
        conversation_id: this.currentConversation._id,
        socket_id: this.currentConversation.user_socket_id,
      })
    }
  }

  hastyping(id) {
    return this.typingList.has(id)
  }

  msgtime(date: Date) {
    var d = moment(date);
    if (d.isAfter(moment().startOf('day')) && d.isBefore(moment().endOf('day'))) {
      return d.format('H:mm A')
    }
    return d.format('DD/MM/YYYY H:mm A')
  }

  resolveChat() {
    this.alertNotificationService.alertCustomMsg("are you sure you want to resolve this conversation?")
      .then(res => {
        if (res.isConfirmed) {
          if (this.isConvSelected) {
            this.chatService.emit("resolve_chat", {
              conversation_id: this.currentConversation._id,
              socket_id: this.currentConversation.user_socket_id,
              ended_by: this.currentConversation.agent_id,
              ended_by_name: this.currentConversation.agent_name
            })
            this.isConvSelected = false
            this.activeconvids.delete(this.currentConversation._id)
            var indi = this.activeconversations.findIndex(e => e._id == this.currentConversation._id)
            this.activeconversations.splice(indi, 1)
            this.currentConversation = new Conversation()
            this.message_history = []
          }
        }
      })
  }

  uploadimage() {
    this.modalService.open(ImageUploaderComponent, { centered: true, size: 'xl', backdrop: 'static' }).result
      .then(result => {
        if (result) {
          const files: File = result;
          const fd = new FormData();
          fd.append("file", files, files.name);
          this.chatService.uploadChatImage(fd).subscribe(
            res => {
              if (res.type === HttpEventType.Response) {

                var imageurl = res.body as string[];
                var data1 = {
                  conversation_id: this.currentConversation._id,
                  socket_id: this.currentConversation.user_socket_id,
                  msg_type: 'image',
                  message: imageurl[0],
                  isUser_Msg: false,
                  time: new Date()
                }
                console.log(data1)
                this.chatService.emit("send_message", data1)
                this.msgdata = ''
                this.message_history.push(data1)
                this.disableScrollDown = false
                this.scrollToBottom()
                this.currentConversation.last_message = "";
                this.currentConversation.last_message_time = new Date();
                this.currentConversation.is_image = false
              }
            },
            err => this.alertNotificationService.alertError(err)
          );
        }
      })

  }
  imagepreview
  openimage(image, content) {
    this.imagepreview = image
    this.modalService.open(content, { centered: true })
  }

  msgdisp(text: string) {
    if (text && text.length > 30) {
      return text.substring(0, 20) + '...'
    }
    else {
      return text
    }
  }

  notifyMe() {
    if (!("Notification" in window)) {
      // alert("This browser does not support desktop notification");
    }
    else if (Notification.permission !== 'denied') {
      Notification.requestPermission(function (permission) {
        // if (!('permission' in Notification)) {
        //   Notification.permission = permission;
        // }
      });
    }
  }

  linkify(inputText) {
    var replacedText, replacePattern1, replacePattern2, replacePattern3;

    //URLs starting with http://, https://, or ftp://
    replacePattern1 = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
    replacedText = inputText.replace(replacePattern1, '<a href="$1" target="_blank">$1</a>');

    //URLs starting with "www." (without // before it, or it'd re-link the ones done above).
    replacePattern2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
    replacedText = replacedText.replace(replacePattern2, '$1<a href="http://$2" target="_blank">$2</a>');

    //Change email addresses to mailto:: links.
    replacePattern3 = /(([a-zA-Z0-9\-\_\.])+@[a-zA-Z\_]+?(\.[a-zA-Z]{2,6})+)/gim;
    replacedText = replacedText.replace(replacePattern3, '<a href="mailto:$1">$1</a>');

    return replacedText;
  }

  isunread(id) {
    return this.unreadconvids.has(id)
  }

  public isEmojiPickerVisible: boolean;
  public addEmoji(event) {
    this.msgdata = `${this.msgdata}${event.emoji.native}`;
    this.isEmojiPickerVisible = false;
  }

  sanitizeimage(s: string) {
    return this.santizer.bypassSecurityTrustUrl(s)
  }

}
