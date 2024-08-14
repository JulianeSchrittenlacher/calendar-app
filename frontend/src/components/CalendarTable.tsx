import {MenuItem, Paper, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from '@mui/material';
import useAppointmentStore from "../stores/useAppointmentStore.ts";
import {useEffect, useState} from "react";
import useUserStore from "../stores/useUserStore.ts";
import axios from "axios";

export default function CalendarTable() {
    const appointments = useAppointmentStore(state => state.appointments);
    const users = useUserStore(state => state.users); // Holt alle Benutzer
    const currentUser = useUserStore(state => state.currentUser);
    const getAppointments = useAppointmentStore(state => state.getAppointments);

    const [month, setMonth] = useState<number>(new Date().getMonth());
    const [year, setYear] = useState<number>(new Date().getFullYear());
    const months = ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"];

    async function fetchHolidays(year: string) {
        try {
            const response = await axios.get(`/api/holidays/${year}`);
            // Extrahiere die Feiertage aus der Antwort
            return response.data;
        } catch (error) {
            console.error('Error fetching holidays:', error);
            throw error;
        }
    }

    const holidays = fetchHolidays(String(year));

    const formatDate = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const getDaysInMonth = (month: number, year: number) => {
        const lastDay = new Date(year, month + 1, 0);
        return new Array(lastDay.getDate()).fill(null).map((_, index) => {
            const date = new Date(year, month, index + 1);
            return formatDate(date);
        });
    };

    const showDays = (day: string) => {
        const date = new Date(day);
        const weekdays = ["SO", "MO", "DI", "MI", "DO", "FR", "SA"];
        const dayOfWeek = weekdays[date.getDay()];
        const dayOfMonth = String(date.getDate()).padStart(2, '0');
        return `${dayOfWeek} ${dayOfMonth}`;
    };

    const getAppointmentDescriptionsForUser = (day: string, userId: string) => {
        const appointmentsForDay = appointments.filter(appointment => {
            const appointmentDate = formatDate(new Date(appointment.startTime));
            return appointmentDate === day && appointment.userIds.includes(String(userId));
        });
        const descriptions = appointmentsForDay.map(app => app.description).join(', ');
        return descriptions || '';
    };

    const days = getDaysInMonth(month, year);

    const isWeekend = (date: string) => {
        const dayOfWeek = new Date(date).getDay();
        return dayOfWeek === 0 || dayOfWeek === 6; // 0 = Sonntag, 6 = Samstag
    };

    async function isHoliday(date: string, year: string): Promise<boolean> {
        try {
            // Hol die Feiertage für das Jahr
            const holidays = await fetchHolidays(year);
            // Formatieren des Datums (falls nötig)
            const formattedDate = formatDate(new Date(date));
            // Überprüfen, ob das Datum in den Feiertagen enthalten ist
            return holidays.includes(formattedDate);
        } catch (error) {
            console.error('Error checking if date is a holiday:', error);
            return false; // oder einen geeigneten Wert zurückgeben
        }
    }

    const generateYearOptions = () => {
        const currentYear = new Date().getFullYear();
        const years = [];
        for (let i = -10; i <= 10; i++) {
            years.push(currentYear + i);
        }
        return years;
    };

    useEffect(() => {
        if (currentUser) {
            getAppointments(currentUser.familyId);
        }
    }, [currentUser, getAppointments]);

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>
                            <Select value={month} onChange={(e) => setMonth(Number(e.target.value))}>
                                {months.map((monthName, index) => (
                                    <MenuItem key={index} value={index}>
                                        {monthName}
                                    </MenuItem>
                                ))}
                            </Select>
                            <Select value={year} onChange={(e) => setYear(Number(e.target.value))}>
                                {generateYearOptions().map((yr) => (
                                    <MenuItem key={yr} value={yr}>
                                        {yr}
                                    </MenuItem>
                                ))}
                            </Select></TableCell>
                        {users && users.map(user => (
                            <TableCell key={user.id}
                                       style={{
                                           fontWeight: 'bold',
                                           fontSize: '1.2rem' // Größere Schriftgröße für die Kopfzeile
                                       }}>{user.username}</TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {days.map((day, index) => {
                        const isWeekendDay = isWeekend(day);
                        const isHolidayDay = isHoliday(day, String(year));
                        const backgroundColor = isWeekendDay || isHolidayDay ? '#FFFFE0' : 'white'; // Pastellgelb für Wochenenden und Feiertage

                        return (
                            <TableRow key={index} style={{backgroundColor}}>
                                <TableCell style={{
                                    fontWeight: 'bold',
                                    fontSize: '1.1rem', // Größere Schriftgröße für die erste Spalte
                                }}>{showDays(day)}</TableCell>
                                {users && users.map(user => (
                                    <TableCell key={user.id}>
                                        {getAppointmentDescriptionsForUser(day, user.id)}
                                    </TableCell>
                                ))}
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
