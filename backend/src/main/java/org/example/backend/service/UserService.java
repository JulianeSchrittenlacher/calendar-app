package org.example.backend.service;

import lombok.RequiredArgsConstructor;
import org.example.backend.model.User;
import org.example.backend.model.UserDTO;
import org.example.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor

public class UserService {
    private final UtilService utilService;
    private final UserRepository userRepository;

    public User createUser(UserDTO userDTO) {
        User newUser = new User(utilService.generateId(), userDTO.name(), userDTO.role(), userDTO.familyId());
        return userRepository.save(newUser);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public void deleteUser(String id) {
        userRepository.deleteById(id);
    }
}
