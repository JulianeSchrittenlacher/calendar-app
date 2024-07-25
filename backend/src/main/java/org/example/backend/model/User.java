package org.example.backend.model;

import lombok.With;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@With
@Document(collection = "user")

public record User(
        @Id String id,
        String name,
        Role role,
        String familyId
) {
}
