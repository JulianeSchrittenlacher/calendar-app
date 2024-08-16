import {
    Checkbox,
    ListItem,
    ListItemText,
    FormControl,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow, SelectChangeEvent
} from '@mui/material';

import useAppointmentStore from "../stores/useAppointmentStore.ts";
import {ReactNode, useEffect, useState} from "react";
import useUserStore from "../stores/useUserStore.ts";
import useApiStore from "../stores/useApiStore.tsx";
import {Holiday} from "../types/Holiday.ts";
import {User} from "../types/User.ts";

export default function CalendarTable() {
    const appointments = useAppointmentStore(state => state.appointments);
    const users = useUserStore(state => state.users); // Holt alle Benutzer
    const currentUser = useUserStore(state => state.currentUser);
    const getAppointments = useAppointmentStore(state => state.getAppointments);
    const getUsers = useUserStore(state => state.getUsers);
    const getHolidays = useApiStore(state => state.getHolidaysOfCurrentYear);
    const holidaysOfCurrentYear = useApiStore(state => state.holidaysOfCurrentYear);
    const currentState = useApiStore(state => state.currentState);

    const [month, setMonth] = useState<number>(new Date().getMonth());
    const [year, setYear] = useState<string>(String(new Date().getFullYear()));
    // @ts-ignore
    const [selectedColumns, setSelectedColumns] = useState<User[]>(users);

    const months = ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"];


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

    const days = getDaysInMonth(month, Number(year));

    const isWeekend = (date: string) => {
        const dayOfWeek = new Date(date).getDay();
        return dayOfWeek === 0 || dayOfWeek === 6; // 0 = Sonntag, 6 = Samstag
    };

    const generateYearOptions = () => {
        const currentYear = new Date().getFullYear();
        const years = [];
        for (let i = -10; i <= 10; i++) {
            years.push(currentYear + i);
        }
        return years;
    };

    function getHolidayName(day: string, holidaysOfCurrentYear: Holiday[]): string {
        const holiday = holidaysOfCurrentYear.find(holiday => holiday.date === day);
        return holiday ? holiday.fname : "";
    }

    const handleColumnChange = (event: SelectChangeEvent<User[]>) => {
        setSelectedColumns(event.target.value as User[]);
    };


    useEffect(() => {
        if (currentUser) {
            getAppointments(currentUser.familyId);
            getUsers(currentUser.familyId);
            getHolidays(year, currentState);
        }
    }, [currentUser, getAppointments, year, currentState]);

    return (
        <div>
            <FormControl fullWidth margin="normal">
                <InputLabel>Select Columns</InputLabel>
                <Select
                    multiple
                    value={selectedColumns}
                    onChange={handleColumnChange}
                    renderValue={(selected) => selected.join(', ')}
                >
                    {users && users.map((user) => (
                        <MenuItem key={user.id} value={user.username}>
                            <Checkbox checked={selectedColumns.indexOf(user.username) > -1}/>
                            <ListItemText primary={user.username}/>
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

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
                                <Select value={year} onChange={(e) => setYear(e.target.value)}>
                                    {generateYearOptions().map((yr) => (
                                        <MenuItem key={yr} value={yr}>
                                            {yr}
                                        </MenuItem>
                                    ))}
                                </Select></TableCell>
                            {users && selectedColumns.map(user => (
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
                            const isHolidayDay = getHolidayName(day, holidaysOfCurrentYear);

                            const backgroundColor = isWeekendDay || isHolidayDay ? '#FFFFE0' : 'white'; // Pastellgelb für Wochenenden und Feiertage

                            return (
                                <TableRow key={index} style={{backgroundColor}}>
                                    <TableCell
                                        style={{
                                            fontWeight: 'bold',
                                            fontSize: '1.1rem',
                                            lineHeight: '1.1rem',
                                            textAlign: 'center',
                                        }}
                                    >
                                        <span>{showDays(day)}</span>
                                        <span style={{display: 'block', lineHeight: '1.1rem', color: "hotpink"}}>
                                        {getHolidayName(day, holidaysOfCurrentYear)}
                                    </span>
                                    </TableCell>
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
        </div>

    );
}
