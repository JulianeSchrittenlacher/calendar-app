package org.example.backend.model;

import lombok.With;

@With

public record FamilyDTO(String familyName,
                        String state) {
}
