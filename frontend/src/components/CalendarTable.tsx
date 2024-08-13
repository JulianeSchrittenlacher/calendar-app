import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from '@mui/material';
import useAppointmentStore from "../stores/useAppointmentStore.ts";
import {useEffect} from "react";
import useUserStore from "../stores/useUserStore.ts";

export default function CalendarTable() {
    const appointments = useAppointmentStore(state => state.appointments);
    const users = useUserStore(state => state.users); // Holt alle Benutzer
    const currentUser = useUserStore(state => state.currentUser);
    const getAppointments = useAppointmentStore(state => state.getAppointments);

    const formatDate = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const getDaysInMonth = (month: number, year: number) => {
        return new Array(31).fill(null).map((_, index) => {
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
        const formattedDate = formatDate(new Date(day));
        const appointmentsForDay = appointments.filter(app => {
            const appointmentDate = new Date(app.startTime).toISOString().split('T')[0];
            return appointmentDate === formattedDate && app.userIds.includes(String(userId));
        });

        const descriptions = appointmentsForDay.map(app => app.description).join(', ');

        return descriptions || '';
    };

    const days = getDaysInMonth(7, 2024);

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
                        <TableCell>Aug 2024</TableCell>
                        {users && users.map(user => (
                            <TableCell key={user.id}>{user.username}</TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {days.map((day, index) => (
                        <TableRow key={index}>
                            <TableCell>{showDays(day)}</TableCell>
                            {users && users.map(user => (
                                <TableCell key={user.id}>
                                    {getAppointmentDescriptionsForUser(day, user.id)}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
