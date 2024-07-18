package org.example.backend.repository;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.example.backend.model.Appointment;
import org.springframework.stereotype.Repository;

@Repository

public interface AppointmentRepository extends MongoRepository<Appointment,String> {
}
