import { Component, OnInit } from '@angular/core';
import { HolidayType } from 'src/app/Enums/staticdata';
import { Holiday } from 'src/app/model/course.model';
import { AlertNotificationsService } from 'src/app/services/alert-notifications.service';
import { courseService } from 'src/app/services/course.service';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
// interface MonthSelectEvent extends Event {
//   target: HTMLSelectElement & { value: string };
// }
@Component({
  selector: 'app-holiday',
  templateUrl: './holiday.component.html',
  styleUrls: ['./holiday.component.scss']
})
export class HolidayComponent implements OnInit {
  allholiday: Holiday[]
  displayedColumns: string[] = ['id', 'title', 'date', 'type'];
  searchTerm: string = '';
  filteredHolidays: Holiday[] = [];

  constructor(private CourseService: courseService,
    private alertNotificationService: AlertNotificationsService,
    public formatter: NgbDateParserFormatter,
  ) { }

  holiday: Holiday = {
    _id: '',
    title: 'Holiday',
    date: new Date(),
    type: '',
  }
  holidayType = HolidayType;
  months: string[] = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  ngOnInit(): void {
    this.GetHolidayData()

  }

  GetHolidayData() {
    this.CourseService.getHoliday().toPromise()
      .then(res => {
        this.allholiday = res as Holiday[];
        this.filteredHolidays = [...this.allholiday];
        // console.log("Get Holiday", this.allholiday);

        const filteredHolidays = this.allholiday.filter(holiday => holiday.type !== 'Market Holiday');
        const datesByMonth: { [month: string]: string[] } = {};
        filteredHolidays.forEach(holiday => {
          const date = new Date(holiday.date);
          const monthKey = date.toLocaleString('default', { month: 'long' });

          if (!datesByMonth[monthKey]) {
            datesByMonth[monthKey] = [];
          }
          datesByMonth[monthKey].push(holiday.date.toLocaleString());
        });
        for (const month in datesByMonth) {
          if (datesByMonth.hasOwnProperty(month)) {
            // console.log(`${month}:`, datesByMonth[month]);
          }
        }
      })
      .catch(err => this.alertNotificationService.alertError(err));
  }

  // onMonthSelect(event: MonthSelectEvent) {
    onMonthSelect(event: Event) {
    // const selectedMonth = event.target.value;
    const selectedMonth = (event.target as HTMLSelectElement).value;
    if (selectedMonth) {
      this.filteredHolidays = this.allholiday.filter((holiday) => {
        const date = new Date(holiday.date);
        const monthKey = date.toLocaleString('default', { month: 'long' });
        return monthKey.toLowerCase() === selectedMonth.toLowerCase();
      });
    } else {
      this.filteredHolidays = [...this.allholiday];
    }
  }

  
  submitForm() {
    console.log('Form Data:', this.holiday);
    this.CourseService.addHoliday(this.holiday).toPromise()
      .then(res => {
        this.GetHolidayData()
        this.alertNotificationService.toastAlertSuccess('Holiday Added Successfully')
        this.holiday.date = new Date();
        this.holiday.title = "Holiday";
      }).catch(err => this.alertNotificationService.alertError(err))
  }

}
