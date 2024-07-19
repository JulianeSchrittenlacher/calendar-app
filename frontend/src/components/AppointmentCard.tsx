import {Appointment} from "../types/Appointment.ts";
import {DateOptions} from "../types/DateOptions.ts";

function isIsoDateString(value: string): boolean {
    const isoDatePattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|([+-]\d{2}:\d{2}))?$/;
    return isoDatePattern.test(value);
}

type AppointmentCardProps = {
    appointment: Appointment
}

export default function AppointmentCard(props: Readonly<AppointmentCardProps>) {
    const { startTime, endTime, description } = props.appointment;

    //Hier will ich überarbeiten
    const startDate = isIsoDateString(startTime.toLocaleString()) ? new Date(startTime) : startTime;
    const endDate = isIsoDateString(endTime.toLocaleString()) ? new Date(endTime) : endTime;

    const formatDate = (date: Date | string): string => {
        if (date instanceof Date) {
            return date.toLocaleString('de-DE', DateOptions);
        } else {
            return new Date(date).toLocaleString('de-DE', DateOptions);
        }
    }

    return (
        <>
            <article className="appointment-card">
                <p>{description}</p>
                <p>Beginn: {formatDate(startDate)}</p>
                <p>Ende: {formatDate(endDate)}</p>
            </article>
        </>
    );
}



