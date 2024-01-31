import { Component, OnInit } from '@angular/core';
import { BookedMentorshipDetails, MentorshipSlots } from 'src/app/model/one-to-one-mentorship.model';
import { AlertNotificationsService } from 'src/app/services/alert-notifications.service';
import { PackageService } from 'src/app/services/package.service';
import { Subscription as subs } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { MatTableDataSource } from '@angular/material/table';
import { NgForm } from '@angular/forms';
import { courseService } from 'src/app/services/course.service';
import { InstructorService } from 'src/app/services/instructor.service';
import { Instructor } from 'src/app/model/instructor.model';
import * as moment from 'moment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ExportService } from 'src/app/services/export.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-mentorship-details',
  templateUrl: './mentorship-details.component.html',
  styleUrls: ['./mentorship-details.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class MentorshipDetailsComponent implements OnInit {

  constructor(
    private productService: PackageService,
    private alertNotificationService: AlertNotificationsService,
    private route: ActivatedRoute,
    private router: Router,
    private courseService: courseService,
    private instructorService: InstructorService,
    public modalService: NgbModal,
    private exportService: ExportService) { }

  bookedSessionDetails = new BookedMentorshipDetails();
  bookedSessions: MentorshipSlots[] = []
  paramSub: subs
  id
  filterQuery = "";
  rowsOnPage = 10;
  sortBy = "date";
  sortOrder = "desc";
  dataLength;
  displayedColumns: string[];
  dataSource: MatTableDataSource<MentorshipSlots>;
  expandedElement: MentorshipSlots | null;
  isLoading = false
 
  ngOnDestroy() {
    if (this.paramSub)
      this.paramSub.unsubscribe()
  }

  mentorshipSlotLists: MentorshipSlots[] = []
  availableSlots: MentorshipSlots[] = []
  allMentor: Instructor[] = []
  ngOnInit(): void {
    this.displayedColumns = ['mentor_name', 'slot', 'language', 'webinarid', 'password', 'licence', 'expand'];
    this.paramSub = this.route.paramMap.subscribe(params => {
      this.id = params.get('id');
      if (this.id)
        this.refresh()
    });

    this.instructorService.getAllInstructor().toPromise()
      .then(res => {
        this.allMentor = res
      }).catch(err => this.alertNotificationService.alertError(err))
  }

  refresh() {
    this.isLoading = true
    this.productService.getMentorshipBookedSlotDetails(this.id).toPromise()
      .then(res => {
        this.bookedSessionDetails = res;
        this.bookedSessions = this.bookedSessionDetails.sessions;
        this.dataSource = new MatTableDataSource(this.bookedSessions);
        this.isLoading = false
      }).catch(err => this.alertNotificationService.alertError(err))
  }

  submit(f: NgForm) {
    this.productService.addMentorshipVideo(this.bookedSessions).toPromise()
      .then(res => {
        this.alertNotificationService.toastAlertSuccess('Video Saved');
        this.router.navigate(['/admin/products/one-to-one-mentorship'])
        f.resetForm();
      }).catch(err => this.alertNotificationService.alertError(err))
  }

  copied() {
    this.alertNotificationService.toastAlertSuccess('Copied to clipboard.')
  }

  createWebinar(id) {
    var data = {
      id: id,
    }
    this.courseService.createwebinar(data, 'OnetoOneMentorship').toPromise()
      .then(res => {
        this.refresh();
        this.alertNotificationService.toastAlertSuccess('Webinar Created.');
      }).catch(err => {
        this.alertNotificationService.alertError(err)
      })
  }
  selectedSlot = {
    currentslotid: '',
    mentor_id: '',
    date: '',
    updatedslot: '',
    start_time: new Date()
  };
  changedSlot = new MentorshipSlots();
  async changeSchedule(content, data: MentorshipSlots) {
    this.selectedSlot.mentor_id = data.mentor_id;
    this.selectedSlot.currentslotid = data._id;
    await this.productService.availableSlotLists().toPromise()
      .then(res => {
        this.mentorshipSlotLists = res
      }).catch(err => this.alertNotificationService.alertError(err))

    this.modalService.open(content, { centered: true, size: 'lg', scrollable: true }).result.then((result) => {

    }).catch((res) => { });
  }
  isSuccess = false
  submitForm() {
    this.alertNotificationService.alertChanges()
      .then(result => {
        if (result.isConfirmed) {
          this.selectedSlot.start_time = this.changedSlot.start_time;
          this.selectedSlot.updatedslot = this.changedSlot._id;
          this.isSuccess = true;
          this.productService.rescheduleMentorship(this.selectedSlot).toPromise()
            .then(res => {
              setTimeout(() => {
                this.isSuccess = false;
                this.refresh();
                this.alertNotificationService.toastAlertSuccess('Schedule Changed.');
                this.modalService.dismissAll()
              }, 5000)
            }).catch(err => {
              this.alertNotificationService.alertError(err)
            })
        }
      }).catch(err => console.log(err))
  }

  ontimechange() {
    this.availableSlots = this.mentorshipSlotLists.filter(e => moment(e.start_time).format('YYYY-MM-DD') == this.selectedSlot.date);
  }

  export() {
    if (this.bookedSessions) {
      this.bookedSessions.forEach(e => {
        e.bookingDate = e.bookingDate ? new Date(e.bookingDate) : e.bookingDate;
        e.end_time = e.end_time ? new Date(e.end_time) : e.end_time;
        e.start_time = e.start_time ? new Date(e.start_time) : e.start_time;
      })
      this.exportService.exportonesheet('One to One Mentorship', this.bookedSessions)
    }
  }


  joinclass(sc: MentorshipSlots){
    var now = new Date()
    if (sc.webinarid && this.addMinutes(now, 15).getTime() >= new Date(sc.start_time).getTime() && now.getTime() <= new Date(sc.end_time).getTime()) {
      const url = `${environment.zoomWebAppUrl}?s=${sc._id}&redirect=${window.location.href}`
      window.open(url, '_blank');
    }
    else if (sc._id) {
      if (new Date(sc.end_time).getTime() < now.getTime()) {
        this.alertNotificationService.alertInfo('Session Ended')
      }
      else {
        this.alertNotificationService.alertInfo('Session Not Started Yet. You will access it before 15 minutes of start time')
      }
    }
    else {
      this.alertNotificationService.alertInfo('Session Not Found')
    }
  }
  
  addMinutes(date: Date, mm: number) {
    var d = new Date(date)
    d.setMinutes(d.getMinutes() + mm);
    return d
  }
}
