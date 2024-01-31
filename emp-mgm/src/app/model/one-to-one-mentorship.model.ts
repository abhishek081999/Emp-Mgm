export class MentorshipSlotLists {
    start_min?: number;
    end_min?: number;
    slot?: string;
    group?: string;
    language ?: string;
}

export class MentorshipSlots {
    _id?: string;
    start_time?: Date;
    end_time?: Date;
    slot?: string;
    mentor_id?: string;
    isBooked?: boolean;
    bookedBy?: string;
    purchase_id?: string;
    bookingDate?:Date;
    mentor_name?:string;
    webinar_id?:string;
    webinarid?:string;
    mentor_invid?:string;
    password?:string;
    licence?:string;
    join_url?:string;
    topic?:string;
    video_url?:string;
    product_code?: string;
    product_name?: string;
    language ?: string;
}


export class BookedMentorshipDisplay {
    student_name?: string;
    student_invid?: string;
    purchase_date?: Date;
    expiry_date?: Date;
    product_code?: string;
    product_name?: string;
    _id?: string;
    bookedBy?: string;
    slotBooked?: number;
    videoUploaded?: number;
    pendingVideoUpload?: number;
    completedSessions?: number;
    upcomingSessions?: number;
}

export class BookedMentorshipDetails {
    student_name?: string;
    student_invid?: string;
    purchase_date?: Date;
    expiry_date?: Date;
    product_code?: string;
    product_name?: string;
    _id?: string;
    bookedBy?: string;
    sessions?: MentorshipSlots[];
}