package org.example.backend.service;


import org.example.backend.model.Appointment;
import org.example.backend.model.AppointmentDTO;
import org.example.backend.repository.AppointmentRepository;
import org.junit.jupiter.api.Test;

import java.time.Instant;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

class AppointmentServiceTest {
    private final AppointmentRepository mockAppointmentRepository = mock(AppointmentRepository.class);
    private final UtilService mockUtilService = mock(UtilService.class);
    AppointmentService appointmentService = new AppointmentService(mockUtilService, mockAppointmentRepository);

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
}