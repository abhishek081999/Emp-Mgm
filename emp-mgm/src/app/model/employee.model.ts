export class Employee {
    _id?: string;
    invid?: string;
    fullName?: string;
    gender?: string;
    dob?: string;
    email?: string;
    telephone?: string;
    telegram?: string;
    alternatenum?: string;
    address?: string;
    city?: string;
    pincode?: string;
    state?: string;
    otherstate?: string;
    profileid?: string;
    role?: string;
    password?: string;
    designation_id?: string;
    Manager?: string;
    Approver?: string;
    Hr?: string;
    joining_date?: Date;
    isActive?: boolean;
    department_id?: string;
    team_id?: string;
    isResigned?: boolean;
    salt?: string;
    profile_image?: string;
    designation?: string;
    team?: string;
    department?: string;
    countryCode?: string;
    employeeType?: string;
    leave_policy?: string[];
}

export class Department {
    _id?: string;
    name?: string;
    dept_head?: string;
    dept_head_name?: string;
    team_count?: number;
    active_emp?: number;
}

export class Team {
    _id?: string;
    name?: string;
    team_lead?: string;
    department_id?: string;
    team_lead_name?: string;
}

export class Designation {
    _id?: string;
    name?: string;
    department_id?: string;
    order?: number
}


export class EmployeeDetails {
    emergencyContact?: {
        name?: string;
        phone?: string;
        relation?: string;
    }

    secondary?: string;
    higherSecondary?: string;

    adhaarcard?: string;
    pancard?: string;

    passport?: string;
    cancelCheque?: string;
    graduation?: string;
    higherStudy?: string;

    employeeType?: string;
    bloodGroup?: string;
    maritalStatus?: string;
}

export class Attendence {
    employee_id?: string;
    attendanceTime?: string;
    isApprove?: boolean;
    approveBy?: string;
    approveAt?: string;
    comments?: string;
    device: {
        device?: string;
        browser?: string;
    }
    attendance?: string;
    isRegularize?: boolean;
    _id?: string;
    employee_invid?: string;
    department?: string;
    department_id?: string;
    manager?: string;
    reason: any;
}

export class Regularize {
    employee_id?: string;
    attendance_date?: Date;
    request_date?: Date;
    isApprove?: boolean;
    isReject?: boolean;
    reason?: string;
    approveBy?: string;
    approveAt?: string;
    comments?: string;
    attendance?: string;
    device: {
        device?: string;
        browser?: string;
    }
    _id?: string;
    manager_invid?: string;
    department_id?: string;
}
export class AttendanceReport {
    attendance_count: number;
    department: string;
    department_id: string;
    employee_id: string;
    employee_invid: string;
    employee_name: string;
    manager: string;
    manager_name: string;
    month: Date
}
export class ManagerWiseAttendanceReport {
    _id: string;
    manager_name: string;
    manager_invid: string;
    attendance_pending: number;
    department_name: string;
    shift_roster_pending: number;
    leave_pending: number;
    regularise_pending: number;

}

export class Leave {
    employee_id?: string;
    request_date?: Date;
    fromDate?: Date;
    toDate?: Date;
    reason?: string;
    device?: {
        device?: string;
        browser?: string;
    }
    isApproveManager?: boolean;
    approveByManager?: boolean;
    managerApproveAt?: Date;
    isApproveHr?: boolean;
    approvedByHr?: string;
    hrApprovedAt?: Date;
    leaveType?: string;
    employee_name?: string;
    employee_invid?: string;
    manager_name?: string;
    manager_invid?: string;
    department?: string;
    supportingDocument?: string
    _id?: string;
    is_half_day: boolean;
    leave_half?: string
    days_count?: number;
    policy_id?: string
    isRejectHr?: boolean;
    isRejectManager?: boolean;
}


export class Policy {
    _id?: string;
    policy_name?: string;
    description?: string;
    leave_type?: string;
    is_encashable?: boolean; // is Encashable after certain time
    created_date?: Date; // auto generated from backend
    effective_from?: Date;//Effective Start date or joining date whichever is later
    total_per_year?: number;// total number of leave per year
    is_holiday_excluded?: boolean;
    is_weekend_excluded?: boolean;
    max_consecutive?: number; // max number of days leave can be applied
    apply_before_days?: number; // number of days before leave can be applied
    accrual_method?: string;  // Monthly, Quarterly, Yearly
    waiting_period_length?: number; // number of days or month or weeks
    waiting_period_unit?: string; //month, days, weeks
    max_carry_days?: number;// max number of leaves carry forward
    max_balance_days?: number;// max number of leaves balance
    is_half_day_allowed?: boolean;
    is_active?: boolean;
    leave_exclusion?: string[]; //leave types
    is_prorata_basis?: boolean;
    current_balance?: number;
    min_days_for_supporting_doc?: number;
    supporting_document_required?: boolean;
}

export class AttendanceSettings {
    regularize_limit?: number;
    last_day_regularize?: number;
}

export class ShiftRoster {
    _id?: string;
    employee_id?: string;
    shift?: string
    WorkLocation: any;
}




