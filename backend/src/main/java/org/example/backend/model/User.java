package org.example.backend.model;

import lombok.With;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@With
@Document(collection = "user")

public record User(
        @Id String id,
        String username,
        String password,
        Role role,
        String familyId
) {
}
