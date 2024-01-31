import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LogsComponent } from './logs.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CronjobRunnerComponent } from './cronjob-runner/cronjob-runner.component';


const routes: Routes = [
  {
    path: '',
    component: LogsComponent,
  },
  {
    path: 'cron',
    component: CronjobRunnerComponent,
  }
]



@NgModule({
  declarations: [LogsComponent, CronjobRunnerComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    FormsModule,
    MatCheckboxModule
  ]
})
export class LogsModule { }
