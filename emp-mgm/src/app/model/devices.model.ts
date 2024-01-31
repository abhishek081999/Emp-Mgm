export class Devices {
    _id?: string;
    user_id?: string;
    user_name?: string;
    user_invid?: string;
    device_id?: string;
    device_token?: string;
    device_name?: string;
    device_type?: string;
}

export class LoginHistory {
    device_id?: string;
    is_logged_in?: boolean;
    device_name?: string;
    device_type?: string;
    _id?: string;
    user_id?: string;
    user_name?: string;
    user_invid?: string;
    logged_in_time?: string;
    logged_out_time?: string;
}