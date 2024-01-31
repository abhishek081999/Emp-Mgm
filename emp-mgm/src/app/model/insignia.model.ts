
export class Insignia {
    _id: string;
    introvideo: string;
    name: string;
    code: string;
    price: number;
    discountedprice: number;
    duration: string;
    picture: string;
    description: string;
    category: {
        [key: number]: string;
    };
    instructors: {
        [key: number]: string;
    };
    validity: number;
    approved: Boolean;
    subscription: string;
    language: string;
    crosssale: {
        [key: number]: string;
    };
    audience: {
        [key: number]: string;
    };
    benefits: {
        [key: number]: string;
    };
    batchtime: string;
    brochure: string;
    upcoming: Boolean;
    paymentmethodtwo: Boolean;
    paymentmethodthree: Boolean;
    paymentmtwo: {
        date: number;
        totalamount: number;
        firstamount: number;
        secondamount: number;
    }
    paymentmthree: {
        firstdate: number;
        seconddate: number;
        totalamount: number;
        firstamount: number;
        secondamount: number;
        thirdamount: number;
    }
    disable: Boolean;
    sidepanel?: {
        title: string;
        details: string[];
    };
    emiavailable?: boolean;
    bundle: Ibundle[];
    isCustomCreated: boolean;
    short_code?: string;
    min_selling_price?: number;
    paymentmethodfour?: boolean;
    paymentmfour?: {
        firstdate: number;
        seconddate: number;
        thirddate: number;
        totalamount: number;
        firstamount: number;
        secondamount: number;
        thirdamount: number;
        forthamount: number;
    }
};
export class Ibundle {
    id: string;
    itemType: string;
    defaultAccess: boolean;
    FullpaymentAccess: boolean;
    itemPrice: number;
    accessDate: number;
}


export class InsigniaItem {
    _id: string;
    type: string;
    name: string;
    itemType: string;
    defaultAccess: boolean;
    FullpaymentAccess: boolean;
    itemPrice: number;
    accessDate: number;
}

export class InsigniaRegistration {
    _id: string;
    student_id: string;
    insignia_id: string;
    reg_date: Date;
    exp_date: Date;
    is_expired: boolean;
    items: any[]
    payment_complete: boolean;
    temporarybanned: boolean;
}

export class InsigniaRegistrationDisp {
    _id?: string;
    invid: string;
    student_name?: string;
    phone?: string;
    whatsapp_number?: string;
    telegram_number?: string;
    name?: string;
    couponcode?: string;
    student_id: string;
    insignia_id: string;
    reg_date: Date;
    exp_date: Date;
    is_expired: boolean;
    payment_complete: boolean;
    bookedamount?: number;
    due?: number;
    paymentreceived?: number;
    gst?: number;
    code?: string;
    status?: string;
    items?: InsigniaItem[];
    paymentmode?: string;
    temporarybanned: boolean;
    onboarding_date?: Date;
}