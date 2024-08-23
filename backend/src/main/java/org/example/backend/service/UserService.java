package org.example.backend.service;

import lombok.RequiredArgsConstructor;
import org.example.backend.model.Family;
import org.example.backend.model.User;
import org.example.backend.model.UserDTO;
import org.example.backend.repository.FamilyRepository;
import org.example.backend.repository.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.argon2.Argon2PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

@Service
@RequiredArgsConstructor

public class UserService implements UserDetailsService {
    private final UtilService utilService;
    private final UserRepository userRepository;
    private final FamilyRepository familyRepository;

    private final Argon2PasswordEncoder encoder = Argon2PasswordEncoder.defaultsForSpringSecurity_v5_8();

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User: " + username + " not Found!"));
        return new org.springframework.security.core.userdetails.User(user.username(), user.password(), Collections.emptyList());
    }

    public User findByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElse(null);
    }

    public User registerNewUser(UserDTO newUserDto) {

        Optional<Family> foundFamily = familyRepository.findByFamilyId(newUserDto.familyId());

        String familyName = foundFamily.isPresent() ? foundFamily.get().familyName() : "Mustermann";

        String familyId = newUserDto.familyId();
        if (familyId == null || familyId.isEmpty()) {
            familyId = utilService.generateId();
            familyRepository.save(new Family(utilService.generateId(), familyName, "sh"));
        }


        User newUser = new User(
                utilService.generateId(),
                newUserDto.username(),
                encoder.encode(newUserDto.password()),
                newUserDto.role(),
                familyId
        );

        return userRepository.save(newUser);
    }

    public List<User> getAllUsersOfAFamily(String familyId) {
        return userRepository.findUsersByFamilyId(familyId);
    }

    public void deleteUser(String id) {
        userRepository.deleteById(id);
    }

    public User updateUser(String id, UserDTO userDTO) {
        User userToUpdate = userRepository.findById(id).orElseThrow(() -> new NoSuchElementException("User not found"));
        return userRepository.save(userToUpdate
                .withUsername(userDTO.username())
                .withRole(userDTO.role())
                .withFamilyId(userDTO.familyId()));
    }
}
