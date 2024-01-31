import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AnnouncementComponent } from './announcement/announcement.component';
import { CommunicationComponent } from './communication.component';
import { DiscussionsComponent } from './discussions/discussions.component';
import { NotificationComponent } from './notification/notification.component';
import { NoticeboardComponent } from './noticeboard/noticeboard.component';

const routes: Routes = [
  {
    path: '',
    component: CommunicationComponent,
    children: [
      {
        path: 'announcements',
        component: AnnouncementComponent
      },
      {
        path: 'noticeboard',
        component: NoticeboardComponent
      },
      {
        path: 'messages',
        component: DiscussionsComponent
      },
      {
        path: 'notifications',
        component: NotificationComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CommunicationRoutingModule { }
