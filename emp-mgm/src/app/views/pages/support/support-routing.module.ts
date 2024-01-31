import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChatFeedbackComponent } from './chat-feedback/chat-feedback.component';
import { ChatWindowComponent } from './chat-window/chat-window.component';
import { SupportSettingsComponent } from './support-settings/support-settings.component';
import { SupportComponent } from './support.component';

const routes: Routes = [
  {
    path: '',
    component: SupportComponent,
    children: [
      {
        path: 'chat-feedback',
        component: ChatFeedbackComponent
      },
      {
        path: 'chat',
        component: ChatWindowComponent
      },
      {
        path: 'settings',
        component: SupportSettingsComponent
      },
    ]
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SupportRoutingModule { }
