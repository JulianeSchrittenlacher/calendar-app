package org.example.backend.repository;

import org.example.backend.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository

public interface UserRepository extends MongoRepository<User, String> {
    List<User> findUsersByFamilyId(String familyId);
}
