export type Appointment = {
    id: string;
    description: string;
    startTime: Date;
    endTime: Date;
    userIds: string[];
}
