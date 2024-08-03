package org.example.backend.model;

import lombok.With;

import java.time.Instant;
import java.util.List;

@With

public record AppointmentDTO(
        String description,
        Instant startTime,
        Instant endTime,
        List<String> userIds
) {
}
