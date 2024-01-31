import { Mcq } from './mcq.model';

export class Quiz{
    _id?: string;
    quizid:string;
    quizname: string;
    time: number;
    teacherid: string;
    teachername: string;
    numberofattempt: number;
    totalmarks: number;
    passingmarks: number;
    type: string; // evaluationtest,quizgame
    approved:boolean;
    mcqs: Mcq[]
}