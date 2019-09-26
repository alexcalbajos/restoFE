export class DaySchedule {
    name: string;
    morningStart?: Schedule;
    morningEnd?: Schedule;
    eveningStart?: Schedule;
    eveningEnd?: Schedule;
    isValid?: boolean;
}

export class ApiSchedule {
    day: string;
    start: string;
    end: string;
}

export class Schedule {
    value: string;
    time: string;
    date?: Date;
}
