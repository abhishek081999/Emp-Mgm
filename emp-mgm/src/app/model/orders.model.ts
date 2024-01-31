export class Orders {
    _id?: string;
    orderID?: number;
    student_id?: string;
    status?: string;
    order_date?: Date;
    coupon_code?: string;
    payment_mode?: string;
    total_amount?: number;
    sales_rep?: string;
    isInvescashUsed?: boolean;
    invescashAmount?: number;
    original_amount?: number;
    total_discount?: number;
    notes?: string;
    is_refunded?: boolean;
    is_shortClosed?: boolean;
    is_saved?: boolean;
    is_submitted?: boolean;
    is_Error?: boolean;
    lead_id?: string;
    isGstBillRequired?: boolean;
}

export class OrderLines {
    _id?: string;
    orderID?: number;
    item_type?: string;
    item_id?: string;
    amount?: number;
    item_code?: string;
    item_name?: string;
    original_amount?: number;
    preferred_ins_id?: string;
    subscription_days?: number;
    mode_available?: string[];
    registration_id?: string;
}

export class OrderInstallments {
    _id?: string;
    orderID?: number;
    installment_number?: number;
    installment_date?: Date;
    installment_amount?: number;
    is_Paid?: boolean;
    sgst?: number;
    igst?: number;
    cgst?: number;
    sales_rep?: string;
    additional_charges?: number;
    txnid?: string;
    payment_method?: string;
    payment_date?: Date;
    is_verified?: boolean;
    utr_no?: string;
    settelmentID?: string;
    settlementDate?: Date;
    invoice_number?: string;
    payment_link_id?: string;
}

export class OrderHistory {
    _id?: string;
    orderID?: number;
    date?: Date;
    modified_by?: string;
    isError?: boolean;
    isWarning?: boolean;
    isSuccess?: boolean;
    status?: string;
    activity?: string;
}

export class RequestAdjustment {
    _id?: string;
    orderID?: number;
    total_amount?: number;
    original_amount?: number;
    total_discount?: number;
    prev_total_amount?: number;
    prev_original_amount?: number;
    prev_total_discount?: number;
    orderLines?: RequestAdjustmentLines[];
    orderInstallments?: RequestAdjustmentInstallments[];
    requestDate?: Date;
    requestedBy?: string;
    approvedBy?: string;
    approveDate?: Date;
    isApproved?: boolean;
    requestReason?: string;
    comments?: string;
    state?: string;
    approvedBy_invid?: string;
    approvedBy_name?: string;
}

export class RequestAdjustmentLines {
    orderLineID?: string;
    item_type?: string;
    item_id?: string;
    amount?: number;
    prev_amount?: number;
    item_code?: string;
    item_name?: string;
    original_amount?: number;
    prev_original_amount?: number;
}

export class RequestAdjustmentInstallments {
    orderInstallmentID?: string;
    installment_number?: number;
    installment_amount?: number;
    prev_installment_amount?: number;
    sgst?: number;
    prev_sgst?: number;
    igst?: number;
    prev_igst?: number;
    cgst?: number;
    prev_cgst?: number;
    additional_charges?: number;
    prev_additional_charges?: number;
    is_Paid?: boolean;
    is_verified?: boolean;
}

export class RequestBatchChange {
    _id?: string;
    orderID?: number;
    orderLineID?: string;
    item_type?: string;
    item_code?: string;
    prev_item_code?: string;
    item_name?: string;
    prev_item_name?: string;
    item_id?: string;
    prev_item_id?: string;
    requestDate?: Date;
    requestedBy?: string;
    approvedBy?: string;
    approveDate?: Date;
    isApproved?: boolean;
    requestReason?: string;
    comments?: string;
    approvedBy_invid?: string;
    approvedBy_name?: string;
}

export class PaymentLinks {
    amount?: number;
    description?: string;
    customer?: {
        name?: string,
        email?: string,
        contact?: string
    };
    orderID?: number;
    installment_number?: number;
    upi_link?: boolean;
    id?: string;
    created_at?: Date;
    short_url?: string;
    status?: string;
}