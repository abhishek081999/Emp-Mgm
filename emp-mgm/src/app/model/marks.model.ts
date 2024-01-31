export class Marks{
  _id?:string;
  quizid?:string;
  studentid?:string;
  courseid?:string;
  quiztype?:string;
  totalmarks?:number;
  passingmarks?:number;
  marks?:number;
  remarks?:string;
  plagcount?:number;
  attemptleft?:number;
  date?:Date;
}

export class Marksdata{
  quizid?:string;
  quizcode?:string
  studentid?:string;
  name?:string;
  invid?:string;
  phone?:string;
  email?:string;
  courseid?:string;
  coursecode?:string;
  quiztype?:string;
  totalmarks?:number;
  passingmarks?:number;
  marks?:number;
  remarks?:string;
  date?:Date;
}