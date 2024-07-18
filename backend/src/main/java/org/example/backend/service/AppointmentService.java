package org.example.backend.service;

import lombok.RequiredArgsConstructor;
import org.example.backend.model.Appointment;
import org.example.backend.model.AppointmentDTO;
import org.example.backend.repository.AppointmentRepository;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Repository


public class AppointmentService {
    private final UtilService utilService;
    private final AppointmentRepository appointmentRepository;

    public Appointment createAppointment(AppointmentDTO appointmentDTO) {
        Appointment newAppointment = new Appointment(utilService.generateId(), appointmentDTO.description(),appointmentDTO.startTime(),appointmentDTO.endTime());
        return appointmentRepository.save(newAppointment);
    }
}
