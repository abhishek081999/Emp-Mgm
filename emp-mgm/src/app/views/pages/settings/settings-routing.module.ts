import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SettingsComponent } from './settings.component';
import { ZoomSettingsComponent } from './zoom-settings/zoom-settings.component';
import { FreshdeskAgentsComponent } from './freshdesk-agents/freshdesk-agents.component';
import { StringeeAgentsComponent } from './stringee-agents/stringee-agents.component';

const routes: Routes = [
  {
    path: '',
    component: SettingsComponent,
    children: [
      {
        path: 'zoom-settings',
        component: ZoomSettingsComponent
      },
      {
        path: 'freshdesk-agents',
        component: FreshdeskAgentsComponent
      },
      {
        path: 'stringee-agents',
        component: StringeeAgentsComponent
      }
    ]
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule { }
