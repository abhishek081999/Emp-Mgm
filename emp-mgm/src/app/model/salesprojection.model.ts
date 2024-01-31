export class SalesProjectionCommit {
    _id?: string;
    ServiceCode?: string;
    Service_ID?: string;
    ServiceName?: string;
    Instructors?: string;
    Start_Day?: string;
    Fees?: number;
    Counts?: number;
    Booked_Rev?: number;
    Payment_Recv?: number;
    Staff_ID?: string;
    Month?: string;
    Year?: string;
    Created_At?: Date;
    Created_By?: string;
    Updated_At?: Date;
    Updated_By?: string;
    Admin_Approved?: boolean;
}

export class SalesProjectionDisp {
    _id?: string;
    Staff_ID?: string;
    Staff_Name?: string;
    Team_Name?: string;
    Team_Lead_ID?: string;
    Team_Lead_Name?: string;
    Month?: string;
    Year?: string;
    ServiceCode?: string;
    ServiceName?: string;
    Fees?: number;
    Commit_Counts?: number;
    Commit_Booked_Rev?: number;
    Commit_Payment_Recv?: number;
    Actual_Counts?: number;
    Actual_Booked_Rev?: number;
    Actual_Payment_Recv?: number;
    Pro_Rata_Booked_Rev?: number;
    Pro_Rata_Payment_Recv?: number;
    Defecit_or_Surplus_Payment?: number;
    Defecit_or_Surplus_Count?: number;
    Converted?: number;
    Partially_Converted?: number;
    Seat_Booked?: number;
}