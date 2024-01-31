import { Component, HostListener, OnInit } from '@angular/core';
import { BloodGroups, EmailRegex, IndianStateList, Languages, MaritalStatus, Relations } from 'src/app/Enums/staticdata';
import { Employee, EmployeeDetails } from 'src/app/model/employee.model';
import { Instructor } from 'src/app/model/instructor.model';
import { Qualification } from 'src/app/model/qualification.model';
import { Countries } from 'src/app/model/user.model';
import { AlertNotificationsService } from 'src/app/services/alert-notifications.service';
import { courseService } from 'src/app/services/course.service';
import { EmployeeService } from 'src/app/services/employee.service';
import { InstructorService } from 'src/app/services/instructor.service';
import { UserService } from 'src/app/services/user.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.scss']
})
export class MyProfileComponent implements OnInit {
  imageurl = environment.imageUrl;
  emailRegex = EmailRegex;
  showSucessMessage: boolean;
  serverErrorMessages: string;
  userDetails;
  loggedUser: Employee = {
    _id: '',
    invid: '',
    fullName: '',
    email: '',
    telephone: '',
    address: '',
    city: '',
    pincode: '',
    role: '',
    password: '',
    profileid: ''
  };
  bloodGroups = BloodGroups;
  Marital = MaritalStatus
  Relation = Relations
  selectEmp: Employee = {
    _id: '',
    invid: '',
    fullName: '',
    email: '',
    telephone: '',
    address: '',
    city: '',
    pincode: '',
    role: '',
    password: '',
    profileid: ''
  }
  selectedUser: Instructor = {
    image: '',
    _id: '',
    invid: '',
    alternativenumber: '',
    trainingtype: '',
    activeinmarket: '',
    experience: '',
    democlass: '',
    dob: new Date(),
    fullName: '',
    email: '',
    telephone: '',
    address: '',
    state: '',
    country: '',
    city: '',
    pincode: '',
    role: '',
    // qualification: [],
    bio: '',
    language: [],
    specialization: [],
    cv: '',
    facebook: '',
    instagram: '',
    linkdin: '',
    twitter: '',
    numberoflivecourses: 0,
    numberofonlinecourses: 0,
    numberofstudents: 0,
    rating: 0,
    approved: false,
    rejected: false,
    profilecomplete: true,
    agreed: true,
    agreement: '',
    deactivate: false
  };
  employee = new Employee();
  qualification = new Qualification()
  allQualifications: Array<Qualification> = []
  resetpwd = {
    oldpwd: '',
    newpwd: '',
    renewpwd: ''
  }
  countries: Countries[] = [];

  empPersonalDetails = new EmployeeDetails();
  employeeDetails: EmployeeDetails = {
    secondary: '',
    higherSecondary: '',
    emergencyContact: {
      name: '',
      phone: '',
      relation: '',
    },
    adhaarcard: '',
    pancard: '',
    passport: '',
    cancelCheque: '',
    graduation: '',
    higherStudy: '',
    employeeType: '',
    bloodGroup: '',
    maritalStatus: ''
  }
  payload = {
    _id: '',
    email: '',
    password: '',
    newpassword: ''
  }
  iseditedform = false
  issavedform = false
  imagechange = false
  filesToUpload: File;
  fd = new FormData();
  imgurl: any
  imagepath
  categories: string[];

  cverror = true
  dates = ''
  filesToUploads: Array<File> = [];
  states = IndianStateList
  isInsAccCreated = false;
  constructor(
    private userService: UserService,
    private courseservice: courseService,
    private instructorService: InstructorService,
    private employeeService: EmployeeService,
    private alertNotificationService: AlertNotificationsService) { }


  async ngOnInit() {
    this.dates = Date.now().toString();
    this.userDetails = this.employeeService.getUserPayload();
    this.userService.getCountryCode().toPromise()
      .then(res => {
        this.countries = res as Countries[];
      }).catch(err => this.alertNotificationService.alertError(err))

    this.courseservice.getcategorynames().toPromise()
      .then(res => {
        this.categories = res as string[];
        this.categories.sort()
      }).catch(err => this.alertNotificationService.alertError(err));
    this.refreshEmployee()
  }

  async refreshEmployee() {
    await this.employeeService.getEmployeeProfile(this.userDetails.invid, 'all').toPromise()
      .then(res => {
        this.employee = res;
        console.log(this.employee)
        if (!this.employee.countryCode) {
          this.employee.countryCode = '+91'  //by default 
        }

        if (this.employee.countryCode) {
          if (this.employee.countryCode != "+91") {
            this.isother = true
            this.employee.state = "Other"
            this.statename = ["Other"]
          }
          else {
            this.statename = this.states
          }
        }
        this.imgurl = this.employee.profile_image;

      }).catch(err => this.alertNotificationService.alertError(err));

    await this.employeeService.getPersonalDetails(this.employee._id).toPromise()
      .then(r => {
        this.empPersonalDetails = r;
        if (this.empPersonalDetails) {
          this.employeeDetails.pancard = this.empPersonalDetails?.pancard;
          this.employeeDetails.adhaarcard = this.empPersonalDetails?.adhaarcard;
          this.employeeDetails.passport = this.empPersonalDetails?.passport;
          this.employeeDetails.higherSecondary = this.empPersonalDetails?.higherSecondary;
          this.employeeDetails.higherStudy = this.empPersonalDetails?.higherStudy;
          this.employeeDetails.secondary = this.empPersonalDetails?.secondary;
          this.employeeDetails.cancelCheque = this.empPersonalDetails?.cancelCheque;
          this.employeeDetails.graduation = this.empPersonalDetails?.graduation;
          this.employeeDetails.bloodGroup = this.empPersonalDetails?.bloodGroup;
          this.employeeDetails.maritalStatus = this.empPersonalDetails?.maritalStatus;
          this.employeeDetails.emergencyContact.name = this.empPersonalDetails?.emergencyContact?.name;
          this.employeeDetails.emergencyContact.phone = this.empPersonalDetails?.emergencyContact?.phone;
          this.employeeDetails.emergencyContact.relation = this.empPersonalDetails?.emergencyContact?.relation;
        }
      }).catch(err => this.alertNotificationService.alertError(err))

    if (this.employee.profileid) {
      this.isInsAccCreated = true;
      this.instructorService.getInstructor(this.employee.profileid).toPromise()
        .then(res => {
          this.selectedUser = res as Instructor;
        }).catch(err => this.alertNotificationService.alertError(err));

    }

  }

  @HostListener('window:beforeunload', ['$event'])
  canDeactivate(event: BeforeUnloadEvent): void {
    if (this.iseditedform == true && this.issavedform == false) {
      if (confirm('You Have unsaved changes that will be lost') == false) {
        event.returnValue = true
      }

    }
  }
  SearchFncode(term: string, item: Countries) {
    term = term.toLowerCase();
    return item.name.toLowerCase().indexOf(term) > -1 || item.code.toLowerCase().indexOf(term) > -1;
  }

  onUpdate() {
    this.employeeService.updateUserProfile(this.employee._id, this.employee).toPromise()
      .then(res => {
      }).catch(err => this.alertNotificationService.alertError(err));

    //emp details start
    let body = {
      emergencyContact: this.employeeDetails.emergencyContact,
      bloodGroup: this.employeeDetails.bloodGroup,
      maritalStatus: this.employeeDetails.maritalStatus,
    }
    this.employeeService.submitPersonalDetails(this.employee._id, body).toPromise()
      .then(res => {
      }).catch(err => this.alertNotificationService.alertError(err));

    if (this.employee.profileid) {
      this.selectedUser.profilecomplete = true
      this.instructorService.updateInstructor(this.selectedUser).toPromise()
        .then(res => {
          this.issavedform = true;
        }).catch(err => this.alertNotificationService.alertError(err));
    } else if (this.isInsAccCreated) {
      this.selectedUser.invid = this.employee.invid;
      this.instructorService.ApplyInstructor(this.selectedUser).toPromise()
        .then(res => {
          this.issavedform = true;
        }).catch(err => this.alertNotificationService.alertError(err));
    }

    this.alertNotificationService.toastAlertSuccess('Profile Updated Successfully')
    this.refreshEmployee();
  }


  pwdReset() {
    if (this.resetpwd.newpwd == this.resetpwd.renewpwd) {
      this.payload._id = String(this.loggedUser._id);
      this.payload.email = String(this.loggedUser.email);
      this.payload.password = this.resetpwd.oldpwd;
      this.payload.newpassword = this.resetpwd.newpwd;
      this.employeeService.changePassword(this.payload).toPromise()
        .then(res => this.alertNotificationService.toastAlertSuccess('Password Updated Successfully'))
        .catch(err => this.alertNotificationService.alertError(err));
    }
    else {
      this.alertNotificationService.alertInfo("Password Not Match");
    }
  }


  dpchange = false
  onFileDropped($event) {
    if ($event.length === 0)
      return
    var mimetype = $event[0].type;
    if (mimetype.match(/image\/*/) == null) {
      this.alertNotificationService.alertInfo('Only images are Supported')
      return
    }

    if ($event[0].size > 307200) {
      this.alertNotificationService.alertInfo('Maximum image size is 300kb')

      return
    }


    var reader = new FileReader();
    reader.readAsDataURL($event[0]);
    reader.onload = (_e) => {
      var image = new Image()
      image.src = reader.result.toString()
      image.onload = (e) => {
        /*var height=image.height
        var width=image.width
        if (height != width){
          this._snackBar.openFromComponent(SnackBarSuccessComponent, {
            duration: 5000,
            data: 'Image dimention should be Square',
          });
          return
        }
        else{
          this.imgurl =reader.result
         // this.imagepath =event.target.files;
          this.imagechange=true
          this.iseditedform=true
          this.dpchange=true
          this.selectedUser.image=this.dates+$event[0].name;
          this.filesToUpload=$event[0]
        }*/
        this.imgurl = reader.result
        // this.imagepath =event.target.files;
        this.imagechange = true
        this.iseditedform = true
        this.dpchange = true
        // this.selectedUser.image = this.dates + $event[0].name;
        this.filesToUpload = $event[0]
        this.fd = new FormData()
        this.fd.append("file", this.filesToUpload, this.filesToUpload['name']);
        this.fd.append("_id", this.employee._id)
        this.employeeService.updateProfilePic(this.fd).toPromise()
          .then(res => {
            this.alertNotificationService.toastAlertSuccess('Image Updated')
          }).catch(err => this.alertNotificationService.alertError(err))
      }
    }
  }

  languages = Languages;
  fileBrowseHandler(event) {
    if (event.target.files.length === 0)
      return
    var mimetype = event.target.files[0].type;
    if (mimetype.match(/image\/*/) == null) {
      this.alertNotificationService.alertInfo('Only images are Supported')
      return
    }
    if (event.target.files[0].size > 307200) {
      this.alertNotificationService.alertInfo('Maximum image size is 300kb')

      return
    }

    var reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = (_e) => {
      var image = new Image()
      image.src = reader.result.toString()
      image.onload = (e) => {
        /*var height=image.height
        var width=image.width
        if (height !=  width ){
          this._snackBar.openFromComponent(SnackBarSuccessComponent, {
            duration: 5000,
            data: 'Image dimention should be Square',
          });
          return
        }
        else{
          this.imgurl =reader.result
          this.imagepath =event.target.files;
          this.imagechange=true
          this.dpchange=true
          this.iseditedform=true
          this.selectedUser.image=this.dates+event.target.files[0].name;
          this.filesToUpload=event.target.files[0]
        }*/
        this.imgurl = reader.result
        this.imagepath = event.target.files;
        this.imagechange = true
        this.dpchange = true
        this.iseditedform = true
        // this.selectedUser.image = this.dates + event.target.files[0].name;
        this.filesToUpload = event.target.files[0]
        this.fd = new FormData()
        this.fd.append("file", this.filesToUpload, this.filesToUpload['name']);
        this.fd.append("_id", this.employee._id)
        this.employeeService.updateProfilePic(this.fd).toPromise()
          .then(res => {
            this.alertNotificationService.toastAlertSuccess('Image Updated')
          }).catch(err => this.alertNotificationService.alertError(err))
      }


    }

  }

  handelQFile(event, q: Qualification) {

    var mimetype = event.target.files[0].type;
    if (mimetype.match(/image\/jpeg/) == null && mimetype.match(/application\/pdf/) == null) {
      this.alertNotificationService.alertInfo('Only Jpeg and Pdf are Supported')
      return
    }
    if (event.target.files[0].size > 307200) {
      this.alertNotificationService.alertInfo('Maximum image size is 300kb')
      return
    }
    console.log(this.filesToUploads)
    this.imagechange = true
    q.file = this.dates + event.target.files[0].name;
    this.filesToUploads.push(<File>event.target.files[0]);
    this.iseditedform = true
  }
  isother = false
  othercountryname: string = "";
  otherstatename: string = "";

  statename = ["Select Country"]
  onChange() {
    if (this.employee.countryCode != "+91") {
      this.isother = true
      this.statename = ["Other"]
      this.employee.state = "Other"
    }
    else {
      this.statename = this.states
      this.isother = false
    }
  }

  isValidFileType(file: File): boolean {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    return allowedTypes.includes(file.type);
  }
  isFileSizeValid(file: File): boolean {
    return file.size <= this.maxFileSize;
  }
  filesize(file: File) {
    if (file.size > 2 * 610 * 787) {
      this.alertNotificationService.alertError("image")
    }
  }

  maxFileSize = 2097152; // 2MB in bytes
  personalFileHandler(event, key, name) {
    if (event.target.files.length === 0)
      return

    const selectedFile = event.target.files[0];
    // var mimetype = event.target.files[0].type;
    var extension = selectedFile.name.split('.').pop().toLowerCase();
    console.log(extension);

    if (selectedFile && this.isValidFileType(selectedFile)) {

      if (selectedFile && this.isFileSizeValid(selectedFile)) {
        var file_name = `${this.employee._id}_${name}.${extension}`;  // file name

        var reader = new FileReader();
        reader.readAsDataURL(event.target.files[0]);
        reader.onload = (_e) => {
          var image = new Image()
          image.src = reader.result.toString()
          image.onload = (e) => {

            if (name == 'Passport_image') {
              var height = image.height
              var width = image.width
              if (height != width) {
                this.alertNotificationService.alertInfo('Image dimention should be Square',
                );
                return;
              }

            }  // for only passport image file

            this.fd = new FormData()
            this.fd.append("document_key", key)
            this.fd.append("employee_id", this.employee._id)
            this.fd.append("documents", selectedFile, file_name);

            this.employeeService.addPersonalDocuments(this.fd).toPromise()
              .then(res => {
                console.log(res)
                this.refreshEmployee();
                this.alertNotificationService.toastAlertSuccess('File Uploaded')
              }).catch(err => this.alertNotificationService.alertError(err))


          }
        }

      }
      else {
        this.alertNotificationService.alertInfo('Maximum image size is 2MB')
        return;
      }
    }
    else {
      this.alertNotificationService.alertInfo('Only images are Supported')
      return;
    }


  }
  view_image(link) {
    // var imageUrl = link;
    window.open(link, '_blank');
  }

}
