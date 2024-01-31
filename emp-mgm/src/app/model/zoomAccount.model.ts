export class ZoomAccount {
    _id?: string;
    usedFor?: string;
    name?: string;
    email?: string;
    isParent?: boolean;
    parentID?: string;
    hostID?: string;
    AccountID?: string;
    ClientID?: string;
    ClientSecret?: string;
    VerificationToken?: string;
    active?: boolean;
    createdAt?: Date;
    createdBy?: string;
    modifiedAt?: Date;
    modifiedBy?: string;
}

export class FreshdeskAgents {

    freshdesk_id: string;
    employee_id: string;
    active: boolean;
    last_synced: Date;
    email: String;
    employee_name: string;
    department: string;
    manager_invid: string;
    manager_name: string;
    employee_invid: string;

}