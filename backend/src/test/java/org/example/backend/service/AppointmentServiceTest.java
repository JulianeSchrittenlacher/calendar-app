package org.example.backend.service;


import org.example.backend.model.Appointment;
import org.example.backend.model.AppointmentDTO;
import org.example.backend.repository.AppointmentRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.annotation.DirtiesContext;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
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
        appointmentService = new AppointmentService(mockUtilService,mockAppointmentRepository);
        testAppointments = new ArrayList<>(){{
            add(new Appointment("1","test1",Instant.parse("2024-07-17T10:00:00Z"),
                    Instant.parse("2024-07-17T11:00:00Z")));
            add(new Appointment("2","test2",Instant.parse("2025-07-17T10:00:00Z"),
                    Instant.parse("2025-07-17T11:00:00Z")));
            add(new Appointment("3","test3",Instant.parse("2026-07-17T10:00:00Z"),
                    Instant.parse("2026-07-17T11:00:00Z")));
        }};
    }

    @Test
    void createAppointment_shouldReturnAppointment_whenCalledWithAppointmentDTO() {
        //GIVEN
        AppointmentDTO appointmentDTO = new AppointmentDTO(
                "TestAppointment",
                Instant.parse("2024-07-17T10:00:00Z"),
                Instant.parse("2024-07-17T11:00:00Z")
        );
        Appointment expected = new Appointment("Test ID", appointmentDTO.description(), appointmentDTO.startTime(), appointmentDTO.endTime());

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
    void getAllAppointments_shouldReturnAllAppointments_whenCalled() {
        //WHEN
        when(mockAppointmentRepository.findAll()).thenReturn(testAppointments);
        List<Appointment> actual = appointmentService.getAllAppointments();
        //THEN
        verify(mockAppointmentRepository).findAll();
        assertEquals(testAppointments, actual);

    }

    @Test
    void deleteAppointment_shouldDeleteAppointment_whenCalledWithId() {
        //WHEN
        appointmentService.deleteAppointment("1");
        //THEN
        verify(mockAppointmentRepository, times(1)).deleteById(anyString());
    }
}