import { HttpEventType } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AlertNotificationsService } from 'src/app/services/alert-notifications.service';
import { BackupRestoreService } from 'src/app/services/backup-restore.service';
import { courseService } from 'src/app/services/course.service';

@Component({
  selector: 'app-backup-restore',
  templateUrl: './backup-restore.component.html',
  styleUrls: ['./backup-restore.component.scss']
})
export class BackupRestoreComponent implements OnInit {
  
  filesToUpload:File
  filename:string
  fd=new FormData()
  progressvalue: number=0;
  isfilepresent=false
  isupload=false
  
  constructor(
    private courseService:courseService, 
    private backupRestoreService:BackupRestoreService, 
    private alertNotificationService:AlertNotificationsService
    ) { }

  ngOnInit(): void {
  }

  handelFile(event){
    if(event.target.files.length===0)
      return
    var mimetype = event.target.files[0].type;
    if(mimetype.match(/application\/gzip/)==null){
      this.alertNotificationService.alertError('Only Gzip or .gz files are Supported')
      return
    }
    this.filename=event.target.files[0].name;
    this.filesToUpload=<File>event.target.files[0];
    this.isfilepresent=true
    let element: HTMLElement = document.querySelector("#backup + .input-group .file-upload-info") as HTMLElement;
    element.setAttribute( 'value', this.filename)
  }

  submit(e:Event){
    if(!this.isfilepresent){
      this.alertNotificationService.alertError('No File Found. Please Upload a File')
    }
    else{
      this.alertNotificationService.alertRestore()
      .then((result) => {
        if (result.isConfirmed) {
          this.filename = this.filename.split('\\').pop();
          const files: File = this.filesToUpload;
          this.fd.append("file", files, files['name']);
          this.isupload=true
          this.courseService.postFile(this.fd).subscribe(
            res=>{
              if(res.type===HttpEventType.UploadProgress){ 
                this.progressvalue=Math.round(100 * res.loaded / res.total);
              }
              if(res.type===HttpEventType.Response){
                this.backupRestoreService.restore({filename:this.filename}).toPromise()
                .then(
                  res=>{
                    //console.log(res)
                    this.isupload=false
                    this.isfilepresent=false
                    this.filename=''
                    this.fd=new FormData()
                    this.alertNotificationService.toastAlertSuccess('Database Restored');
                  }).catch(err=>{
                    e.preventDefault();
                    this.alertNotificationService.alertError(err)
                  })
              }
            },err=>{
              this.alertNotificationService.alertError(err)
            })
        }
      })
    }
  }

  backup(){
    this.backupRestoreService.backup().toPromise()
    .then(
      res=>{
        var contentDisposition = res.headers.get('content-disposition')
        var filename = contentDisposition.split(';')[1].split('filename=')[1].trim().replace(/"/g, '');
        const blob = res.body;
        const url = window.URL.createObjectURL(blob);
        var link = document.createElement('a');
        link.href = url;
        link.download=filename;
        link.click();
        window.URL.revokeObjectURL(url);
      }).catch(err=>{
        this.alertNotificationService.alertError(err)
      })
  }

  openFileBrowser(event: any) {
    event.preventDefault();
    let element: HTMLElement = document.querySelector("#backup") as HTMLElement;
    element.click()
  }


}
