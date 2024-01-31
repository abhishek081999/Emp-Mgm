import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Certificate } from 'src/app/model/certificate.model';
import { AlertNotificationsService } from 'src/app/services/alert-notifications.service';
import { CertificateService } from 'src/app/services/certificate.service';
import { ExportService } from 'src/app/services/export.service';

@Component({
  selector: 'app-certificate',
  templateUrl: './certificate.component.html',
  styleUrls: ['./certificate.component.scss']
})
export class CertificateComponent implements OnInit {
  isLoading: boolean;

  constructor(
    private certificateService:CertificateService,
    private alertNotificationService: AlertNotificationsService,
    private exportService:ExportService) { }

  allcerreq:Certificate[];
  coursenames=[]
  filterQuery="";
  rowsOnPage = 5;
  sortBy = "id";
  sortOrder = "asc";
  today = Date();
  dataLength;
  displayedColumns: string[];
  dataSource: MatTableDataSource<Certificate>;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  isfound=true
  ngOnInit() {
    this.displayedColumns = ['certificateid','invid','name','coursecode','coursename', 'email', 'telephone','date','status','id'];
    this.refresh()
  }

  refresh(){
    this.isLoading = true
    this.certificateService.getAllcer().toPromise()
    .then(res=>{
      this.allcerreq=res
      this.allcerreq.sort(function(a,b){
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });
      this.isLoading = false
      this.dataSource=new MatTableDataSource(this.allcerreq);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.isfound = this.allcerreq.length>0;
    }).catch(err=>this.alertNotificationService.alertError(err))
  }

  approve(c:Certificate){
    this.alertNotificationService.alertApprove()
    .then(result=>{
      if(result.isConfirmed){
        c.approved=true;
        c.adminshow=true;
        c.rejected=false;
        this.certificateService.updatecer(c).toPromise()
        .then(res=>{
          this.refresh()
          this.alertNotificationService.toastAlertSuccess('Certificate Approved for ' + c.name);
        }).catch(err=>this.alertNotificationService.alertError(err))
      }
    })
  }

  reject(c:Certificate){
    this.alertNotificationService.alertCustomMsg('Do you want to Reject?')
    .then(result=>{
      if(result.isConfirmed){
        c.approved=false;
        c.adminshow=true;
        c.rejected=true;
        this.certificateService.updatecer(c).toPromise()
        .then(res=>{
          this.refresh()
          this.alertNotificationService.toastAlertSuccess('Certificate Rejected for ' + c.name);
        }).catch(err=>this.alertNotificationService.alertError(err))
      }
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  export(){
    this.exportService.exportonesheet('Certificates',this.allcerreq)
  }
  
  onDownload(c:Certificate){
    this.certificateService.getmyCer(c.studentid,c.courseid).toPromise()
    .then(res=>{
        const blob = res;
        const url = window.URL.createObjectURL(blob);
        var link = document.createElement('a');
        link.href = url;
        link.download='certificate_'+c.name+'_'+c.coursename+'.pdf';
        link.click();
        window.URL.revokeObjectURL(url);
        this.alertNotificationService.toastAlertSuccess('Downloaded Successfully');
      }).catch(err=>{
        if(err["filename"]){
          this.alertNotificationService.alertError('Not Approved')
        }
      }
    )
  }
}
