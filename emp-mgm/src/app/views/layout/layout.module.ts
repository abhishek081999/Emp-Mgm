import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { BaseComponent } from './base/base.component';
import { NavbarComponent } from './navbar/navbar.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { FooterComponent } from './footer/footer.component';

import { ContentAnimateDirective } from '../../core/content-animate/content-animate.directive';

import { NgbDropdownModule, NgbCollapseModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';

import { FeahterIconModule } from '../../core/feather-icon/feather-icon.module';

import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { AdminSidebarComponent } from './admin-sidebar/admin-sidebar.component';
import { AdminBaseComponent } from './admin-base/admin-base.component';
import { AdminNavbarComponent } from './admin-navbar/admin-navbar.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { NgSelectModule } from '@ng-select/ng-select';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};


@NgModule({
  declarations: [
    BaseComponent, 
    NavbarComponent, 
    SidebarComponent, 
    FooterComponent, 
    ContentAnimateDirective, 
    AdminSidebarComponent,
    AdminBaseComponent,
    AdminNavbarComponent],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    NgbDropdownModule,
    NgbCollapseModule,
    PerfectScrollbarModule,
    FeahterIconModule,
    NgbNavModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    NgSelectModule,

  ],
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    }
  ]
})
export class LayoutModule { }
