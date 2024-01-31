import { Component, OnInit, ViewChild } from '@angular/core';
import { CompanyDocument } from 'src/app/model/company-document.model';
import { Department, Employee, Team } from 'src/app/model/employee.model';
import { AlertNotificationsService } from 'src/app/services/alert-notifications.service';
import { CompanyDocumentService } from 'src/app/services/company-document.service';
import { EmployeeService } from 'src/app/services/employee.service';
import { MatTableDataSource } from '@angular/material/table';
import { NgForm } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
@Component({
  selector: 'app-company-document',
  templateUrl: './company-document.component.html',
  styleUrls: ['./company-document.component.scss']
})
export class CompanyDocumentComponent implements OnInit {
  companyDocument: CompanyDocument[] = [];
  documentId: string;
  updateMode: boolean = false;
  displayedColumns: string[] = ['title', 'department', 'team', 'category', 'actions'];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  constructor(
    private employeeService: EmployeeService,
    private alertNotificationService: AlertNotificationsService,
    private companyDocumentService: CompanyDocumentService,
  ) { }

  departments: Department[] = [];
  allTeams: Team[];
  formData: CompanyDocument = {
    _id: '',
    title: '',
    link: '',
    department: [],
    team: [],
    category: ''
  };

  categories = [
    "Benefits",
    "Ethics & Conducts",
    "Health",
    "Safety & Wellness",
    "Process",
    "Professional Development",
    "Time off & Leave",
    "Working Hours"
  ];

  ngOnInit(): void {
    this.refresh();
    this.onGetDocuments();
  }
  refresh() {
    this.employeeService.getAllDepartment('all').toPromise()
      .then(res => {
        this.departments = res as Department[];
      }).catch(err => this.alertNotificationService.alertError(err))

    this.employeeService.getAllTeams('all', null).toPromise()
      .then(res => {
        this.allTeams = res as Team[];
      }).catch(err => this.alertNotificationService.alertError(err))
  }

  onSubmit(companyDocumentForm: NgForm) {
    if (this.updateMode) {
      this.companyDocumentService.updateCompanyDocument(this.formData).toPromise()
        .then(response => {
          this.alertNotificationService.toastAlertSuccess("Updated Successfully");
          this.onGetDocuments();
          this.resetForm(companyDocumentForm);
        }).catch(error => {
          this.alertNotificationService.alertError(error);
        });
    } else {
      this.companyDocumentService.postCompanyDocument(this.formData).toPromise()
        .then(response => {
          this.alertNotificationService.toastAlertSuccess("Saved Successfully");
          this.onGetDocuments();
          this.resetForm(companyDocumentForm);
        }).catch(error => {
          this.alertNotificationService.alertError(error);
        });
    }
  }
  onGetDocuments() {
    this.companyDocumentService.getCompanyDocuments().toPromise()
      .then(response => {
        this.companyDocument = response;
        this.dataSource = new MatTableDataSource(this.companyDocument);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      })
      .catch(error => {
        this.alertNotificationService.alertError(error)
      });
  }


  editDocument(documentId: string) {
    this.updateMode = true;
    this.documentId = documentId;
    this.companyDocumentService.getCompanyDocumentById(documentId).toPromise()
      .then((documentData: CompanyDocument) => {
        this.formData = { ...documentData }; // Pre-fill the form data
      }).catch(error => {
        this.alertNotificationService.alertError(error);
      });
  }

  deleteDocument(documentId: string) {
    this.alertNotificationService.alertDelete()
      .then(result => {
        if (result.isConfirmed) {
          this.companyDocumentService.deleteCompanyDocument(documentId)
            .toPromise()
            .then(response => {
              this.alertNotificationService.toastAlertSuccess("Deleted Successfully");
              this.onGetDocuments();
            }).catch(error => {
              this.alertNotificationService.alertError(error);
            });
        }
      })
  }

  resetForm(companyDocumentForm) {
    this.formData = {
      _id: '',
      title: '',
      link: '',
      department: [],
      team: [],
      category: ''
    };
    if (companyDocumentForm) {
      companyDocumentForm.resetForm();
    }
  }

  StaffSearchFn(term: string, item: Employee) {
    term = term.toLowerCase();
    return item.fullName.toLowerCase().indexOf(term) > -1 || item.invid.toLowerCase().indexOf(term) > -1;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
