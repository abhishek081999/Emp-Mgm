import { Answer } from './answer.model';

export class Discussion{
    _id:string;
    courseid:string;
    coursename:string;
    date:Date;
    askby:string;
    askby_id:string;
    askbyroll:string;
    qtitle: string;
    qdetails: string;
    adminshow:Boolean;
    studentshow:Boolean;
    instructorshow:Boolean;
    instructor_id:string;
    reply: {
        [key: number]: Answer;
    };
    image:string;
    productid?:string;
    productname?:string;
}