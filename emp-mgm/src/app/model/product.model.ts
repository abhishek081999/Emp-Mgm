export class Products {
    _id?: string;
    no_of_sessions?: number;
    no_of_stocks?: number;
    duration?: string;
    image?: string;
    name?: string;
    price?: number;
    validity?: number;
    productid?: string;
    approve?: boolean;
    type?: string;
    description?: string;
    createdAt?: Date;
    updatedAt?: Date;
    createdBy?: String;
    updatedBy?: String;
    audience?: string[];
    benefits?: string[];
    disable?: Boolean;
    sidepanel?: {
        title: string;
        details: string[];
    };
    intro?: string;
    discounted_price?: number;
    cross_sale?: string[];
    up_sale?: string[];
    language?: string;
    url?: string;
    device_type?: string;
    min_selling_price?: number;
    market_research_category?: string[];
}

export class ProductsDisplay {
    _id?: string;
    no_of_sessions?: number;
    no_of_stocks?: number;
    duration?: string;
    image?: string;
    name?: string;
    price?: number;
    validity?: number;
    productid?: string;
    approve?: boolean;
    type?: string;
    description?: string;
    createdAt?: Date;
    updatedAt?: Date;
    createdBy?: String;
    updatedBy?: String;
    audience?: string[];
    benefits?: string[];
    disable?: Boolean;
    sidepanel?: {
        title: string;
        details: string[];
    };
    intro?: string;
    batch_time?: string;
    discounted_price?: number;
    cross_sale?: string[];
    up_sale?: string[];
    language?: string;
    url?: string;
    rating?: number;
    no_of_rating?: number;
    five_star?: number;
    four_star?: number;
    three_star?: number;
    two_star?: number;
    one_star?: number;
}

export class AwarenessVideo {
    _id?: string;
    video_url?: string;
    title?: string;
    thumbnail?: string;
    publish_date?: string;
    approve?: boolean;
    published_date?: Date;
}