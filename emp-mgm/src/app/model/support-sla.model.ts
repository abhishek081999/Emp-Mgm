export class Sla {
    _id: '';
    slacondition: SlaCondition[];
    priorityModel: PriorityModel[];
    reminderModel: ReminderModel[];
    escalationModel: EscalationModel[];
    name: string;
    description: string;
    
}


export class SlaCondition {
    condition: string = '';
    items: string[] = [];
}


export class PriorityModel {
    name: string;
    firstResponseTime: number;
    everyResponseTime: number;
    resolutionTime: number;
    operationalHours: string;
    escalation: boolean;
}


export class ReminderModel {
    when: string;
    approaches: number;
    sendReminderTo: string[];
}

export class EscalationModel {
    when: string;
    isNotMet: number;
    escalateTo: string[];
}
