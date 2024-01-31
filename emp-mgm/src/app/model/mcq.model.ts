export class Mcq{
    question: string;
    anstype: string;
    quesimg?: string;
    options: Mcqoptions[];
    ans:any;
    explanation?: string;
}

export class Mcqoptions{
    option: string;
    optionimg?: string;
}