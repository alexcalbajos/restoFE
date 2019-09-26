export class DeliveryDay {
    date?: string;
    weekday?: string;
    weekdayKey?: string;
    hours?: Array<DeliveryHour>;
}

export class DeliveryHour {
    id: number;
    time: string;
    initialPariFromResponse: string;
}
