import { Appointment } from "../types/Appointment";
import { DateOptions } from "../types/DateOptions";
import "../styles/AppointmentCard.css";

function isIsoDateString(value: string): boolean {
    const isoDatePattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|([+-]\d{2}:\d{2}))?$/;
    return isoDatePattern.test(value);
}

type AppointmentCardProps = {
    appointment: Appointment;
}

export default function AppointmentCard({ appointment }: Readonly<AppointmentCardProps>) {
    const { startTime, endTime, description } = appointment;

    const parseDate = (date: string | Date): Date => {
        return typeof date === 'string' && isIsoDateString(date) ? new Date(date) : new Date(date.toString());
    };

    const formatDate = (date: Date): string => {
        return date.toLocaleString('de-DE', DateOptions);
    };

    const startDate = parseDate(startTime);
    const endDate = parseDate(endTime);

    return (
        <article className="appointment-card">
            <p className="appointment-description">{description}</p>
            <p>Beginn: {formatDate(startDate)}</p>
            <p>Ende: {formatDate(endDate)}</p>
        </article>
    );
}
