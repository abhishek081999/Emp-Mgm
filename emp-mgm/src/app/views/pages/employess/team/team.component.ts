import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Department, Employee, Team } from 'src/app/model/employee.model';
import { AlertNotificationsService } from 'src/app/services/alert-notifications.service';
import { EmployeeService } from 'src/app/services/employee.service';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.scss'],

})
export class TeamComponent implements OnInit {
  departments: Department[] = [];
  teams: any[] = []
  employees: Employee[] = [];
  dept_emp: Employee[] = [];
  team: Team = {
    team_lead: '',
    name: '',
    department_id: ''
  }
  displayedColumns = []
  dataSource: MatTableDataSource<any>;
  constructor(
    private employeeService: EmployeeService,
    private alertNotificationService: AlertNotificationsService,
  ) { }

  ngOnInit(): void {
    this.refresh()
  }

  isTeamAvailable = false;
  refresh() {
    this.displayedColumns = ["name", "team_lead", "no_of_member", "options"]
    this.refreshTeams();
    this.employeeService.getAllDepartment('all').toPromise()
      .then(res => {
        this.departments = res;
      }).catch(err => this.alertNotificationService.alertError(err))
    this.employeeService.getAllEmployees('all', null, null).toPromise()
      .then(res => {
        this.employees = res;
        this.employees = this.employees.filter(e => e.isActive);
      }).catch(err => this.alertNotificationService.alertError(err));
  }

  refreshTeams() {
    this.isTeamAvailable = false;
    this.employeeService.getAllTeams('display', null).toPromise()
      .then(res => {
        this.teams = res;
        this.onDeptSelect(this.teams[0])
        this.isTeamAvailable = true;
      }).catch(err => this.alertNotificationService.alertError(err))
  }

  submit() {
    this.alertNotificationService.alertChanges()
      .then(result => {
        if (result.isConfirmed) {
          this.employeeService.addTeam(this.team).toPromise()
            .then(res => {
              this.alertNotificationService.toastAlertSuccess("Saved Successfully")
              this.team = new Team();
              this.isEdit = false;
              this.refreshTeams();
            }).catch(err => this.alertNotificationService.alertError(err))
        }
      })
  }

  deleteTeam(id) {
    this.alertNotificationService.alertDelete()
      .then(result => {
        if (result.isConfirmed) {
          this.employeeService.deleteTeam(id).toPromise()
            .then(res => {
              this.alertNotificationService.toastAlertSuccess("Deleted Successfully")
              this.refreshTeams();
            }).catch(err => this.alertNotificationService.alertError(err))
        }
      })
  }

  onDeptSelect(row) {
    if (row && row.teams && row.teams.length > 0) {
      this.dataSource = new MatTableDataSource(row.teams);
    } else {
      this.dataSource = new MatTableDataSource([]);
    }
  }

  isEdit = false;
  editTeam(team) {
    this.team = team;
    this.deptChange()
    this.isEdit = true;
  }

  cancelEdit() {
    this.team = new Team();
    this.isEdit = false
  }

  deptChange() {
    if (this.team.department_id) {
      this.dept_emp = this.employees.filter(e => e.department_id == this.team.department_id)
      console.log(this.dept_emp)
    } else {
      this.dept_emp = [];
    }
  }

  StaffSearchFn(term: string, item: Employee) {
    term = term.toLowerCase();
    return item.fullName.toLowerCase().indexOf(term) > -1 || item.invid.toLowerCase().indexOf(term) > -1;
  }

}
