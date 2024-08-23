package org.example.backend.repository;

import org.example.backend.model.Family;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository

public interface FamilyRepository extends MongoRepository<Family, String> {
    Optional<Family> findByFamilyId(String familyId);
}
