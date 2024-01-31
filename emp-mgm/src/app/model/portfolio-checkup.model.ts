import { Lessonsection } from "./lessonsection.model";

export class PortfolioCheckup {
    _id?: string;
    purchase_id?: string;
    student_id?: string;
    product_id?: string;
    risk_capacity?: string;
    portfolio_stocks: PortfolioCheckupStocks[];
    reply: Lessonsection[] // display this when mentor reply, initially it is hidden when reply is blank
    visible: boolean;
    mentor_id?: string;
    isEditable?: boolean;
    isReplied?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    createdBy?: string;
    updatedBy?: string;
    student_name?: string;
    student_invid?: string;
    product_name?: string;
    product_code?: string;
    purchase_date?: Date;
    mentor_name?: string;
    mentor_invid?: string;
    expiry_date?: Date;
    no_of_stocks?: number;
    maximum_no_stocks?: number;
    validated?: number;
    pending?: number;
    notes?: string;
    IsDownloadEnable?: boolean; //download buttun is visible if it's return true

}

export class PortfolioCheckupStocks {
    stock_name?: string;
    exchange?: string;
    holding_for?: string;
    holding_qty?: number;
    buying_price?: number;
    ltp?: number;
    invested_amount?: number; // auto calculated (invested_amount =  holding_qty * buying_price )
    query?: string;
    fundamentalReply?:string;
    technicalReply?:string;
    reply?: string; // display this when mentor reply, initially it is hidden when reply is blank
    isValidated?: boolean;
    IsStudentVisibility?: boolean; //Replies are visible if it is true
}