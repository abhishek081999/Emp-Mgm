export class Review {
    _id:string;
    name:string;
    studentid:string;
    courseid:string;
    // teacherid:string;
    registrationid:string;
    rating:number;
    review:string;
    teacherrating:number;
    date:Date;
    verified:Boolean;
    coursecode:string;
    productid?:string;
}

export class ReviewDisplay {
    _id?:string;
    student_name?:string;
    studentid?:string;
    student_invid?:string;
    // teacher_name?:string;
    // teacher_invid?:string;
    name?:string;
    courseid?:string;
    // teacherid?:string;
    registrationid?:string;
    rating?:number;
    review?:string;
    teacherrating?:number;
    date?:Date;
    verified?:Boolean;
    code?:string;
    productid?:string;
}