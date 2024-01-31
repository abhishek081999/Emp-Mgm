export class Jobs {
    _id?:string;
    jobid:string;
    title:string;
    company:string;
    experience:string;
    salary:string;
    location:string;
    details:string;
    image:string;
    publishdate:Date;
    active:boolean;
    sheild:boolean;
}

export class Jobapplication {
    _id?:string;
    jobid:string;
    job_id:string;
    studentid:string
    date:Date;
}

export class Jobdata{
    jobid:string;
    invid: string;
    fullName: string;
    email: string;
    telephone: string;
    address: string;
    city: string;
    pincode: string;
    gender?:string;
    qualification?:string;
    dob?:string;
    state?:string;
    cv?:string;
    alternatenumber?:string;
    applicationdate:string;
}