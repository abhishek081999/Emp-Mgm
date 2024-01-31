import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SupportGroupRoutingModule } from './support-group-routing.module';
import { SupportGroupComponent } from './support-group.component';

import { CreateGroupComponent } from './create-group/create-group.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { SupportGroupService } from 'src/app/services/support-group.service';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon'; 
import { MatSnackBarModule } from '@angular/material/snack-bar';



@NgModule({
  declarations: [SupportGroupComponent,CreateGroupComponent],
  imports: [
    CommonModule,
    SupportGroupRoutingModule,
    NgSelectModule ,
    FormsModule, 
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
  ],
  providers: [SupportGroupService],
})
export class SupportGroupModule { }
