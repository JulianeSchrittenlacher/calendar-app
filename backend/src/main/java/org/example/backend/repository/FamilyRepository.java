package org.example.backend.repository;

import org.example.backend.model.Family;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository

public interface FamilyRepository extends MongoRepository<Family, String> {
}
