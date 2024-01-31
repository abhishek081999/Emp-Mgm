import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BloodGroups, EmailRegex, EmployeeType, MaritalStatus, Relations } from 'src/app/Enums/staticdata';
import { Department, Designation, Employee, EmployeeDetails, Team } from 'src/app/model/employee.model';
import { Roles } from 'src/app/model/roles.model';
import { Countries } from 'src/app/model/user.model';
import { AlertNotificationsService } from 'src/app/services/alert-notifications.service';
import { AttendanceService } from 'src/app/services/attendance.service';
import { EmployeeService } from 'src/app/services/employee.service';
import { LeadsService } from 'src/app/services/leads.service';
import { OnboardingService } from 'src/app/services/onboarding.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-employee-details',
  templateUrl: './employee-details.component.html',
  styleUrls: ['./employee-details.component.scss']
})
export class EmployeeDetailsComponent implements OnInit {
  districts: any;
  policyType;
  statewisedistricts: any;
  countries: Countries[] = [];
  departments: Department[] = [];
  teams: Team[] = [];
  allRoles: Roles[] = [];
  allEmployee: Employee[] = [];
  designations: Designation[] = [];
  states = [];
  allocation;
  manager: Employee[] = [];
  hr: Employee[] = [];
  TeamsDrop
  ApproverDrop
  DesignationDrop
  empType = EmployeeType;
  Marital = MaritalStatus

  empPersonalDetails = new EmployeeDetails(); // get the personal details
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
  AllocationDetails: Employee = {
    role: null,
    designation_id: null,
    Manager: null,
    Approver: null,
    Hr: null,
    department_id: null,
    team_id: null,
    employeeType: null,
    isActive: false
  }
  bloodGroups = BloodGroups;

  Relation = Relations

  constructor(
    private employeeService: EmployeeService,
    private alertNotificationService: AlertNotificationsService,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private userService: UserService,
    private attendanceService: AttendanceService,
    private onboardingService: OnboardingService,
    private leadsService: LeadsService) { }
  invid
  employee = new Employee();
  address = '';
  emailRegex = EmailRegex;
  async ngOnInit() {
    await this.route.paramMap.subscribe(params => {
      this.invid = params.get('id');
      this.refreshEmployee();
    });
    await this.attendanceService.getPolicylist().toPromise()
      .then(res => {
        this.policyType = res;
        this.policyType = this.policyType.filter(e => e.is_active);
      }).catch(err => this.alertNotificationService.alertError(err));
    await this.refresh();



  }

  refresh() {
    this.userService.getCountryCode().toPromise()
      .then(res => {
        this.countries = res as Countries[];
      }).catch(err => this.alertNotificationService.alertError(err))

    this.leadsService.getstatewisedistrict().toPromise()
      .then(res => {
        this.statewisedistricts = res
        this.states = this.statewisedistricts.map(e => e.state).sort()
      }).catch(err => this.alertNotificationService.alertError(err))

    this.employeeService.getAllEmployees('all', null, null).toPromise()
      .then(res => {
        this.allEmployee = res as Employee[];
        this.allEmployee = this.allEmployee.filter(e => e.isActive)//&& e.employeeType == EmployeeType.Full_Time
        // console.log(this.allEmployee);
        this.hr = this.allEmployee.filter(e => e.department == Departments.Hr);

        if (this.AllocationDetails.department_id) {
          this.manager = this.allEmployee.filter(e => e.department_id == this.employee.department_id || e.role == 'admin');
          this.ApproverDrop = this.allEmployee.filter(e => e.department_id == this.employee.department_id || e.role == 'admin');
        }  // onload manager load
        // console.log(this.manager)
      }).catch(err => this.alertNotificationService.alertError(err))

    this.employeeService.getAllDepartment('all').toPromise()
      .then(res => {
        this.departments = res as Department[];
      }).catch(err => this.alertNotificationService.alertError(err))

    this.employeeService.getAllTeams('all', null).toPromise()
      .then(res => {
        this.teams = res as Team[];
        if (this.AllocationDetails.department_id) {
          this.TeamsDrop = this.teams.filter(e => e.department_id == this.employee.department_id);

        }

      }).catch(err => this.alertNotificationService.alertError(err))

    this.employeeService.getAllDesignation('all').toPromise()
      .then(res => {
        this.designations = res as Designation[];

        if (this.AllocationDetails.department_id) {
          this.DesignationDrop = this.designations.filter(e => e.department_id == this.employee.department_id);

        }
      }).catch(err => this.alertNotificationService.alertError(err))

    this.employeeService.getallrole().toPromise()
      .then(res => {
        this.allRoles = res as Roles[]
      }).catch(err => this.alertNotificationService.alertError(err))



  }

  async refreshEmployee() {
    await this.employeeService.getEmployeeProfile(this.invid, 'all').toPromise()
      .then(res => {
        this.employee = res;
        if (!this.employee.countryCode) {
          this.employee.countryCode = '+91'  //by default 
        }
        this.profilePictureUrl = this.employee.profile_image;
        if (this.employee) {
          this.address = `${this.employee.address}, ${this.employee.city}, ${this.employee.pincode}, ${this.employee.state}`;
          this.AllocationDetails.Hr = this.employee.Hr;
          this.AllocationDetails.Approver = this.employee.Approver;
          this.AllocationDetails.role = this.employee.role;
          this.AllocationDetails.designation_id = this.employee.designation_id;
          this.AllocationDetails.Manager = this.employee.Manager;
          this.AllocationDetails.department_id = this.employee.department_id;
          this.AllocationDetails.team_id = this.employee.team_id;
          this.AllocationDetails.employeeType = this.employee.employeeType;
          this.AllocationDetails.leave_policy = this.employee.leave_policy;
          this.AllocationDetails.isActive = this.employee.isActive;
        }

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
  }
  selectManager(id) {
    if (id && this.allEmployee) {
      this.manager = this.allEmployee.filter(e => e.department_id == id || e.role == 'admin');
      this.AllocationDetails.Manager = null
      this.AllocationDetails.designation_id = null
      this.AllocationDetails.team_id = null
      this.AllocationDetails.Approver = null
      this.ApproverDrop = this.allEmployee.filter(e => e.department_id == id || e.role == 'admin');
      this.TeamsDrop = this.teams.filter(e => e.department_id == id);
      this.DesignationDrop = this.designations.filter(e => e.department_id == id);
    }
  }  // manager teams and designation drop on change

  async changePassword(u) {
    await Swal.fire({
      title: 'Enter New Password',
      inputAutoTrim: true,
      input: 'password',
      inputLabel: 'New Password',
      inputPlaceholder: 'Enter New Password',
      inputAttributes: {
        autocomplete: 'new-password',
        autofill: 'off'
      }
    }).then(res => {
      if (res.value) {
        var data = {
          _id: u._id,
          newpassword: res.value
        }
        this.employeeService.changePassword(data).toPromise()
          .then(res => {
            this.alertNotificationService.toastAlertSuccess('Employee Password Updated');
          }).catch(err => this.alertNotificationService.alertError(err));
      }
    })
  }

  dpchange = false
  profilePictureUrl
  imagepath
  iseditedform = false
  issavedform = false
  imagechange = false;
  dates = ''
  filesToUpload: File;
  fd = new FormData();

  onFileDropped(event) {
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
        this.profilePictureUrl = reader.result
        this.imagepath = event.target.files;
        this.imagechange = true
        this.dpchange = true
        this.iseditedform = true
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




  ///peronsal document code below



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


  /// personal document code end

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
        this.profilePictureUrl = reader.result
        this.imagepath = event.target.files;
        this.imagechange = true
        this.dpchange = true
        this.iseditedform = true
        this.filesToUpload = event.target.files[0]
        this.fd = new FormData()
        this.fd.append("file", this.filesToUpload, this.filesToUpload['name']);
        this.fd.append("_id", this.employee._id)
        this.employeeService.updateProfilePic(this.fd).toPromise()
          .then(res => {
            console.log(res)
            this.alertNotificationService.toastAlertSuccess('Image Updated')
          }).catch(err => this.alertNotificationService.alertError(err))
      }
    }
  }
  view_image(link) {
    // var imageUrl = link;
    window.open(link, '_blank');
  }

  imagechangee = false

  handelFileInput(event) {
    this.imagechangee = true
    this.filesToUpload = <File>event.target.files[0];
  }

  editEmployee = new Employee();
  edit(data, component) {
    this.editEmployee = data
    this.onstateChange();
    this.modalService.open(component, { size: 'xl', scrollable: true }).result
      .then(resp => {
        if (resp == 'Save') {
          this.alertNotificationService.alertChanges()
            .then(result => {
              if (result.isConfirmed) {
                this.employeeService.updateUserProfile(this.editEmployee._id, this.editEmployee).toPromise()
                  .then(res => {
                    this.alertNotificationService.toastAlertSuccess('Student Profile Updated');
                    this.refreshEmployee()
                  }).catch(err => this.alertNotificationService.alertError(err));
              }
            })
        }
      }).catch(err => this.alertNotificationService.alertError(err));
  }


  onstateChange() {
    if (this.editEmployee && this.editEmployee.state) {
      this.districts = this.statewisedistricts.filter(e => e.state == this.editEmployee.state)[0].districts;
      if (!this.districts.includes(this.editEmployee.city)) {
        this.editEmployee.city = ''
      }
    } else {
      this.districts = []
    }
  }

  SearchFncode(term: string, item: Countries) {
    term = term.toLowerCase();
    return item.name.toLowerCase().indexOf(term) > -1 || item.code.toLowerCase().indexOf(term) > -1;
  }

  submitAllocation(event) {
    let data = {
      _id: this.employee._id,
      Hr: this.AllocationDetails.Hr,
      Manager: this.AllocationDetails.Manager,
      Approver: this.AllocationDetails.Approver,
      designation_id: this.AllocationDetails.designation_id,
      department_id: this.AllocationDetails.department_id,
      team_id: this.AllocationDetails.team_id,
      employeeType: this.AllocationDetails.employeeType,
      Role: this.AllocationDetails.role,
      leave_policy: this.AllocationDetails.leave_policy,
      isActive: this.AllocationDetails.isActive,
    }
    this.employeeService.submitAllocation(data).toPromise()
      .then(res => {
        this.alertNotificationService.toastAlertSuccess('Submit Succesfully');
      }).catch(err => this.alertNotificationService.alertError(err));
  }


  submitPersonalDetails(e) {
    let body = {
      emergencyContact: this.employeeDetails.emergencyContact,
      bloodGroup: this.employeeDetails.bloodGroup,
      maritalStatus: this.employeeDetails.maritalStatus,
    }
    this.employeeService.submitPersonalDetails(this.employee._id, body).toPromise()
      .then(res => {
        this.alertNotificationService.toastAlertSuccess('Submit Succesfully');
      }).catch(err => this.alertNotificationService.alertError(err));
  }

  StaffSearchFn(term: string, item: Employee) {
    term = term.toLowerCase();
    return item.fullName.toLowerCase().indexOf(term) > -1 || item.invid.toLowerCase().indexOf(term) > -1;
  }

// --------> Off-Boarding 

  OffBoarding() {
    this.alertNotificationService.alertCustomMsg('Are you sure you want to Off-Boarding the Employee ?')
    .then(result => {
      if (result.isConfirmed) {
        var data = {
          employee_id:this.employee._id,
          department_id:this.employee.department_id
        }
        this.onboardingService.postOffboardingtask(data).toPromise()
        .then(res => {
          this.alertNotificationService.toastAlertSuccess('Off-Employee Task Created Successfully');
        }).catch(err => this.alertNotificationService.alertError(err))
    
      }
    })
   
  }
}
