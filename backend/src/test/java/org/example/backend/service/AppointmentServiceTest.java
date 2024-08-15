package org.example.backend.service;


import org.example.backend.exceptions.AppointmentNotFoundException;
import org.example.backend.model.Appointment;
import org.example.backend.model.AppointmentDTO;
import org.example.backend.repository.AppointmentRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.annotation.DirtiesContext;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.mockito.Mockito.*;

@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_EACH_TEST_METHOD)
class AppointmentServiceTest {

    private static AppointmentService appointmentService;
    private static AppointmentRepository mockAppointmentRepository;
    private static UtilService mockUtilService;
    private static List<Appointment> testAppointments;

    @BeforeEach
    void setUp() {
        mockAppointmentRepository = mock(AppointmentRepository.class);
        mockUtilService = mock(UtilService.class);
        appointmentService = new AppointmentService(mockUtilService, mockAppointmentRepository);
        testAppointments = new ArrayList<>() {{
            add(new Appointment("1", "test1", Instant.parse("2024-07-17T10:00:00Z"),
                    Instant.parse("2024-07-17T11:00:00Z"), new ArrayList<>() {{
                add("participant1");
                add("participant2");
                add("participant3");
            }}, "12"));
            add(new Appointment("2", "test2", Instant.parse("2025-07-17T10:00:00Z"),
                    Instant.parse("2025-07-17T11:00:00Z"), new ArrayList<>() {{
                add("participant3");
                add("participant4");
            }}, "12"));
            add(new Appointment("3", "test3", Instant.parse("2026-07-17T10:00:00Z"),
                    Instant.parse("2026-07-17T11:00:00Z"), new ArrayList<>() {{
                add("participant1");
            }}, "12"));
        }};
    }

    @Test
    void createAppointment_shouldReturnAppointment_whenCalledWithAppointmentDTO() {
        //GIVEN
        AppointmentDTO appointmentDTO = new AppointmentDTO(
                "TestAppointment",
                Instant.parse("2024-07-17T10:00:00Z"),
                Instant.parse("2024-07-17T11:00:00Z"),
                new ArrayList<>() {{
                    add("participant1");
                }}, "11"
        );
        Appointment expected = new Appointment("Test ID", appointmentDTO.description(), appointmentDTO.startTime(), appointmentDTO.endTime(), appointmentDTO.userIds(), appointmentDTO.familyId());

        //WHEN
        when(mockAppointmentRepository.save(expected)).thenReturn(expected);
        when(mockUtilService.generateId()).thenReturn(expected.id());
        Appointment actual = appointmentService.createAppointment(appointmentDTO);

        //THEN
        assertEquals(expected, actual);
        verify(mockAppointmentRepository).save(expected);
        verify(mockUtilService).generateId();
    }

    @Test
    void getAllAppointmentsOfAFamily_shouldReturnAllAppointments_whenCalledWithFamilyId() {
        //WHEN
        String familyId = "12";
        when(mockAppointmentRepository.findAppointmentsByFamilyId(familyId)).thenReturn(testAppointments);
        List<Appointment> actual = appointmentService.getAllAppointmentsOfAFamily(familyId);
        //THEN
        verify(mockAppointmentRepository).findAppointmentsByFamilyId(familyId);
        assertEquals(testAppointments, actual);

    }

    @Test
    void deleteAppointment_shouldDeleteAppointment_whenCalledWithId() {
        //WHEN
        appointmentService.deleteAppointment("1");
        //THEN
        verify(mockAppointmentRepository, times(1)).deleteById(anyString());
    }

    @Test
    void updateAppointment_shouldUpdateAppointment_whenCalledWithId() throws AppointmentNotFoundException {
        //WHEN
        when(mockAppointmentRepository.findById("3")).thenReturn(Optional.of(testAppointments.get(2)));
        Appointment actual = appointmentService.updateAppointment("3",
                new AppointmentDTO("TestAppointment",
                        Instant.parse("2024-07-17T10:00:00Z"),
                        Instant.parse("2024-07-17T11:00:00Z"),
                        new ArrayList<>() {{
                            add("participant1");
                        }}, "12"));
        when(mockAppointmentRepository.save(any(Appointment.class))).thenReturn(actual);
        //THEN
        verify(mockAppointmentRepository).findById("3");
        verify(mockAppointmentRepository).save(any(Appointment.class));
        assertNotEquals(testAppointments.get(2), actual);

    }
}