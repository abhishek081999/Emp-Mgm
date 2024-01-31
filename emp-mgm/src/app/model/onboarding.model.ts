export class onboardingTaskSettings {
    _id: string;
    department: string;
    taskname: string;
    isOnboarding: boolean;
    tasktype: string;
    priority: string;
    order?: number
    taskOwner: string;
    verificationOwner: string;
}

export class onboardingTasksList {
    _id: string;
    employee_id: string;
    taskname: string;
    isOnboarding: boolean;
    tasktype: string;
    priority: number;
    status: string;
    order: number
    taskOwner: string;
    verificationOwner: string;
    onboardingDate: Date;
    taskStartDate: Date;
    isCompleted: boolean;
    completedOn: Date;
    isVerified: boolean;
    verifiedOn: Date;
}
