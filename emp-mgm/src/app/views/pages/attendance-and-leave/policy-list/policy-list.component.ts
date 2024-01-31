import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Policy } from 'src/app/model/employee.model';
import { AlertNotificationsService } from 'src/app/services/alert-notifications.service';
import { AttendanceService } from 'src/app/services/attendance.service';
@Component({
  selector: 'app-policy-list',
  templateUrl: './policy-list.component.html',
  styleUrls: ['./policy-list.component.scss']
})
export class PolicyListComponent implements OnInit {
  getAllpolicylist: Policy[] = [];
  policyList: Policy[] = []
  displayedColumns: string[];
  data: any;
  selection: any;
  id;
  isLoading = false
  searchq: string = '';
  pagefilter: string = '';
  constructor(
    private attendanceService: AttendanceService,
    private alertNotificationService: AlertNotificationsService,
    private router: Router
  ) { }
  ngOnInit() {
    this.refresh()
  }
  async refresh() {
    await this.attendanceService.getPolicylist().toPromise()
      .then(res => {
        this.policyList = res;
        this.filter();
      }).catch(err => this.alertNotificationService.alertError(err));
  }
  async Active(id, p) {
    await this.alertNotificationService.alertCustomMsg('Do you want to Change ?')
      .then(async result => {
        console.log(p.is_active)
        if (await result.isConfirmed) {
          var data = {
            _id: id,
            is_active: p.is_active
          }
          await this.attendanceService.Approvepolicy(data).toPromise()
            .then(res => {
              this.alertNotificationService.toastAlertSuccess('Changes Done Successfully');
              this.refresh();

            }).catch(err => this.alertNotificationService.alertError(err))
        } else {
          // this.getAllpolicylist.is_active = p.is_active
          this.refresh();
        }

      }).catch(err => this.alertNotificationService.alertError(err));
  }
  editpolicy(policylist) {
    this.router.navigateByUrl('/admin/attendance-and-leave/edit-policy/' + policylist._id)
  }
  duplicatepolicy(policylist) {
    this.router.navigate(['/admin/attendance-and-leave/policy'], { queryParams: { code: policylist._id } })
  }
  filter() {
    this.getAllpolicylist = [...this.policyList]
    if (this.pagefilter === "inactive") {
      this.getAllpolicylist = this.getAllpolicylist.filter(e => !e.is_active);
    }
    else if (this.pagefilter === "active") {
      this.getAllpolicylist = this.getAllpolicylist.filter(e => e.is_active);
    }
    if (this.searchq) {
      this.searchq = this.searchq.toLowerCase()
      this.getAllpolicylist = this.getAllpolicylist.filter((e) => (e.policy_name && e.policy_name.toLowerCase().indexOf(this.searchq) > -1) || (e.leave_type && e.leave_type.toLowerCase().indexOf(this.searchq) > -1) || (e.description && e.description.toString().toLowerCase().indexOf(this.searchq) > -1));
    }
  }
}
