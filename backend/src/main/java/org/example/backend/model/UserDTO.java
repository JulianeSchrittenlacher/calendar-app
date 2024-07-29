package org.example.backend.model;

import lombok.With;

@With

public record UserDTO(
        String name,
        Role role,
        String familyId
) {
}
