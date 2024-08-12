package org.example.backend.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.example.backend.model.Appointment;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository

public interface AppointmentRepository extends MongoRepository<Appointment, String> {
    List<Appointment> findAppointmentsByFamilyId(String familyId);
}
