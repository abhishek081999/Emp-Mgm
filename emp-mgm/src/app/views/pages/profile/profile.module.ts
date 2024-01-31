import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileComponent } from './profile.component';
import { MyProfileComponent } from './my-profile/my-profile.component';
import { DndDirective } from './dnd.directive';
import { FormsModule } from '@angular/forms';
import { NgbAlertModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { FeahterIconModule } from 'src/app/core/feather-icon/feather-icon.module';
import { NgSelectModule } from '@ng-select/ng-select';


@NgModule({
  declarations: [ProfileComponent, MyProfileComponent,DndDirective],
  imports: [
    CommonModule,
    ProfileRoutingModule,    
    FormsModule,
    NgbTooltipModule,
    FeahterIconModule,
    NgSelectModule,
    NgbAlertModule
  ]
})
export class ProfileModule { }
