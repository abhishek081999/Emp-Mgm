import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import * as moment from 'moment';
import { Employee } from 'src/app/model/employee.model';
import { chatFeedback, User } from 'src/app/model/user.model';
import { AlertNotificationsService } from 'src/app/services/alert-notifications.service';
import { ChatService } from 'src/app/services/chat.service';
import { EmployeeService } from 'src/app/services/employee.service';
import { ExportService } from 'src/app/services/export.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-chat-feedback',
  templateUrl: './chat-feedback.component.html',
  styleUrls: ['./chat-feedback.component.scss']
})
export class ChatFeedbackComponent implements OnInit {
  isLoading = false
  dataSource: MatTableDataSource<chatFeedback>;
  displayedColumns: string[];
  chatFeedback: Array<chatFeedback> = [];
  dataLength;
  allstudents: User[] = []; //for fethcing the user
  student; // for ngModal
  isResolveddrop: string[] = ['Yes', 'No'] //for drop down [item]
  IsResolved;
  allEmployes: Employee[] = []
  Emps;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  constructor(
    private userService: UserService,
    private employeeService: EmployeeService,
    private chatService: ChatService,
    private exportService: ExportService,
    private alertNotificationService: AlertNotificationsService,
  ) { }

  async ngOnInit() {
    this.isLoading = true;
    this.displayedColumns = ['userName', 'agentName', 'type', 'is_resolved', 'rating', 'comment', 'conv_point', 'initiated_at', 'acknowledged_at', 'response_tat', 'resolved_at', 'resolve_tat'];
    this.refresh();

  }
  async refresh() {
    await this.chatService.getChatFeedback().toPromise()
      .then(res => {
        this.chatFeedback = res as chatFeedback[];

      }).catch(err => this.alertNotificationService.alertError(err));

    await this.userService.getStudents().toPromise()
      .then(res => {
        this.allstudents = res as User[]
      }).catch(err => this.alertNotificationService.alertError(err));

    await this.employeeService.getAllEmployees('all', null, null).toPromise()
      .then(res => {
        this.allEmployes = res as Employee[]
        this.allEmployes = this.allEmployes.filter(e => e.isActive);
      }).catch(err => this.alertNotificationService.alertError(err));

    this.filter()
  }


  filter() {
    var data = [...this.chatFeedback.reverse()]
    if (this.student) {
      data = data.filter(e => e.userInvid == this.student)
    }
    if (this.Emps) {
      data = data.filter(e => e.agentInvid == this.Emps)
    }

    if (this.IsResolved) {
      if (this.IsResolved == 'Yes') {
        data = data.filter(e => e.is_resolved == true)

      }
      else {
        data = data.filter(e => e.is_resolved == false)

      }
    }
    this.isLoading = false;
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataLength = this.chatFeedback.length;
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  export() {
    this.exportService.exportonesheet('Chat Feedback', this.chatFeedback.reverse())
  }

  getLoginHours(start, end) {
    try {
      if (end) {
        return moment(new Date(start)).from(new Date(end), true);
      } else {
        return moment(new Date(start)).fromNow(true);
      }
    } catch (error) {
      return "";
    }
  }
}
