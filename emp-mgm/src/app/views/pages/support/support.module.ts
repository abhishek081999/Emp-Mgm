import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SupportRoutingModule } from './support-routing.module';
import { SupportComponent } from './support.component';
import { ChatWindowComponent } from './chat-window/chat-window.component';
import { PerfectScrollbarModule, PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { FormsModule } from '@angular/forms';
import { NgbDropdownModule, NgbNavModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { SupportSettingsComponent } from './support-settings/support-settings.component';
import { ChatFeedbackComponent } from './chat-feedback/chat-feedback.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { NgSelectModule } from '@ng-select/ng-select';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true,
  wheelPropagation: true
};


@NgModule({
  declarations: [SupportComponent, ChatWindowComponent, SupportSettingsComponent, ChatFeedbackComponent],
  imports: [
    CommonModule,
    SupportRoutingModule,
    PerfectScrollbarModule,
    FormsModule,
    NgbNavModule,
    NgbDropdownModule,
    NgbTooltipModule,
    PickerModule,
    MatPaginatorModule,
    MatTableModule,
    NgSelectModule,



  ],
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    }
  ]
})
export class SupportModule { }
