export class Carts{
    _id?:string;
    device_id?:string;
    total_cart_price?:number;
    course_price?:number;
    product_price?:number;
    first_ins_amount?:number;
    second_ins_amount?:number;
    third_ins_amount?:number;
    discount?:number;
    is_coupon_applied?:boolean;
    cart_items?:string;
    coupon_code?:string;
    mode?:string;
    order_id?:string;
    student_id?:string;
    student_name?:string;
    student_invid?:string;
    part_payment?:string;
    products?:string;
    accounts?:string;
    sales?:string;
    registration?:string;
    createdAt?:Date;
    expireAt?:Date;
    paid?:boolean;
}