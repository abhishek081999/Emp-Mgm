import { trigger, state, style, transition, animate } from '@angular/animations';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Leads, Onboardstudent } from 'src/app/model/leads.model';

@Component({
  selector: 'app-lead-history',
  templateUrl: './lead-history.component.html',
  styleUrls: ['./lead-history.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0', padding: '0'})),
      state('expanded', style({height: '*', padding: '15px'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class LeadHistoryComponent implements OnInit {

  filterQuery="";
  rowsOnPage = 10;
  sortBy = "date";
  sortOrder = "desc";
  today = Date();
  dataLength;
  displayedColumns: string[];
  dataSource: MatTableDataSource<Leads>;
  Onbelement = new Onboardstudent()
  expandedElement: Leads | null;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  constructor(
    public activeModal: NgbActiveModal,
  ) { }
  
  @Input() data;
  allLeads :Leads[]=[]
  allOnboarding :Onboardstudent[]=[]
  isLoading=false
  isavailable=false
  ngOnInit(): void {
    this.isLoading=true
    this.displayedColumns = ['leadowner','leadownername','leadassigndate','leaddate','leadstatus','attempt','callbackdate','updatedate','name','phone','email','leadsource','campaign_name', 'whatsappnum','city','state','dob','gender','occupation','experience','servicetype','servicecode','servicename','comment'];
    console.log(this.data)
    this.allLeads = this.data.leads;
    this.isavailable=this.allLeads.length>0;
    this.allOnboarding = this.data.onboarding;
    this.allLeads.sort(function(a,b){
      return new Date(b.leadassigndate).getTime() - new Date(a.leadassigndate).getTime();
    });
    this.dataSource=new MatTableDataSource(this.allLeads);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataLength=this.allLeads.length;
    this.isLoading=false
  }

  selectelement(element){
    this.expandedElement = this.expandedElement === element ? null : element
    if(this.expandedElement)
      this.Onbelement = this.allOnboarding.find(e=>e.leadid==this.expandedElement._id)
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

}
