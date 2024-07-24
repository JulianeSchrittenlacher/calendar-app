package org.example.backend.controller;

import lombok.RequiredArgsConstructor;
import org.example.backend.exceptions.AppointmentNotFoundException;
import org.example.backend.model.Appointment;
import org.example.backend.model.AppointmentDTO;
import org.example.backend.service.AppointmentService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/calender")
@RequiredArgsConstructor

public class AppointmentController {
    private final AppointmentService appointmentService;

    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping("/create")
    public Appointment createAppointment(@RequestBody AppointmentDTO appointmentDTO) {
        return appointmentService.createAppointment(appointmentDTO);
    }

    @ResponseStatus(HttpStatus.OK)
    @GetMapping
    public List<Appointment> getAllAppointments() {
        return appointmentService.getAllAppointments();
    }

    @ResponseStatus(HttpStatus.OK)
    @DeleteMapping("/{id}")
    public void deleteAppointment(@PathVariable String id) {
        appointmentService.deleteAppointment(id);
    }

    @ResponseStatus(HttpStatus.CREATED)
    @PutMapping("/{id}")
    public Appointment updateAppointment(@PathVariable String id, @RequestBody AppointmentDTO appointmentDTO) throws AppointmentNotFoundException {
        return appointmentService.updateAppointment(id, appointmentDTO);
    }



}