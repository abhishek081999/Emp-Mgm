import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Department, Employee } from 'src/app/model/employee.model';
import { FreshdeskAgents } from 'src/app/model/zoomAccount.model';
import { AlertNotificationsService } from 'src/app/services/alert-notifications.service';
import { EmployeeService } from 'src/app/services/employee.service';
import { ExportService } from 'src/app/services/export.service';
import { SettingsService } from 'src/app/services/settings.service';
import { SelectionModel } from '@angular/cdk/collections';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-freshdesk-agents',
  templateUrl: './freshdesk-agents.component.html',
  styleUrls: ['./freshdesk-agents.component.scss']
})
export class FreshdeskAgentsComponent implements OnInit {

  startDate = null
  endDate = null
  nameFilter = null
  StatusFilter = null
  employesid;

  StatusItems = [
    'Active',
    'In-Active'
  ];

  constructor(
    private settingsServices: SettingsService,
    private alertNotificationService: AlertNotificationsService,
    private employeeService: EmployeeService,
    private exportService: ExportService,
    private modalService: NgbModal
  ) { }

  selection = new SelectionModel<any>(true);
  dataSource: MatTableDataSource<FreshdeskAgents>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  getAllFreshdeskAgents;
  isLoading = false;
  dataLength;

  displayedColumns: string[];
  departments: Department[] = [];
  DepartmentFilter = null;
  managerFilter = null;
  employees: Employee[] = [];

  async ngOnInit() {
    this.displayedColumns = ['freshdesk_id', 'employee_name', 'last_synced', 'department', 'manager_name', 'active', 'email', 'option'];

    this.refresh()
  }


  async refresh() {
    this.isLoading = true;
    await this.employeeService.getAllDepartment('all').toPromise()
      .then(res => {
        this.departments = res as Department[];
      }).catch(err => this.alertNotificationService.alertError(err))


    await this.employeeService.getAllEmployees('all', null, null).toPromise()
      .then(res => {
        this.employees = res;
        this.employees = this.employees.filter(e => e.isActive);
      }).catch(err => this.alertNotificationService.alertError(err));
    this.filter()
  }




  filter() {
    this.isLoading = true
    let nameFilter = null;
    if (this.nameFilter) {
      nameFilter = [this.nameFilter]
    }
    this.settingsServices.getfreshdeskagentsList(this.startDate, this.endDate, this.DepartmentFilter, this.nameFilter, this.managerFilter, this.StatusFilter).toPromise()
      .then(res => {
        this.getAllFreshdeskAgents = res
        this.isLoading = false
        this.dataSource = new MatTableDataSource(this.getAllFreshdeskAgents);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.dataLength = this.getAllFreshdeskAgents.length;
      }).catch(err => this.alertNotificationService.alertError(err))
  }

  filtersearch(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  export() {
    var data = [];
    if (this.dataSource) {
      data = this.dataSource.filteredData;
    } else {
      this.alertNotificationService.alertInfo("No Data Found to Export");
      return;
    }
    var title = ' Freshdesk Agents';
    this.exportService.exportonesheet(title, data);
  }


  StaffSearchFn(term: string, item: Employee) {
    term = term.toLowerCase();
    return item.fullName.toLowerCase().indexOf(term) > -1 || item.invid.toLowerCase().indexOf(term) > -1;
  }

  Sync() {
    this.settingsServices.postsyncthechanges().toPromise()
      .then(res => {
        this.alertNotificationService.toastAlertSuccess('Sync The Chnages Added Successfully');
        this.refresh()
      }).catch(err => this.alertNotificationService.alertError(err))
  }


  updateemployee(component, ids) {
    // const ids = this.selection.selected.find(e => e._id);
    this.modalService.open(component, { size: 'md', scrollable: true, centered: true, backdrop: 'static' }).result
      .then(resp => {
        this.alertNotificationService.alertCustomMsg('Are you sure you want to Update Employee ?')
          .then(result => {
            if (result.isConfirmed) {
              var data = {
                _id: ids,
                employee_id: this.employesid
              }
              this.settingsServices.freshdeskupdateemployee(data).toPromise()
                .then(_res => {
                  this.alertNotificationService.toastAlertSuccess('Employee Updated Successfully');
                  this.refresh()
                  this.selection.clear()
                  this.employesid = ""
                }).catch(err => this.alertNotificationService.alertError(err))
            }
          })
      }).catch(err => console.log(err));
  }

}

