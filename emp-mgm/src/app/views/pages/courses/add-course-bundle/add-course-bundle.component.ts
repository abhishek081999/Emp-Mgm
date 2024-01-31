// import { HttpEventType } from '@angular/common/http';
// import { Component, OnDestroy, OnInit } from '@angular/core';
// import { ActivatedRoute, Router } from '@angular/router';
// import { Course } from 'src/app/model/course.model';
// import { Coursebundlecourse, Coursebundle } from 'src/app/model/coursebundle.model';
// import { Package } from 'src/app/model/package.model';
// import { AlertNotificationsService } from 'src/app/services/alert-notifications.service';
// import { courseService } from 'src/app/services/course.service';
// import { PackageService } from 'src/app/services/package.service';
// import { UserService } from 'src/app/services/user.service';
// import { Subscription as subs } from 'rxjs' ;

// export class Cbundle{
//   course:Course;
//   percentage:number;
// }

// @Component({
//   selector: 'app-add-course-bundle',
//   templateUrl: './add-course-bundle.component.html',
//   styleUrls: ['./add-course-bundle.component.scss']
// })
// export class AddCourseBundleComponent implements OnInit,OnDestroy {

//   showSucessMessage: boolean;
//   serverErrorMessages: String;
//   selectedFile: File = null;
//   filesToUpload: Array<File> = [];
//   fd = new FormData();
//   today = new Date()
//   bundlecourse:Coursebundlecourse[]=[]
//   cbundlecourse:Cbundle[]=[]
//   newCourse: Coursebundle = {
//     _id:'',
//     introvideo:'',
//     coursename: '',
//     coursecode: '',
//     courseprice: 0,
//     discountedprice: 0,
//     courseduration: '',
//     teachername: '',
//     coursepicture: null,
//     coursedescription: '',
//     coursecategory: [],
//     submittedby:[],
//     courses:[],
//     numberofstudents:0,
//     numberofrating:0,
//     approved:false,
//     rating:0,
//     coursetype:'',
//     coursestartdate: this.today,
//     courselanguage:'',
//     crosssale:[],
//     upsale:[],
//     benefits:[],
//     audience:[],
//     numberoflesson:0,
//     brochure:'',
//     upcoming:false,
//     disable:false,
//     sidepanel:{
//       title:'',
//       details:[]
//     },
//     emiavailable:false
//   }
//   progressvalue: number;
//  // user=new User();
//   id;
//   isUpdate=false;
//   isupload=false;
//   isapproved:Boolean=false;
//   dates=''
//   languages=['Assamese','Bengali','English','Gujrati','Hindi',
//             'Kannada','Kashmiri','Malayalam','Marathi','Nepali',
//             'Odia','Punjabi','Sindhi','Tamil','Telugu','Urdu']

//   ngOnDestroy() {
//     if(this.postFile)
//       this.postFile.unsubscribe()
//   }
//   postFile: subs;

//   allPackage: Package[];
//   allCourse: Course[];
//   code: string;
//   isduplicate=false;
//   sidepaneldetails: string='';
//   constructor(
//     private alertNotificationService: AlertNotificationsService,
//     private route: ActivatedRoute, 
//     private courseService: courseService,
//     public userService: UserService,
//     private router: Router,
//     private packageService: PackageService
//     ) { }

//   lan=['AS','BN','EN','GU','HN','KN','KS','ML','MR','NE','OR','PA','SD','TA','TE','UR']
//     categories=[]
//     courseaudience:string='';
//     coursebenefits:string='';
    
//   ngOnInit() {
//     this.clearform();
//     this.route.paramMap.subscribe(params=>{
//       this.id=params.get('id');
//     });
//     this.route.queryParamMap.subscribe(query=>{
//       this.code=query.get('code');
//     })
    
//     this.dates=Date.now().toString();
//     this.refresh()
    
//   }

//   async refresh(){
//     await this.courseService.getAllCourse().toPromise()
//     .then(res=>this.allCourse=res as Course[])
//     .catch(err=>this.alertNotificationService.alertError(err))

//     if(!this.id && !this.code){
//       this.addForm()
//     }
//     // else{
//     //   var id=this.id?this.id:this.code
//     //   await this.courseService.getCoursebundlebyId(id).toPromise()
//     //   .then(res=>{
//     //     this.newCourse=res as Coursebundle;
//     //     if(this.code){
//     //       this.isduplicate=true;
//     //       this.newCourse._id='';
//     //       this.newCourse.approved=false;
//     //       this.newCourse.disable=false;
//     //       this.newCourse.coursecode=''
//     //     }
//     //     else{
//     //       this.isUpdate=true;
//     //     }
//     //     this.bundlecourse=this.newCourse.courses as Coursebundlecourse[];
//     //     this.bundlecourse.forEach((e)=>{
//     //       var cb=new Cbundle()
//     //       cb.course=this.allCourse.filter((f)=>f._id==e.courseid)[0];
//     //       cb.percentage=e.percentage
//     //       this.cbundlecourse.push(cb)
//     //     })
//     //     this.isapproved=this.newCourse.approved;

//     //     if(this.newCourse.sidepanel){
//     //     this.sidepaneldetails=this.newCourse.sidepanel.details?this.newCourse.sidepanel.details.join(';'):''
//     //     }
//     //     else{
//     //       this.newCourse.sidepanel={
//     //         title:'',
//     //         details:[]
//     //       }
//     //     }

//     //     this.courseaudience=this.newCourse.audience?this.newCourse.audience.toString():''
//     //     this.coursebenefits=this.newCourse.benefits?this.newCourse.benefits.toString():''
         
//     //   }).catch(err=>this.alertNotificationService.alertError(err))
//     // }

//     this.packageService.getallPackage().toPromise()
//     .then(res=>this.allPackage = res as Package[])
//     .catch(err=>this.alertNotificationService.alertError(err))

//     this.courseService.getcategorynames().toPromise()
//     .then(res=>{
//       this.categories=res as String[];
//       this.categories.sort()
//     }).catch(err=>this.alertNotificationService.alertError(err))
//   }
  

//   addForm(){
//     var c = new Cbundle();
//     this.cbundlecourse.push(c);
//   }
 

//   removeForm(index){
//     this.cbundlecourse.splice(index,1);
//   }
 

//   handelFile(event,m:Coursebundle,a){
//     if(a=='brochure')
//       m.brochure=this.dates+event.target.files[0].name;
//     else
//       m.coursepicture=this.dates+event.target.files[0].name;
//     this.filesToUpload.push(<File>event.target.files[0]);
//   }

  

//   submitForm(e:Event){
//     var s = this.today.toJSON()
//     this.bundlecourse=[]
//     this.cbundlecourse.forEach((e)=>{
//       var bc =  new Coursebundlecourse()
//       bc.courseid=e.course._id;
//       bc.percentage=e.percentage;
//       this.bundlecourse.push(bc)
//     })
    
//     this.newCourse.courses=this.bundlecourse;
    
//     const files: Array<File> = this.filesToUpload;   
//     for(let i =0; i < files.length; i++){
//       this.fd.append("file", files[i], this.dates+files[i]['name']);
//     }
    
//     if(this.newCourse.brochure){
//       this.newCourse.brochure=this.newCourse.brochure.split('\\').pop();
//     }
//     this.newCourse.coursepicture=this.newCourse.coursepicture.split('\\').pop();
//     this.newCourse.sidepanel.details=this.sidepaneldetails.split(';')
//     this.newCourse.benefits=this.coursebenefits.split(',')
//     this.newCourse.audience=this.courseaudience.split(',')
   
//     this.isupload=true;
//     this.postFile=this.courseService.postFile(this.fd).subscribe(
//       res =>{
//         if(res.type===HttpEventType.UploadProgress){ 
//           this.progressvalue=Math.round(100 * res.loaded / res.total);
//         }
//         if(res.type===HttpEventType.Response){
//           if(this.isUpdate){
//             this.updateCourse(e);
//           }
//           else{
//             this.postCourse(e);
//           }
//         }
//       },
//       err => this.alertNotificationService.alertError(err)
//     );      
//     e.preventDefault();
//   }

  

//   clearform(){
//     this.newCourse.coursecategory='';
//     this.newCourse.coursecode='';
//     this.newCourse.coursedescription='';
//     this.newCourse.courseduration='';
//     this.newCourse.coursename='';
//     this.newCourse.coursepicture='';
//     this.newCourse.courseprice=0;
//     this.newCourse.discountedprice=0;
//     this.newCourse.courses={};
//     this.newCourse.teachername='';
//     this.newCourse.approved=false;
//     this.newCourse.coursetype='',
//     this.newCourse.coursestartdate=this.today;
//     this.newCourse.numberofstudents=0;
//     this.newCourse.rating=0;
//     this.newCourse.submittedby='';
//     this.newCourse.introvideo=''
//     this.filesToUpload=[];
//     this.bundlecourse=[];
//     this.cbundlecourse=[];
//     this.fd = new FormData();
//   }

//   updateCourse(e:Event){
//     var tname=[]
//     var tid=[]
//     var ctype=[]
//     var lan=[]
//     var startdate=[];
//     this.cbundlecourse.forEach((e)=>{
//       if(!tid.includes(e.course.submittedby)){
//         tname.push(e.course.teachername);
//         tid.push(e.course.submittedby);
//       }
//       if(!ctype.includes(e.course.coursetype))
//         ctype.push(e.course.coursetype)
//       if(!lan.includes(e.course.courselanguage))
//         lan.push(e.course.courselanguage)
//       if(e.course.coursetype!='Paid Recorded Class' && e.course.coursetype != 'Free Recorded Class' && e.course.coursestartdate)
//         startdate.push(e.course.coursestartdate)
//     })
//     this.newCourse.submittedby=tid;
//     this.newCourse.teachername=tname.join(', ');
//     this.newCourse.courselanguage=lan.join(', ');
//     this.newCourse.coursetype=ctype.join(', ')
//     var sdate=new Date(startdate[0])
//     startdate.forEach((e)=>{
//       if(new Date(e)<sdate)
//         sdate=new Date(e)
//     })
//     this.newCourse.coursestartdate=new Date(sdate);
//     // this.courseService.updateCoursebundle(this.newCourse,this.id).toPromise()
//     // .then(res=>{
//     //   this.alertNotificationService.toastAlertSuccess('Course Bundle Updated Successfully')
//     //   setTimeout(() => {
//     //     this.router.navigateByUrl('/admin/courses/course-list')
//     //   }, 1000);
//     // }).catch(err=>this.alertNotificationService.alertError(err));
//     e.preventDefault();
//   }

//   postCourse(e:Event){
//     var tname=[]
//     var tid=[]
//     var ctype=[]
//     var lan=[]
//     var startdate=[];
//     this.cbundlecourse.forEach((e)=>{
//       if(!tid.includes(e.course.submittedby)){
//         tname.push(e.course.teachername);
//         tid.push(e.course.submittedby);
//       }
//       if(!ctype.includes(e.course.coursetype))
//         ctype.push(e.course.coursetype)
//       if(!lan.includes(e.course.courselanguage))
//         lan.push(e.course.courselanguage)
//       if(e.course.coursetype!='Paid Recorded Class' && e.course.coursetype != 'Free Recorded Class' && e.course.coursestartdate)
//         startdate.push(e.course.coursestartdate)
//     })
//     this.newCourse.submittedby=tid;
//     this.newCourse.teachername=tname.join(', ');
//     this.newCourse.courselanguage=lan.join(', ');
//     this.newCourse.coursetype=ctype.join(', ')
//     var sdate=new Date(startdate[0])
//     startdate.forEach((e)=>{
//       if(new Date(e)<sdate)
//         sdate=new Date(e)
//     })
//     this.newCourse.coursestartdate=new Date(sdate);
//     // this.courseService.postCoursebundle(this.newCourse).toPromise()
//     // .then(res=>{
//     //   this.alertNotificationService.toastAlertSuccess('Course Bundle Added Successfully')
//     //   setTimeout(() => {
//     //     this.router.navigateByUrl('/admin/courses/course-list')
//     //   }, 1000);
//     // }).catch(err=>this.alertNotificationService.alertError(err));
//     e.preventDefault();
//   }

//   getamount(num){
//     if(this.newCourse.discountedprice!=0){
//       return this.newCourse.discountedprice*(num/100);
//     }
//     return this.newCourse.courseprice*(num/100);
//   }

//   getcoursename(id){
//     return id && id.coursename?id.coursename:'';
//   }
 

// }
