package org.example.backend.model;

import lombok.With;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@With
@Document(collection = "events")

public record Event(String id,
                    String description,
                    Instant startTime,
                    Instant endTime
) {
}
