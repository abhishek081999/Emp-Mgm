import { Component, OnInit } from '@angular/core';
import { Employee } from 'src/app/model/employee.model';
import { GroupData } from 'src/app/model/supportGroup.model';
import { EmployeeService } from 'src/app/services/employee.service';
import { SupportGroupService } from 'src/app/services/support-group.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-create-group',
  templateUrl: './create-group.component.html',
  styleUrls: ['./create-group.component.scss']
})
export class CreateGroupComponent implements OnInit {
  name: string = '';
  q: 'all';
  department: null;
  team: null;
  employees: Employee[] = [];
  submittedData: any[] = []; 
  dataSource = new MatTableDataSource<any>(this.submittedData);
  isEditMode: boolean = false;

  groupData: GroupData = {
    _id: null,
    name: '',
    groupLeader: '',
    employeeId: [],

  }
  showErrorMessage: any;

  constructor(private employeeService: EmployeeService,
    private supportGroupService: SupportGroupService, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.refresh();
  }

  refresh() {
    this.employeeService.getAllEmployees(this.q, this.department, this.team)
      .toPromise()
      .then(data => {
        this.employees = data;
        this.employees = this.employees.filter((data) => data.isActive)
      })
      .catch(error => {
        console.error('Error:', error);
      });


    // getFormData
    this.supportGroupService.getFormData()
      .toPromise()
      .then((data: GroupData[]) => {
        this.submittedData = data;
        this.dataSource.data = this.submittedData;
        console.log('Data fetched successfully:', data);
        
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }


  onSubmit() {
    console.log('Form Data:', this.groupData);
    
    if (this.isEditMode) {
      this.supportGroupService.updateData(this.groupData)
        .toPromise()
        .then((response) => {
         
          this.snackBar.open('Update successful', 'Close', {
            duration: 3000,
          });
          console.log('Form Data updated successfully:', response);
          
        })
        .catch((error) => {
          console.error('Error while updating form data:', error);
        });
        this.refresh();
    } else {
      this.supportGroupService.postFormData(this.groupData)
        .toPromise()
        .then((response) => { 
          this.snackBar.open('Save successful', 'Close', {
            duration: 3000,
          });
          this.refresh();
          console.log('Form Data submitted successfully:', response);
        })
        .catch((error) => {
          console.error('Error while submitting form data:', error);
        });
    }
    this.isEditMode = false; 
  }

  updateData(data) {
    if (data) {
      const formData = data;
      console.log('Update data', formData);
      this.groupData._id = formData._id
      this.groupData.name = formData.name;
      this.groupData.groupLeader = formData.groupLeader;
      this.groupData.employeeId = formData.employeeId;

    } else {
      console.error('Invalid group ID.');
    }
    this.isEditMode = true;
  }


  StaffSearchFn(term: string, item: Employee) {
    term = term.toLowerCase();
    return item.fullName.toLowerCase().indexOf(term) > -1 || item.invid.toLowerCase().indexOf(term) > -1;
  }


  deleteGroup(groupId: string) {
    this.supportGroupService
      .deleteGroup(groupId)
      .subscribe({
        next: (res:any) => {
          if (res) {
            console.log('Data deleted successfully');
            this.snackBar.open('Data deleted successfully', 'Close', { duration: 3000 });
           
          } else {
            console.error('Error while deleting group:', res);
            this.snackBar.open('Error deleting group', 'Close', { duration: 3000 });
          }
        },
      });
      this.refresh();
  }
  

}


