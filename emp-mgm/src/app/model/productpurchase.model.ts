import { Productpurchase } from "./package.model";

export class ProductSubscriptionView {
    id?: string;
    purchase_history?: Productpurchase[];
    total_revenue?: number;
    total_due?: number;
    gst?: number;
    expiry_date?: Date;
    isexpired?: boolean;
    studentinvid?: string;
    studentname?: string;
    last_purchase?: Date;
    product_name?: string;
    number_of_purchase?: number;
    studentid?: string;
    productid?: string;
    product_code?: string;
    net_revenue?: number;
    status?: string;
    last_staff_id?: string;
    last_staff_name?: string;
    product_type?: string;
}