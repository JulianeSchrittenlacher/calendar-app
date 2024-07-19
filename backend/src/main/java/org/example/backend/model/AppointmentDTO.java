package org.example.backend.model;

import lombok.With;

import java.time.Instant;

@With

public record AppointmentDTO (
                           String description,
                           Instant startTime,
                           Instant endTime
) {
}
