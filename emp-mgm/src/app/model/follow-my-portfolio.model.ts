export class FollowMyPortfolio {
    _id: string;
    portfolio_name: string;
    risk: string;
    category: string;
    about: string;
    creation_date: Date;
    image: string;
    short_description: string;
    benchmark?: string;
    graph_data?: {
        portfolio?: any[],
        index?: any[]
    }
    portfolio_return?: string;
    day_change?: string;
    is_day_change_profit?: boolean
    realised_return?: string;
    total_return?: string;
}

export class FollowMyPortfolioStocks {
    _id?: string;
    portfolio_id?: string;
    ISIN?: string;
    exchange?: string;
    date?: Date;
    is_Buy?: boolean;
    price?: number;
    remarks?: string;
    quantity?: number;
    invested_amount?: number;
    total_invested_amount?: number;
    average_price?: number;
    allocation?: number;
    weight?: number;
    is_profit?: boolean;
}

export class FollowMyPortfolioupdate {
    _id: string;
    portfolio_id: string;
    details?: string;
    type?: string;
    image?: string;
    video_link?: string;
    approved?: boolean;
    language?: string;
    created_date?: Date;
    created_by?: string;
    approved_date?: Date;
    approved_by?: string;
    isEdited?: boolean;
}