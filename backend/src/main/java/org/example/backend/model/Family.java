package org.example.backend.model;

import lombok.With;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@With
@Document(collection = "families")

public record Family(@Id String familyId,
                     String familyName,
                     String state) {
}
