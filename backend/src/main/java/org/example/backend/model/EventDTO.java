package org.example.backend.model;

import lombok.With;

import java.time.Instant;

@With

public record EventDTO(String description,
                    Instant startTime,
                    Instant endTime
) {
}
