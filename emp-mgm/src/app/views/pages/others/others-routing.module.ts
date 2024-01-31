import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdBannerComponent } from './ad-banner/ad-banner.component';
import { BackupRestoreComponent } from './backup-restore/backup-restore.component';
import { BooksComponent } from './books/books.component';
import { OthersComponent } from './others.component';
import { ShortUrlComponent } from './short-url/short-url.component';
import { TrainingKitComponent } from './training-kit/training-kit.component';
import { TutorialComponent } from './tutorial/tutorial.component';
import { WebinarsComponent } from './webinars/webinars.component';
import { SmsLogComponent } from './sms-log/sms-log.component';
import { EmailLogComponent } from './email-log/email-log.component';
import { WhatsappLogComponent } from './whatsapp-log/whatsapp-log.component';

const routes: Routes = [
  {
    path: '',
    component: OthersComponent,
    children: [
      {
        path: 'ad-banner',
        component: AdBannerComponent
      },
      {
        path: 'books',
        component: BooksComponent
      },
      {
        path: 'backup-restore',
        component: BackupRestoreComponent
      },
      {
        path: 'short-url',
        component: ShortUrlComponent
      },
      {
        path: 'training-kits',
        component: TrainingKitComponent
      },
      {
        path: 'tutorial',
        component: TutorialComponent
      },
      {
        path: 'webinars',
        component: WebinarsComponent
      },
      {
        path: 'sms-log',
        component: SmsLogComponent
      },
      {
        path: 'email-log',
        component: EmailLogComponent
      },
      {
        path: 'whatsapp-log',
        component: WhatsappLogComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OthersRoutingModule { }
