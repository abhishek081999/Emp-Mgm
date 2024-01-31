import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CommunicationRoutingModule } from './communication-routing.module';
import { CommunicationComponent } from './communication.component';
import { AnnouncementComponent } from './announcement/announcement.component';
import { DiscussionsComponent } from './discussions/discussions.component';
import { FormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill';
import { NgSelectModule } from '@ng-select/ng-select';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { ReplyBoxComponent } from './reply-box/reply-box.component';
import { NotificationComponent } from './notification/notification.component';
import { NoticeboardComponent } from './noticeboard/noticeboard.component';
import { FeahterIconModule } from 'src/app/core/feather-icon/feather-icon.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [CommunicationComponent, AnnouncementComponent, DiscussionsComponent, ReplyBoxComponent, NotificationComponent, NoticeboardComponent],
  imports: [
    CommonModule,
    FormsModule,
    QuillModule.forRoot(),
    CommunicationRoutingModule,
    NgSelectModule,
    PipesModule,
    FeahterIconModule,
    NgbModule
  ]
})
export class CommunicationModule { }
