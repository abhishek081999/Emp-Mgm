import { Lesson } from "./lesson.model";

export class Course {
    _id?: string;
    introvideo?: string;
    coursename?: string;
    short_name?: string;
    coursecode?: string;
    courseprice?: number;
    discountedprice?: number;
    courseduration?: string;
    teachername?: string;
    coursepicture?: string;
    coursedescription?: string;
    coursecategory?: string[]
    lesson?: Lesson[];
    coursevalidity?: number;
    coursetype?: string;
    rating?: number;
    numberofrating?: number;
    numberofstudents?: number;
    approved?: boolean;
    submittedby?: string[];
    coursestartdate?: Date;
    coursepackage?: string;
    max_student?: number;
    coursesubscription?: string;
    courselanguage?: string;
    crosssale?: string[]
    upsale?: string[]
    audience?: string[]
    benefits?: string[]
    numberoflesson?: number;
    batchtime?: string;
    brochure?: string;
    upcoming?: boolean;

    //payments
    paymentmethodtwo?: boolean;
    paymentmtwo?: {
        date?: Date;
        totalamount?: number;
        firstamount?: number;
        secondamount?: number;
    }
    paymentmethodthree?: boolean;
    paymentmthree?: {
        firstdate?: Date;
        seconddate?: Date;
        totalamount?: number;
        firstamount?: number;
        secondamount?: number;
        thirdamount?: number;
    }
    paymentmethodfive?: boolean;
    paymentmfive?: {
        date?: Date;
        totalamount?: number;
        firstamount?: number;
        secondamount?: number;
    }
    disable?: boolean;
    sidepanel?: {
        title?: string;
        details?: string[];
    };
    emiavailable?: boolean;
    market_research_category?: string[];
    min_selling_price?: number;
    short_code?: string;
    course_level?: string;
    batch_duration?: number;
};

export class courseschedule {
    _id?: string;
    coursetype?: string;
    coursestartdate?: Date;
    numberofclasses?: number;
    courseduration?: string;
    day1?: number;
    day2?: number;
    day1timeslots?: string;
    day2timeslots?: string;
    room?: string;
    alldates?: classtimes[];
    courseid?: string;
    instructorid?: string;
    approved?: boolean;
    classperweek?: number;
    language?: string;
}

export class classtimes {
    date?: Date;
    time?: string;
}


export class Bookedtimes {
    date?: Date;
    time?: string;
    count?: number;
}

export class Bookeddates {
    PaidLiveClass?: Bookedtimes[];
    FreeLiveClass?: Bookedtimes[];
}


export class Scheduledata {
    _id?: string;
    start_time?: Date;
    end_time?: Date;
    approved?: boolean;
    service_name?: string;
    service_code?: string;
    service_start_date: Date;
    instructor_name?: string;
    instructor_id?: string;
    service_type?: string;
    webinar_id?: string;
    webinar_password?: string;
    join_url?: string;
    account?: string;
    type?: string;
    language?: string;
    service_id?: string;
    class_number?: number;
}

export class Holiday {
    _id?: string;
    date?: Date;
    title?: string;
    type?: string;
}

export class ClassTimings {
    _id?: string;
    class_date?: string;
    start_slot?: number;
    end_slot?: number;
    start_time?: Date;
    end_time?: Date;
    instructor_id?: string;
    licence?: string;
    course_id?: string;
    approved?: boolean;
}

export class PostponeSchedules {
    _id?: string;
    schedule_id?: string;
    class_date?: string;
    start_slot?: number;
    end_slot?: number;
    start_time?: Date;
    end_time?: Date;
    instructorid?: string;
    licenceid?: string;
    course_id?: string;
    approved?: boolean;
    postpone_class_date?: string;
    postpone_start_slot?: number;
    postpone_end_slot?: number;
    postpone_start_time?: Date;
    postpone_end_time?: Date;
    postpone_instructor_id?: string;
    postpone_licence_id?: string;
    postpone_reason?: string;
    postpone_reason_type?: string;
    announcement_reason?: string;
    type?: string;
    sendNotification?: boolean;
}
