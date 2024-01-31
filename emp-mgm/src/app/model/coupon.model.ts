export class Coupon{
    _id?:string;
    month?:string;
    startdate?:Date;
    expirydate?:Date;
    couponcode?:string;
    type?:string;
    numberofuse?: number;
    minimumbal?: number;
    price?: number;
    prefixcode?:string;
    staffid?:string;
    isexpired?:Boolean;
    forfirsttime?:Boolean;
    user?: string[];
    approve?:boolean;
    year?: string;
}