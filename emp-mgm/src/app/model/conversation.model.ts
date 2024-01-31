export class Conversation {
    _id?: string;
    profile_pic?: string;
    user_name?: string;
    agent_name?: string;
    last_message?: string;
    last_message_time?: Date;
    is_image: boolean;
    user_id?: string;
    agent_id?: string;
    type?: string;
    initiated_at?: Date;
    is_acknowledged?: boolean;
    acknowledged_at?: Date;
    is_resolved?: boolean;
    resolved_at?: Date;
    is_ended?: boolean;
    ended_at?: Date;
    ended_by?: string;
    user_socket_id?: string;
    agent_socket_id?: string;
    category?: string;
    agent_unread_count?: number;
}

export class SupportCategory{
    name: string;
    isActive: boolean;
    type: string;
}