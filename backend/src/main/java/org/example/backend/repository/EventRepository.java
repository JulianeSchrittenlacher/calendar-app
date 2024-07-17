package org.example.backend.repository;

import org.example.backend.model.Event;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository

public interface EventRepository extends MongoRepository<Event,String> {
}
