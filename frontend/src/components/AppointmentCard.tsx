import { Appointment } from "../types/Appointment";
import { DateOptions } from "../types/DateOptions";
import "../styles/AppointmentCard.css";
import {Link} from "react-router-dom";

function isIsoDateString(value: string): boolean {
    const isoDatePattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|([+-]\d{2}:\d{2}))?$/;
    return isoDatePattern.test(value);
}

type AppointmentCardProps = Appointment & {
    deleteAppointment: (id: string) => void;
}

export default function AppointmentCard(props: Readonly<AppointmentCardProps>) {
    const { id, description, startTime, endTime, deleteAppointment} = props;

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
            <p className="appointment-description">{id}</p>
            <p>Beginn: {formatDate(startDate)}</p>
            <p>Ende: {formatDate(endDate)}</p>
            <div className="button-container">
                <button onClick={() => deleteAppointment(id)}>Löschen</button>
                <Link className="button-link" to={"/edit/" + id}>Bearbeiten</Link>
            </div>
        </article>
    );
}
