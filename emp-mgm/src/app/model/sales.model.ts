export class Sellsreport {
    bookedamount?: number;
    paymentreceived?: number;
    due?: number;
    employeeid?: string;
    employeename?: string;
    role?: string;
    month?: string;
    gst?: number;
    team_id?: string;
}

export class Teamsellsreport {
    bookedamount?: number;
    paymentreceived?: number;
    due?: number;
    teamname?: string;
    teamlead?: string;
    teamleadname?: string;
    month?: string;
    gst?: number;
}

export class Sellslist {
    sales_rep?: string;
    sales_rep_name?: string;
    employeeid?: string;
    student_invid?: string;
    student_name?: string;
    phone?: string;
    whatsapp?: string;
    servicecode?: string;
    serviceitem?: string;
    order_date?: Date;
    total_amount?: number;
    payment_received?: number;
    total_gst?: number;
    total_additional_charges?: number;
    total_due?: number;
    coupon?: string;
    payment_mode?: string;
    status?: string;
    inactive?: boolean;
    banned?: boolean;
    shortclosed?: boolean;
    sellsid?: string;
    role?: string;
    batchstartdate?: Date;
    installments: installmentlist[];
}

export class installmentlist {
    _id?: string;
    installment_number: number;
    installment_date: Date;
    installment_amount: number;
    is_Paid: boolean;
    additional_charges: number;
    is_verified: boolean;
    gst: number;
    installments: any;
}


export class PendingPayments {
    registrationcost?: number;
    coursecode?: string;
    coursename?: string;
    paymentcomplete?: boolean;
    paymentmode?: string;
    fullName?: string;
    telephone?: string;
    whatsapp?: string;
    email?: string;
    invid?: string;
    secondinsamount?: number;
    thirdinsamount?: number;
    secondinsstatus?: boolean;
    thirdinsstatus?: boolean;
    secondinsdate?: Date;
    thirdinsdate?: Date;
    shortclose?: boolean;
    banned?: boolean;
    empname?: string;
    empid?: string;
    due?: number;
}