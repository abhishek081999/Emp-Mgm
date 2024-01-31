import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { Jobdata, Jobapplication } from 'src/app/model/jobs.model';
import { User } from 'src/app/model/user.model';
import { AlertNotificationsService } from 'src/app/services/alert-notifications.service';
import { ExportService } from 'src/app/services/export.service';
import { JobsService } from 'src/app/services/jobs.service';
import { UserService } from 'src/app/services/user.service';
import { environment } from 'src/environments/environment';
import * as JSZipUtils from 'jszip-utils';
import * as JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { Subscription as subs } from 'rxjs' ;

@Component({
  selector: 'app-jobapplications',
  templateUrl: './jobapplications.component.html',
  styleUrls: ['./jobapplications.component.scss']
})
export class JobapplicationsComponent implements OnInit {
  paramsub: subs;
  
  constructor(
    private jobsService: JobsService,
    private userService: UserService,
    private route: ActivatedRoute,
    private alertNotificationService :  AlertNotificationsService,
    private exportService: ExportService
    ) { }

    filterQuery="";
    rowsOnPage = 5;
    sortBy = "invid";
    sortOrder = "asc";
    today ='';
    dataLength;
    displayedColumns: string[];
    dataSource: MatTableDataSource<Jobdata>;
    pagefilter=""
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: true}) sort: MatSort;

    allapplications:Jobapplication[]=[]
    allappdate:Jobdata[]=[]
    alluser:User[]=[]
    jobids=[]
    imageurl=environment.imageUrl;
    exportavailable=false;
    isLoading:boolean
  ngOnInit() {
    this.paramsub = this.route.queryParamMap.subscribe(params=>{
      this.pagefilter=params.get('jobid');
    });
    this.refresh()
    this.displayedColumns = ['jobid','invid','fullName', 'email', 'telephone', 'alternatenumber','gender','dob','applicationdate', 'address', 'city', 'pincode', 'state','qualification','cv'];

  }

  ngOnDestroy(): void {
    if(this.paramsub)
      this.paramsub.unsubscribe()
  }

  isfound=true
  async refresh(){
    this.isLoading=true
    this.today=new Date().toLocaleString();
    await this.jobsService.getallapplication().toPromise()
    .then(res=>{this.allapplications=res;})
    .catch(err=>this.alertNotificationService.alertError(err))
    await this.userService.getStudents().toPromise()
    .then(res=>this.alluser=res)
    .catch(err=>this.alertNotificationService.alertError(err))
    this.allapplications.forEach((e)=>{
      if(!this.jobids.includes(e.jobid)){
        this.jobids = [...this.jobids, e.jobid];
      }
      var a=new Jobdata();
      var b=this.alluser.filter(f=>f._id==e.studentid)[0];
      a.jobid=e.jobid;
      a.invid=b?b.invid:null;
      a.fullName=b?b.fullName:null;
      a.email=b?b.email:null;
      a.telephone=b?b.telephone:null;
      a.alternatenumber=b?b.alternatenum:null;
      var date=b && b.dob?new Date(b.dob):null;
      a.dob=b && b.dob?date.getDate()+'-'+(date.getMonth()+1)+'-'+date.getFullYear():null;
      var date=new Date(e.date)
      a.applicationdate=date.getDate()+'-'+(date.getMonth()+1)+'-'+date.getFullYear();
      a.gender=b?b.gender:null;
      a.address=b?b.address:null;
      a.city=b?b.city:null;
      a.pincode=b?b.pincode:null;
      a.state=b?b.state:null;
      a.qualification=b?b.qualification:null;
      a.cv=b?b.cv:null;
      this.allappdate.push(a);
    })
    this.isLoading=false
    this.isfound=this.allappdate.length>0
    this.jobids=this.jobids.sort()
    this.onchange();  
  }

  applyFilter(event: Event) {
    try {
      const filterValue = (event.target as HTMLInputElement).value;
      this.dataSource.filter = filterValue.trim().toLowerCase();

      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
    } catch (error) {
      this.alertNotificationService.alertInfo('Select Job ID')
    }
  }
  
  export(){
    var a = this.allappdate.filter((e)=>e.jobid==this.pagefilter);
    this.exportService.exportonesheet(this.pagefilter,a)
    this.downloadzip()
  }

  downloadzip(){
    var a = this.allappdate.filter((e)=>e.jobid==this.pagefilter);
    var zipfilename =this.pagefilter+'_CV_'+  this.today + '.zip'
    let zipFile: JSZip = new JSZip();
    var count=0;
    a.forEach(function(ele){
      var filename = ele.invid+'_CV.pdf';
      //console.log(filename);
      // loading a file and add it in a zip file
      var imageurl=environment.imageUrl
      JSZipUtils.getBinaryContent(imageurl+ele.cv, function (err, data) {
         if(err) {
            console.error(err); // or handle the error
         }
         //console.log(data)
         zipFile.file(filename, data, {binary:true});
         count++;
         if(count==a.length){
          zipFile.generateAsync({type:'blob'}).then(function(content) {
            //console.log('test')
            saveAs(content, zipfilename);
         });
        }
      });
      
    });
    
  }

  onchange(){
    var a = this.allappdate.filter((e)=>e.jobid==this.pagefilter);
    this.exportavailable=a.length>0;
    this.dataSource=new MatTableDataSource(a);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }


}
