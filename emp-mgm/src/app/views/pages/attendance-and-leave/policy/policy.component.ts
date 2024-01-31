import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Policy } from 'src/app/model/employee.model';
import { AlertNotificationsService } from 'src/app/services/alert-notifications.service';
import { AttendanceService } from 'src/app/services/attendance.service';

@Component({
  selector: 'app-policy',
  templateUrl: './policy.component.html',
  styleUrls: ['./policy.component.scss']
})
export class PolicyComponent implements OnInit {
  policy: Policy = {
    _id: '',
    policy_name: '',
    description: '',
    leave_type: '',
    is_encashable: false,
    effective_from: null,
    total_per_year: 0,
    is_holiday_excluded: false,
    is_weekend_excluded: false,
    max_consecutive: 0,
    apply_before_days: 0,
    accrual_method: '',
    waiting_period_length: 0,
    waiting_period_unit: '',
    max_carry_days: 0,
    max_balance_days: 0,
    is_half_day_allowed: false,
    is_active: false,
    leave_exclusion: [],
    is_prorata_basis: false,
    current_balance: 0,
    supporting_document_required: false,
    min_days_for_supporting_doc: 0
  }
  isedit = false;
  policylist: any;
  id: any;
  code: any;
  dates: string;

  expandTextarea() {
    const textarea = document.getElementById('Description') as HTMLTextAreaElement;
    textarea.classList.add('expanded');
  }

  shrinkTextarea() {
    const textarea = document.getElementById('Description') as HTMLTextAreaElement;
    textarea.classList.remove('expanded');
  }
  constructor(
    private attendanceService: AttendanceService,
    private alertNotificationService: AlertNotificationsService,
    private router: Router,
    private route: ActivatedRoute
  ) { }
  leaveTypeDrp = [
    'Sick Leave', 'Casual Leave', 'Earned Leave'
  ]

  accrualMethodDrp = [
    'Monthly', 'Quarterly', 'Yearly'
  ]
  leaveExclusion = [
  ]

  waitingPeriodDrop = [
    'Day', 'Week', 'Month'
  ]
  async ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.id = params.get('id');
    });
    this.route.queryParamMap.subscribe(query => {
      this.code = query.get('code');
    })
    this.dates = new Date().getTime().toString();
    this.attendanceService.getPolicylist().toPromise()
      .then(res => {
        this.leaveExclusion = res;
      }).catch(err => this.alertNotificationService.alertError(err));
    this.refresh();
  }

  async refresh() {
    if (this.id || this.code) {
      var id = this.id ? this.id : this.code
      await this.attendanceService.getPolicyById(id).toPromise()
        .then(res => {
          this.policy = res;
        }).catch(err => this.alertNotificationService.alertError(err))
    }
    if (this.id && !this.code) {
      this.isedit = true;
    }
  }
  submitForm(e: NgForm) {
    if (this.isedit) {
      this.updatePolicy(e);
    }
    else {
      this.postPolicy(e);
    }
  }
  getCurrentDate(): string {
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split('T')[0];
    return formattedDate;
  }
  postPolicy(e: NgForm) {
    this.attendanceService.newPolicy(this.policy).toPromise()
      .then(res => {
        this.alertNotificationService.toastAlertSuccess('Policy Created Succesfully');
        this.router.navigateByUrl('/admin/attendance-and-leave/policy-list')
        e.resetForm();
      }).catch(err => this.alertNotificationService.alertError(err))
  }
  updatePolicy(f: NgForm) {
    this.alertNotificationService.alertChanges()
      .then(result => {
        if (result.isConfirmed) {
          this.attendanceService.updatePolicybyId(this.policy, this.policy._id).toPromise()
            .then(res => {
              this.isedit = false;
              this.alertNotificationService.toastAlertSuccess('Policy Updated Successfully')
              this.router.navigateByUrl('/admin/attendance-and-leave/policy-list')
            }).catch(err => this.alertNotificationService.alertError(err))
        }
      })
  }
}
