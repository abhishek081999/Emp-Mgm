export class Invesmentor {
    _id?: string;
    name?: string;
    code?: string;
    price?: number;
    discountedprice?: number;
    duration?: string;
    image?: string;
    description?: string;
    validity?: number;
    approved?: boolean;
    language?: string;
    disable?: boolean;
    bundle?: Ibundle[];
    short_code?: string;
    min_selling_price?: number;
    addOns?: string[];
    upgrades?: string[];
};

export class Ibundle {
    id?: string;
    itemType?: string;
    defaultAccess?: boolean;
    FullpaymentAccess?: boolean;
    itemPrice?: number;
    accessDate?: number;
}


export class InvesmentorItem {
    _id?: string;
    type?: string;
    name?: string;
    itemType?: string;
    defaultAccess?: boolean;
    FullpaymentAccess?: boolean;
    itemPrice?: number;
    accessDate?: number;
    language: string;
}

export class InvesmentorRegistration {
    _id?: string;
    student_id?: string;
    invesmentor_id?: string;
    reg_date?: Date;
    start_date?: Date;
    exp_date?: Date;
    is_expired?: boolean;
    items?: any[]
    payment_complete?: boolean;
    temporarybanned?: boolean;
}

export class InvesmentorRegistrationDisp {
    _id?: string;
    invid?: string;
    student_name?: string;
    phone?: string;
    whatsapp_number?: string;
    telegram_number?: string;
    name?: string;
    couponcode?: string;
    student_id?: string;
    invesmentor_id?: string;
    reg_date?: Date;
    start_date?: Date;
    exp_date?: Date;
    is_expired?: boolean;
    payment_complete?: boolean;
    bookedamount?: number;
    due?: number;
    paymentreceived?: number;
    gst?: number;
    code?: string;
    status?: string;
    items?: InvesmentorItem[];
    paymentmode?: string;
    temporarybanned?: boolean;
}