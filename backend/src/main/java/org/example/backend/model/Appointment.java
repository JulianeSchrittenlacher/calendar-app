package org.example.backend.model;

import lombok.With;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.List;

@With
@Document(collection = "appointments")

public record Appointment(
        @Id String id,
        String description,
        Instant startTime,
        Instant endTime,
        List<String> userIds
) {
}
