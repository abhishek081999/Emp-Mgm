export class Annoucement{
    _id?: string;
    title?: string;
    description?: string;
    date?: Date;
    image?: string;
    annoucementfor?: string;
    approve?:boolean;
    type?: string;
    isReplyAllowed?: boolean;
    isWhatsappMsgSend?: boolean;
    whatsapp_campaign_name?: string;
    whatsapp_data?: string[];
}
export class WpTemplate{
    template?:string;
    campaign_name?:string;
    variable_count?:number;
}

export class Notice{
    _id?: string;
    title?: string;
    description?: string;
    published_date?: Date;
    image?: string;
    isApprove?:boolean;
    department?: string[];
    team?: string[];
    roles?: string[];
    tags?: string[];
    isWhatsappMsgSend?: boolean;
    whatsapp_campaign_name?: string;
    whatsapp_data?: string[];
}