import { Qualification } from './qualification.model';

export class Instructor{
    _id:string;
    invid:string;
    //personalinfo
    image:string;
    fullName: string;
    email: string;
    telephone: string;
    alternativenumber: string;
    address: string;
    city: string;
    pincode: string;
    role: string;
    language: {
        [key: number]: string;
    };
    //qualification
    qualification?:{
        [key: number]: Qualification;
    };
    bio:string;
    specialization:{
        [key: number]: string;
    };
    cv:string;
    
    trainingtype:string;
    democlass:string;
    dob:Date;
    experience:string;
    activeinmarket:string;
    state:string;
    country:string;
    //after registration
    //social
    facebook:string;
    instagram:string;
    twitter:string;
    linkdin:string;

    //instructor course details
    numberofonlinecourses:number;
    numberoflivecourses:number;
    numberofstudents:number;
    rating:number;

    //adminwork
    approved:Boolean;
    rejected:Boolean;
    profilecomplete:Boolean;
    agreed:Boolean;
    agreement:string;
    deactivate:Boolean;
}