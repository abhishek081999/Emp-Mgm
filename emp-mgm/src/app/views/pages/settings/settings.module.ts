import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingsRoutingModule } from './settings-routing.module';
import { SettingsComponent } from './settings.component';
import { ZoomSettingsComponent } from './zoom-settings/zoom-settings.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { FeahterIconModule } from 'src/app/core/feather-icon/feather-icon.module';
import { FreshdeskAgentsComponent } from './freshdesk-agents/freshdesk-agents.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { StringeeAgentsComponent } from './stringee-agents/stringee-agents.component';

@NgModule({
  declarations: [SettingsComponent, ZoomSettingsComponent, FreshdeskAgentsComponent, StringeeAgentsComponent],
  imports: [
    CommonModule,
    SettingsRoutingModule,
    NgbModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    FormsModule,
    NgSelectModule,
    FeahterIconModule,
    MatCheckboxModule,
  ]
})
export class SettingsModule { }
