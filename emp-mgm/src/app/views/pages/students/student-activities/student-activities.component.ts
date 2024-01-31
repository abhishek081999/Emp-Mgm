import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { InsigniaItem } from 'src/app/model/insignia.model';
import { AlertNotificationsService } from 'src/app/services/alert-notifications.service';
import { ExportService } from 'src/app/services/export.service';
import { InsigniaService } from 'src/app/services/insignia.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-student-activities',
  templateUrl: './student-activities.component.html',
  styleUrls: ['./student-activities.component.scss']
})
export class StudentActivitiesComponent implements OnInit {
  pageSizeOptions = 25
  insigniaItem: InsigniaItem[];

  courses = []

  allData = [];
  displayedColumns: string[];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  constructor(
    private alertNotificationService: AlertNotificationsService,
    private insigniaService: InsigniaService,
    public userService: UserService,
    private exportService : ExportService


  ) { }
ids =[]
names=[]
  async ngOnInit() {
    this.displayedColumns = ['student_name', 'student_phone', 'student_whatsapp'];
    await this.insigniaService.getInsignia().toPromise()
      .then(res => {
        this.insigniaItem = res as InsigniaItem[];
        this.insigniaItem = this.insigniaItem.filter(e=>e.itemType=='COURSE')
      }).catch(err => this.alertNotificationService.alertError(err))

  }

  services: String[] = []
  submitForm(e: Event) {

    // this.stuAct.courses.push()
    console.log(this.courses);
    this.userService.postService({courses: this.courses}).toPromise()
      .then(res => {
        this.allData = res as any[]
        this.allData.forEach(e=>{
          this.courses.forEach(c=>{
            e[c] = e[c]?new Date(e[c]):e[c]
          })
        })
        this.dataSource = new MatTableDataSource(this.allData);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.displayedColumns = ['student_name', 'student_phone', 'student_whatsapp'];
        this.displayedColumns.push(...this.courses)
      }).catch(err => this.alertNotificationService.alertError(err));
    e.preventDefault();
  
   
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  export(){
    if(this.dataSource){
      this.exportService.exportonesheet('Student Activities',this.dataSource.filteredData)
    }
  }
  
  SearchFn(term: string, item: InsigniaItem) {
    term = term.toLowerCase();
    return item.name.toLowerCase().indexOf(term) > -1 || item._id.toLowerCase().indexOf(term) > -1;
  }
}
