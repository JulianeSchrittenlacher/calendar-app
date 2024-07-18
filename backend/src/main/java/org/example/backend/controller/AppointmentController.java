package org.example.backend.controller;

import lombok.RequiredArgsConstructor;
import org.example.backend.model.Appointment;
import org.example.backend.model.AppointmentDTO;
import org.example.backend.service.AppointmentService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

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



}