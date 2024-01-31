export class Refunds {
    _id?: string;
    orderID?: number;
    studentinvid: string;
    studentname: string;
    code: string;
    name: string;
    amount: number;
    remarks?: string;
    refundtype?: string;
    phone?: string;
    email?: string;
    isApproved?: boolean;
    comment?: string;
    approveDate?: Date;
    refund_complete_by?: string;
    refund_complete_date?: Date;
    refund_txn_id?: string;
    requestDate?: Date;
    requestBy_invid?: string;
    requestBy_name?: string;
    approvedBy_invid?: string;
    approvedBy_name?: string;
}

export class RefundRequest {
    _id?: string;
    orderID?: number;
    remarks?: string;
    refundtype?: string;
    refund_txn_id?: string;
    refund_complete_date?: Date;
    isApproved?: boolean;
    comments?: boolean;
    requestDate?: Date;
    approvedBy?: string;
    approveDate?: Date;
    requestBy?: string;
    amount?: number;
    approvedBy_invid?: string;
    approvedBy_name?: string;
}