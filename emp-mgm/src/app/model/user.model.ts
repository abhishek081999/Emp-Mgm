export class User {
    _id?: string;
    invid: string;

    fullName: string;
    gender?: string;
    dob?: Date;

    email: string;
    telephone: string;
    telegram?: string;
    alternatenum?: string;
    secondarynum?: string;
    address: string;
    city: string;
    pincode: string;
    state?: string;
    countryCode?: string;

    profileid: string;
    profile_image?: string;
    role: string;
    designation?: string;
    password: string;

    provider?: string;
    providerid?: string;

    qualification?: string;
    cv?: string;
    gstin?: string;
    isActive?: boolean;
};

export interface Countries {
    code: string
    name: string
}
export class chatFeedback {
    user_id: string;
    userName: string;
    userInvid: string;
    is_resolved: Boolean;
    rating: Number;
    comment: string;
    conv_point: Number;
    agent_id: string;
    agentName: string;
    agentInvid: string;
    type: string;
    initiated_at: Date;
    acknowledged_at: Date;
    resolved_at: Date;
}