package org.example.backend.repository;

import org.example.backend.model.Appointment;
import org.example.backend.model.Family;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository

public interface FamilyRepository extends MongoRepository<Family, String> {
}
