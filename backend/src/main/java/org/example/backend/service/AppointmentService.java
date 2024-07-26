package org.example.backend.service;

import lombok.RequiredArgsConstructor;
import org.example.backend.exceptions.AppointmentNotFoundException;
import org.example.backend.model.Appointment;
import org.example.backend.model.AppointmentDTO;
import org.example.backend.repository.AppointmentRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor

public class AppointmentService {
    private final UtilService utilService;
    private final AppointmentRepository appointmentRepository;

    public Appointment createAppointment(AppointmentDTO appointmentDTO) {
        Appointment newAppointment = new Appointment(utilService.generateId(), appointmentDTO.description(), appointmentDTO.startTime(), appointmentDTO.endTime());
        return appointmentRepository.save(newAppointment);
    }
    
    public List<Appointment> getAllAppointments() {
        return appointmentRepository.findAll();
    }

    public void deleteAppointment(String id) {
        appointmentRepository.deleteById(id);
    }

    public Appointment updateAppointment(String id, AppointmentDTO appointmentDTO) throws AppointmentNotFoundException {
        Appointment foundAppointment = appointmentRepository.findById(id).orElseThrow(() -> new AppointmentNotFoundException("Item with Id " + id + " not found"));
        Appointment updatedAppointment = foundAppointment
                .withDescription(appointmentDTO.description())
                .withStartTime(appointmentDTO.startTime())
                .withEndTime(appointmentDTO.endTime());
        return appointmentRepository.save(updatedAppointment);
    }
}
