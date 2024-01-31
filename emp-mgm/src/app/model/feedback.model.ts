import { Feedbackquestion } from './feedbackquestion.model';

export class Feedback {
    _id?: string;
    CourseName?: string;
    CourseCode?: string;
    StudentInvID?: string;
    StudentName?: string;
    StudentEmail?: string;
    StudentMobile?: string;
    InstructorInvID?: string;
    InstructorName?: string;
    date?: Date;
    feedback?: Feedbackquestion;
    avgrating?: number;
    adminshow?: Boolean;
    instructorshow?: Boolean;
    sendtoinstructor?: Boolean;
    replydate?: Date;
    reply?: string;
    instructorreplied?: Boolean;
    Instructors?: any[]
    instructorid?: string;
}

