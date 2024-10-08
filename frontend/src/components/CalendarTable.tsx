import {
    Collapse,
    MenuItem,
    Paper,
    Select,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from '@mui/material';

import useAppointmentStore from "../stores/useAppointmentStore.ts";
import React, {useEffect, useState} from "react";
import useUserStore from "../stores/useUserStore.ts";
import useApiStore from "../stores/useApiStore.ts";
import {Holiday} from "../types/Holiday.ts";
import "../styles/CalendarTable.css"
import Modal from "./Modal.tsx";
import AppointmentAddForm from "./AppointmentAddForm.tsx";
import AppointmentGallery from "./AppointmentGallery.tsx";
import useFamilyStore from "../stores/useFamilyStore.ts";

export default function CalendarTable() {
    const appointments = useAppointmentStore(state => state.appointments);
    const users = useUserStore(state => state.users);
    const currentUser = useUserStore(state => state.currentUser);
    const getAppointments = useAppointmentStore(state => state.getAppointments);
    const getUsers = useUserStore(state => state.getUsers);
    const getHolidays = useApiStore(state => state.getHolidaysOfCurrentYear);
    const holidaysOfCurrentYear = useApiStore(state => state.holidaysOfCurrentYear);
    const currentState = useFamilyStore(state => state.currentFamily?.state ?? "hb");


    const [month, setMonth] = useState<number>(new Date().getMonth());
    const [year, setYear] = useState<string>(String(new Date().getFullYear()));
    const months = ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"];
    const [modalOpen, setModalOpen] = useState(false);
    const [openRowIndex, setOpenRowIndex] = useState<number | null>(null);
    const [selectedDay] = useState<string>("");


    const formatDate = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const today = formatDate(new Date());

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

    const handleRowClick = (index: number) => {
        setOpenRowIndex(openRowIndex === index ? null : index);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
    };


    useEffect(() => {
        if (currentUser) {
            getAppointments(currentUser.familyId);
            getUsers(currentUser.familyId);
            getHolidays(year, currentState);
        }
    }, [getAppointments, year, currentState]);

    return (
        <>
            <TableContainer component={Paper} className="table-container">
                <Table className="table">
                    <TableHead className="table-head">
                        <TableRow className="table-row">
                            <TableCell className="first-cell header-cell">
                                <Select value={month} onChange={(e) => setMonth(Number(e.target.value))}
                                        variant={"standard"}>
                                    {months.map((monthName, index) => (
                                        <MenuItem key={index} value={index}>
                                            {monthName}
                                        </MenuItem>
                                    ))}
                                </Select>
                                <Select value={year} onChange={(e) => setYear(e.target.value)} variant={"standard"}>
                                    {generateYearOptions().map((yr) => (
                                        <MenuItem key={yr} value={yr}>
                                            {yr}
                                        </MenuItem>
                                    ))}
                                </Select>
                                <p>{holidaysOfCurrentYear.length === 0 && "Feiertage nicht verfügbar"}</p>
                            </TableCell>
                            {users && users.map(user => (
                                <TableCell
                                    key={user.id}
                                    className="dynamic-cell user-cell"
                                >
                                    {user.username}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {days.map((day, index) => {
                            const isWeekendDay = isWeekend(day);
                            const isHolidayDay = getHolidayName(day, holidaysOfCurrentYear);
                            const cellClass = isWeekendDay || isHolidayDay ? 'first-cell day-cell weekend-holiday-cell' : 'first-cell day-cell';
                            const isToday = day === today ? 'today-cell' : '';


                            return (
                                <React.Fragment key={index}>
                                    <TableRow
                                        className={`table-row ${isToday}`}
                                        onClick={() => handleRowClick(index)}
                                        style={{cursor: 'pointer'}}
                                    >
                                        <TableCell className={`${cellClass} ${isToday}`}>
                                            <span>{showDays(day)}</span>
                                            <span style={{display: 'block', lineHeight: '1.1rem', color: "hotpink"}}>
                                            {getHolidayName(day, holidaysOfCurrentYear)}
                                        </span>
                                        </TableCell>
                                        {users && users.map(user => (
                                            <TableCell
                                                key={user.id}
                                                className={`dynamic-cell ${cellClass}`}
                                            >
                                            <span className="appointments" style={{
                                                width: '200px',
                                                whiteSpace: 'nowrap',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                display: 'inline-block'
                                            }}>
                                                {getAppointmentDescriptionsForUser(day, user.id)}
                                            </span>
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                    <TableRow>
                                        <TableCell colSpan={(users?.length ?? 0) + 1} style={{padding: 0}}>
                                            <Collapse in={openRowIndex === index}>
                                                <div className="collapse-content">
                                                    {currentUser && <AppointmentGallery key={currentUser.id}
                                                                                        day={day}></AppointmentGallery>}
                                                </div>
                                            </Collapse>
                                        </TableCell>
                                    </TableRow>
                                </React.Fragment>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>

            <Modal show={modalOpen} onClose={handleCloseModal}>
                <AppointmentAddForm onClose={handleCloseModal} day={selectedDay}/>
            </Modal>
        </>

    );
}
