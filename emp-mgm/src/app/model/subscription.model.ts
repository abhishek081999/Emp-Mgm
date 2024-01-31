import { Subscriptionpackage } from './subscriptionpackage.model';

export class Subscription{
    _id:string;
    name:string;
    package:  Subscriptionpackage[];
    approve:boolean;
}