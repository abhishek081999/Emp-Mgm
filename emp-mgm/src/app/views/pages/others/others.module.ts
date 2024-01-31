import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OthersRoutingModule } from './others-routing.module';
import { BooksComponent } from './books/books.component';
import { OthersComponent } from './others.component';
import { FormsModule } from '@angular/forms';
import { NgbModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { BackupRestoreComponent } from './backup-restore/backup-restore.component';
import { ShortUrlComponent } from './short-url/short-url.component';
import { TrainingKitComponent } from './training-kit/training-kit.component';
import { TutorialComponent } from './tutorial/tutorial.component';
import { AdBannerComponent } from './ad-banner/ad-banner.component';
import { FeahterIconModule } from 'src/app/core/feather-icon/feather-icon.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ClipboardModule } from 'ngx-clipboard';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatTableModule } from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSortModule} from '@angular/material/sort';
import { WebinarsComponent } from './webinars/webinars.component';
import { ImageUploaderComponent } from './image-uploader/image-uploader.component';
import { AngularCropperjsModule } from 'angular-cropperjs';
import { VideoPlayerComponent } from './video-player/video-player.component';
import { SmsLogComponent } from './sms-log/sms-log.component';
import { EmailLogComponent } from './email-log/email-log.component';
import { WhatsappLogComponent } from './whatsapp-log/whatsapp-log.component';


@NgModule({
  declarations: [
    BooksComponent,
    OthersComponent,
    BackupRestoreComponent,
    ShortUrlComponent,
    TrainingKitComponent,
    TutorialComponent,
    AdBannerComponent,
    WebinarsComponent,
    ImageUploaderComponent,
    VideoPlayerComponent,
    SmsLogComponent,
    EmailLogComponent,
    WhatsappLogComponent
  ],
  imports: [
    CommonModule,
    OthersRoutingModule,
    FormsModule,
    NgbModule,
    FeahterIconModule,
    NgxDatatableModule,
    ClipboardModule,
    NgSelectModule, // Ng-select
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    NgbPaginationModule,
    AngularCropperjsModule
  ]
})
export class OthersModule { }
