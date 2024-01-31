import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Sla } from 'src/app/model/support-sla.model';
import { SupportSlaService } from 'src/app/services/support-sla.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EmployeeService } from 'src/app/services/employee.service';
import { Employee } from 'src/app/model/employee.model';
import { SupportGroupService } from 'src/app/services/support-group.service';
import { MatTableDataSource } from '@angular/material/table';
import { GroupData } from 'src/app/model/supportGroup.model';
@Component({
  selector: 'app-support-sla',
  templateUrl: './support-sla.component.html',
  styleUrls: ['./support-sla.component.scss']
})
export class SupportSlaComponent implements OnInit {
  slaPolicies = [];
  policyId: string;
  minutes;
  slaPolicData: any;
  employees: Employee[] = [];
  q: 'all';
  department: null;
  team: null;
  submittedData: any[] = [];
  dataSource = new MatTableDataSource<any>(this.submittedData);
  slacondition: []


  sla: Sla = {
    _id: '',
    name: '',
    description: '',
    slacondition: [
      {
        condition: '',
        items: []
      }
    ],

    priorityModel: [
      {
        name: 'Urgent',
        firstResponseTime: null,
        everyResponseTime: null,
        resolutionTime: null,
        operationalHours: '',
        escalation: false,
      },
      {
        name: 'High',
        firstResponseTime: null,
        everyResponseTime: null,
        resolutionTime: null,
        operationalHours: '',
        escalation: false,
      },
      {
        name: 'Medium',
        firstResponseTime: null,
        everyResponseTime: null,
        resolutionTime: null,
        operationalHours: '',
        escalation: false,
      },
      {
        name: 'Low',
        firstResponseTime: null,
        everyResponseTime: null,
        resolutionTime: null,
        operationalHours: '',
        escalation: false,
      },
    ],

    reminderModel: [
      {
        when: '',
        approaches: null,
        sendReminderTo: []
      }
    ],

    escalationModel: [
      {
        when: '',
        isNotMet: null,
        escalateTo: []
      }
    ],
  }

  constructor(private supportSlaService: SupportSlaService, private router: Router,
    private employeeService: EmployeeService, private route: ActivatedRoute, private supportGroupService: SupportGroupService,
    private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.policyId = params['id'];
      // console.log("policyId", this.policyId);
    });

    if (this.policyId) {
      this.supportSlaService.getSlaPolicyById(this.policyId)
        .toPromise()
        .then((data: any) => {
          this.sla = data;
          console.log('GetSlaPolicyById Data:', this.sla);

        })
        .catch((error: any) => {
          console.error('Error fetching policy data:', error);
        });
    }
    this.refresh()
  }

  escalationTime = [
    { name: "1 hour", value: 60 },
    { name: "2 hour", value: 120 },
    { name: "3 hour", value: 180 },
    { name: "4 hour", value: 240 },
  ]

  remainderTime = [
    { name: "1 hour", value: 60 },
    { name: "2 hour", value: 120 },
    { name: "3 hour", value: 180 },
    { name: "4 hour", value: 240 },
  ]
  productOptions=[
    'Group A',
    'Group B',
    'Group c',
    'Group d',
  ]
  typeOptions=[
    'Group t',
    'Group b',
    'Group s',
    'Group z',
  ]
  sourceOptions=[
    'Group T',
    'Group H',
    'Group M',
    'Group O',
  ]

  getPriorityColor(priority: string): string {
    switch (priority) {
      case 'Urgent':
        return 'red';
      case 'High':
        return 'yellow';
      case 'Medium':
        return 'blue';
      case 'Low':
        return 'green';
      default:
        return '';
    }
  }

  secondOptions = [
    'Escalation Team',
    'Group A',
    'Group B',
  ];

  responseTargets = [
    'First response target',
    'Next response target',
    'Resolution target',
  ];


  refresh() {
    this.employeeService.getAllEmployees(this.q, this.department, this.team)
      .toPromise()
      .then(data => {
        this.employees = data;
        // console.log("employee service", this.employees);
        this.employees = this.employees.filter((data) => data.isActive)
      })
      .catch(error => {
        console.error('Error:', error);
      });


    // data is comming from create group (support group service)
    this.supportGroupService.getFormData()
      .toPromise()
      .then((data: GroupData[]) => {
        this.submittedData = data;
        // this.dataSource.data = this.submittedData;
        console.log('Form Data fetched successfully:', this.submittedData);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }

  responseTarget = [
    'First response target',
    'Next response target',
    'Resolution target'
  ];

  agent = [
    'Assigned agent',
    'Ananya Halder',
    'Debopratim',
    'INVESMATE ADMIN',
    'PRITI DAS',
    'Sagar Ghose',
    'Somnath Sharma'
  ];


  addEscalation() {
    this.sla.escalationModel.push({
      when: '',
      isNotMet: null,
      escalateTo: []
    });

  }
  addReminder() {
    this.sla.reminderModel.push({
      when: '',
      approaches: 0,
      sendReminderTo: [],

    });
  }

  addNewCondition() {
    this.sla.slacondition.push({
      condition: '',
      items: []
    });
  } 

  onSubmit(): void {
    console.log('SLA Data:', this.sla);
    this.router.navigate(['support-portal/setting/support-sla-policy']);

    if (this.policyId) {
      this.supportSlaService.updateSlaPolicy(this.policyId, this.sla)
        .toPromise()
        .then((response: any) => {
          console.log('SLA Policy Updated:', response);
          this.snackBar.open('Data updated successfully', 'Close', { duration: 3000 });

        })
        .catch((error: any) => {
          console.error('Error updating SLA policy:', error);
          this.snackBar.open('Error updating data', 'Close', { duration: 3000, panelClass: 'error-snackbar' });
        });
    } else {
      this.supportSlaService.createSlaPolicy(this.sla)
        .toPromise()
        .then((response: any) => {
          this.slaPolicies = response;
          console.log('SLA Policy Created:', this.slaPolicies);
        })
        .catch((error: any) => {
          console.error('Error creating SLA policy:', error);
        });
    }
  }

  redirectToSupportSlaPage() {
    this.router.navigateByUrl('support-portal/setting/support-sla-policy');
  }
  deleteEscalation(index: number) {
    this.sla.escalationModel.splice(index, 1);
  }
  deleteReminders(index: number) {
    this.sla.reminderModel.splice(index, 1);
  }
  deleteCondition(index: number) {
    this.sla.slacondition.splice(index, 1);
  }
  StaffSearchFn(term: string, item: Employee) {
    term = term.toLowerCase();
    return item.fullName.toLowerCase().indexOf(term) > -1 || item.invid.toLowerCase().indexOf(term) > -1;
  }


}
