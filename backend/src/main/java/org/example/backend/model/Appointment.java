package org.example.backend.model;

import lombok.With;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@With
@Document(collection = "appointments")

public record Appointment (String id,
                    String description,
                    Instant startTime,
                    Instant endTime
) {
}
