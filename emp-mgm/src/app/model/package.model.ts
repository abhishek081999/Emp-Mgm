export class Package {
    _id: string;
    name: string;
    image: string;
    url: string;
    price: number;
    validity: number;
    productid: string;
    approve: boolean;
}

export class Productpurchase {
    _id: string;
    studentinvid: string;
    studentname: string;
    studentid: string;
    price: number;
    validity: number;
    productid: string;
    pruchasedate: Date;
    due: number;
    active: boolean;
    registrationid: string;
    coupon: string;
    gst?: number;
    isexpired?: boolean;
    expiry_date?: Date;
    isAddon: boolean;
}

export class ProductpurchaseHistory {
    _id: string;
    due: number;
    active: boolean;
    price: number;
    productid: string;
    pruchasedate: Date;
    studentid: string;
    studentinvid: string;
    studentname: string;
    validity: number;
    coupon: string;
    isexpired?: boolean;
    expiry_date?: Date;
    net_revenue?: number;
    status?: string;
    product_name?: string;
    product_code?: string;
    phone?: string;
    staff_name?: string;
    staff_id?: string;
    registrationid: string;
    gst?: number;
}

export class PendingProductBookings {
    _id?: string;
    phone?: string;
    whatsapp?: string;
    studentname?: string;
    studentinvid?: string;
    studentid?: string;
    productid?: string;
    product_name?: string;
    product_type?: string;
    pruchasedate?: Date;
    no_of_sessions?: number;
    bookings?: number;
    product_id?: string;
    expiry_date?: Date;
}

export class sendMarketResearch {
    _id?: string;
    details?: string;
    type?: string;
    image?: string[];
    video?: string;
    reaction?: any[];
    approved?: boolean;
    language?: string;
    category?: string;
    created_date?: Date;
    created_by?: string;
    approved_date?: Date;
    approved_by?: string;
    schedule_time?: Date;
    isEdited?: boolean;
    options?: any[];
    voting_count?: number;
}

export class sendWealthInsights {
    _id?: string;
    details?: string;
    type?: string;
    image?: string[];
    video?: string;
    reaction?: any[];
    approved?: boolean;
    language?: string;
    category?: string;
    created_date?: Date;
    created_by?: string;
    approved_date?: Date;
    approved_by?: string;
    schedule_time?: Date;
    isEdited?: boolean;
    options?: any[];
    voting_count?: number;
}