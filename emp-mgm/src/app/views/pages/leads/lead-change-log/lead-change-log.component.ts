import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { LeadChangelog, LeadChanges } from 'src/app/model/leads.model';
import { AlertNotificationsService } from 'src/app/services/alert-notifications.service';
import { ExportService } from 'src/app/services/export.service';
import { LeadsService } from 'src/app/services/leads.service';

@Component({
  selector: 'app-lead-change-log',
  templateUrl: './lead-change-log.component.html',
  styleUrls: ['./lead-change-log.component.scss']
})
export class LeadChangeLogComponent implements OnInit {

  constructor(
    public activeModal: NgbActiveModal,
    private leadService:LeadsService,
    private alertNotificationService:AlertNotificationsService,
    private exportService:ExportService) { }
    changelog = {
      all:new LeadChangelog(),
      flowonly:new LeadChangelog()
    }
    filterQuery = "flow"
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: true}) sort: MatSort;

    rowsOnPage = 10;
    sortBy = "date";
    sortOrder = "desc";
    today = Date();
    dataLength;
    displayedColumns: string[];
    dataSource: MatTableDataSource<LeadChanges>;
    displayData : LeadChanges[]=[]
    allData : LeadChanges[]=[]
    flowonlyData : LeadChanges[]=[]
    @Input() id
  ngOnInit(): void {
    this.displayedColumns=['user','date','change']
    this.leadService.getleadchangelogs(this.id).toPromise()
    .then(res=>{
      this.changelog = res
      this.allData = []
      this.flowonlyData = []
      console.log(this.changelog)
      if(this.changelog && this.changelog.all && this.changelog.all.changes){
        this.allData = this.changelog.all.changes
      }
      if(this.changelog && this.changelog.flowonly && this.changelog.flowonly.changes){
        this.flowonlyData = this.changelog.flowonly.changes
      }
      console.log(this.allData,this.flowonlyData);
      this.onChange()
    })
    .catch(err=>this.alertNotificationService.alertError(err))
  }

  onChange(){
    this.displayData = []
    if(this.filterQuery == 'flow'){
      this.displayData =[...this.flowonlyData]
    }
    else{
      this.displayData =[...this.allData]
    }
    this.dataSource=new MatTableDataSource(this.displayData);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    if(this.dataSource){
      const filterValue = (event.target as HTMLInputElement).value;
      this.dataSource.filter = filterValue.trim().toLowerCase();
      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
    }
  }

  export(){
    if(this.displayData){ 
      this.exportService.exportonesheet('Lead Change Log',this.displayData)
    }else{
      this.alertNotificationService.alertInfo('No Log Present')
    }
  }

}
