import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { EventInput } from '@fullcalendar/core';
import { DemoScheduleDisp } from 'src/app/model/demoschedule.model';
import { AlertNotificationsService } from 'src/app/services/alert-notifications.service';
import { ExportService } from 'src/app/services/export.service';
import { LeadsService } from 'src/app/services/leads.service';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGrigPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction'; // for dateClick
import { ClipboardService } from 'ngx-clipboard';
import { FullCalendarComponent } from '@fullcalendar/angular';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { LeadChangelog, LeadChanges, Leads } from 'src/app/model/leads.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EmployeeService } from 'src/app/services/employee.service';

const colors: any = {
  red: '#FAE3E3',
  blue: '#1e90ff',
  yellow: '#e3bc08'
};

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss'],
  providers: [DatePipe]
})
export class ScheduleComponent implements OnInit {

  constructor(
    private leadsService: LeadsService,
    private exportService: ExportService,
    private alertNotificationService: AlertNotificationsService,
    private datePipe: DatePipe,
    private _clipboardService: ClipboardService,
    private router: Router,
    private employeeService: EmployeeService,
    private modalService: NgbModal) { }

  allDemoSchedule: DemoScheduleDisp[] = []
  filterQuery = "";
  rowsOnPage = 25;
  sortBy = "date";
  sortOrder = "asc";
  today = this.CorrectTime();
  dataLength;
  displayedColumns: string[];
  displayedColumns1: string[];
  upcoming: DemoScheduleDisp[]
  past: DemoScheduleDisp[]
  dataSource: MatTableDataSource<DemoScheduleDisp>;
  dataSource1: MatTableDataSource<DemoScheduleDisp>;
  @ViewChild('paginatorUS', { static: true }) paginatorUS: MatPaginator;
  @ViewChild('paginatorPS', { static: true }) paginatorPS: MatPaginator;
  @ViewChild('sortUS', { static: true }) sortUS: MatSort;
  @ViewChild('sortPS', { static: true }) sortPS: MatSort;
  events: EventInput[] = [];
  @ViewChild('externalEvents', { static: true }) externalEvents: ElementRef;
  calendarPlugins = [dayGridPlugin, timeGrigPlugin, interactionPlugin, listPlugin]; // important!
  isLoading = false;
  @ViewChild('calendar') calendarComponent: FullCalendarComponent;
  userDetails

  offSet = 0;
  async ngOnInit() {
    this.userDetails = this.employeeService.getUserPayload()
    this.displayedColumns = ["leadowner", "leadownername", "name", "phone", "email", "start_time", "end_time", "duration", "webinarid", "password", "join_url", "licence", "id"];
    this.isLoading = true
    var time = null
    await this.leadsService.getCurrentTime().toPromise()
      .then(res => time = new Date(res['time']))
      .catch(err => time = new Date())
    this.offSet = new Date().getTime() - (time ? time.getTime() : new Date().getTime());
    console.log(time, new Date(), this.offSet, this.CorrectTime())
    this.refresh()
  }
  refresh() {

    this.leadsService.getallschedule('all').toPromise()
      .then(res => {
        this.allDemoSchedule = res;
        this.createevent();
        console.log(this.subDays(this.today, 1))
        this.upcoming = this.allDemoSchedule.filter(e => moment(e.start_time).isSameOrAfter(this.today)).sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime())
        this.dataSource = new MatTableDataSource(this.upcoming);
        this.dataSource.paginator = this.paginatorUS;
        this.dataSource.sort = this.sortUS;
        this.past = this.allDemoSchedule.filter(e => moment(e.start_time).isBefore(this.today)).sort((a, b) => new Date(b.start_time).getTime() - new Date(a.start_time).getTime())
        this.dataSource1 = new MatTableDataSource(this.past);
        this.dataSource1.paginator = this.paginatorPS;
        this.dataSource1.sort = this.sortPS;
        this.isLoading = false
      }).catch(err => this.alertNotificationService.alertError(err));
  }

  gotolead(data) {
    this.leadsService.leadid = data.leadid
    /*const url = this.router.serializeUrl(
      this.router.createUrlTree(['/admin/students/manual-registration'],{queryParams:{ob:true}})
    );
    window.open(url, '_blank');*/
    this.router.navigate(['/admin/leads/lead-details'])
  }

  deleteschedule(data: DemoScheduleDisp) {
    this.alertNotificationService.alertDelete()
      .then(async result => {
        if (result.isConfirmed) {
          await this.leadsService.deleteschedule(data._id, data.webinarid).toPromise()
            .then(res => {
            }).catch(err => this.alertNotificationService.alertError(err))

          this.alertNotificationService.toastAlertSuccess('Webinar Deleted Successfully');

          var lead = new Leads()
          await this.leadsService.getleadbyid(data.leadid).toPromise()
            .then(res => {
              lead = res;
            }).catch(err => this.alertNotificationService.alertError(err))
          if (lead) {
            lead.isdemoschedule = false;
            await this.leadsService.leadupdate(lead, false).toPromise()
              .then(res => {
                var change = new LeadChanges();
                change.user = this.userDetails.name + ' - ' + this.userDetails.invid;
                change.date = this.CorrectTime();
                change.change = 'Demo Schedule Deleted'
                this.postlog(change, lead._id)
              }).catch(err => this.alertNotificationService.alertError(err))
          }
          this.refresh()
        }
      })
  }
  leaddemo = new DemoScheduleDisp()
  onEdit(data: DemoScheduleDisp, content) {
    this.refresh()
    this.leaddemo = data;
    this.modalService.open(content, { centered: true, size: 'lg', scrollable: true }).result.then((result) => {

    }).catch((res) => { });
  }

  type = 'Demo'
  submitForm() {
    var s = {
      start_time:  this.datePipe.transform(this.leaddemo.start_time.toString(), "yyyy-MM-ddTHH:mm:ss"),
      end_time: this.addMinutes(new Date(this.leaddemo.start_time), 75),
      leadid: this.leaddemo.leadid,
      topic: this.leaddemo.topic
    }
    this.leadsService.updateschedule(s).toPromise()
      .then(res => {
        this.alertNotificationService.toastAlertSuccess('Demo Class Schedule Time Changed');
        var change = new LeadChanges();
        change.user = this.userDetails.name + ' - ' + this.userDetails.invid;
        change.date = this.CorrectTime();
        change.change = 'Demo Scheduled for ' + this.datePipe.transform(this.leaddemo.start_time, 'dd/MM/yy, h:mm a')
        this.postlog(change, this.leaddemo.leadid)
        this.refresh()
      }).catch(err => {
        this.alertNotificationService.alertError(err)
      })
  }

  isdateacceptable = true
  ontimechange() {
    this.isdateacceptable = true;
    var flag = 0
    this.allDemoSchedule.forEach(e => {
      if (e.leadid != this.leaddemo.leadid && (moment(this.leaddemo.start_time).isBetween(e.start_time, e.end_time, undefined, "[]") || moment(this.leaddemo.start_time).add(75, 'minute').isBetween(e.start_time, e.end_time, undefined, "[]"))) {
        flag++;
        if (flag >= 2) {
          this.isdateacceptable = false;
        }
      }
    })
    if (!this.isdateacceptable) {
      this.alertNotificationService.alertInfo("Time Slot Not Available. Select Another Time");
    }
  }


  postlog(change: LeadChanges, id) {
    var logs = new LeadChangelog();
    logs.leadid = id;
    logs.changes = [];
    logs.changes.push(change)
    this.leadsService.postleadchangelogs([logs]).toPromise()
      .then(res => { })
      .catch(err => console.log(err))
  }

  createevent() {
    this.events = []
    this.allDemoSchedule.forEach(
      e => {
        try {
          var a = {
            start: new Date(e.start_time.toString().replace('Z', '')),
            end: new Date(e.end_time.toString()),
            title: 'Booked By ' + e.leadownername + ' for ' + e.name + ' at ' + this.datePipe.transform(e.start_time.toString().replace('Z', ''), 'h:mm a') + ' - ' + this.datePipe.transform(e.end_time.toString(), 'h:mm a'),
            backgroundColor: colors.yellow,
          }
          console.log(a,e);
          this.events.push(a)
        } catch (err) {
          console.error(err)
        }
      }
    )
    var s = this.calendarComponent.getApi()
    s.removeAllEventSources()
    s.addEventSource(this.events)
  }

  copied(webinarres) {
    var text = "Demo Class ID: " + webinarres.webinarid;
    text += "\r\nDemo Class Password: " + webinarres.password;
    text += "\r\nDemo Class Link: " + webinarres.join_url;
    text += "\r\nTime: " + this.datePipe.transform(webinarres.start_time, 'medium');
    this._clipboardService.copy(text)
    this.alertNotificationService.toastAlertSuccess('Details Copied')
  }

  export() {
    var data = [this.upcoming, this.past]
    var name = ['Upcoming Schedule', "Past Schedule"]
    this.exportService.createmultiplesheet('Schedule', data, name);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  applyFilter1(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource1.filter = filterValue.trim().toLowerCase();

    if (this.dataSource1.paginator) {
      this.dataSource1.paginator.firstPage();
    }
  }

  addHours(date: Date, hh: number) {
    var d = new Date(date)
    d.setHours(d.getHours() + hh);
    return d
  }

  addMinutes(date: Date, mm: number) {
    var d = new Date(date)
    d.setMinutes(d.getMinutes() + mm);
    return d
  }

  endOfDay(date: Date) {
    var d = new Date(date);
    d.setHours(23, 59, 59);
    return d
  }
  startOfDay(date: Date) {
    var d = new Date(date);
    d.setHours(0, 0, 0);
    return d
  }

  subDays(date: Date, num: number) {
    var d = new Date(date)
    d.setDate(d.getDate() - num);
    return d
  }

  CorrectTime() {
    return new Date(new Date().getTime() - this.offSet)
  }
}
