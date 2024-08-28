package org.example.backend.model;

import lombok.With;

@With

public record UserDTO(
        String username,
        String password,
        Role role,
        String familyId
) {
}
