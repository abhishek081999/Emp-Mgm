export class LiveMarketClassBooking{
    student_id?:string;
    purchase_id?:string;
    bookingDate?:Date;
    language ?: string;
}

export class LiveMarketPracticeSlots {
    _id?: string;
    start_time?: Date;
    end_time?: Date;
    slot?: string;
    mentor_id?: string;
    webinar_id?:string;
    webinarid?:string;
    mentor_name?:string;
    mentor_invid?:string;
    password?:string;
    licence?:string;
    join_url?:string;
    topic?:string;
    booking_count?: number;
    language ?: string;
}

export class LiveMarketPracticeBookings{
    _id?: string;
    start_time?: Date;
    end_time?: Date;
    slot?: string;
    mentor_id?: string;
    webinar_id?:string;
    webinarid?:string;
    mentor_name?:string;
    mentor_invid?:string;
    password?:string;
    licence?:string;
    join_url?:string;
    topic?:string;
    bookings?:LiveMarketClassBooking;
    student_name?:string;
    student_invid?:string;
    product_name?:string;
    product_code?:string;
}