package org.example.backend.service;

import org.example.backend.model.Role;
import org.example.backend.model.User;
import org.example.backend.model.UserDTO;
import org.example.backend.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.argon2.Argon2PasswordEncoder;
import org.springframework.test.annotation.DirtiesContext;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_EACH_TEST_METHOD)
class UserServiceTest {

    private static UserService userService;
    private static UserRepository mockUserRepository;
    private static UtilService mockUtilService;
    private static List<User> testUser;
    private static Argon2PasswordEncoder mockPasswordEncoder;

    @BeforeEach
    void setUp() {
        mockUserRepository = mock(UserRepository.class);
        mockUtilService = mock(UtilService.class);
        userService = new UserService(mockUtilService, mockUserRepository);
        mockPasswordEncoder = mock(Argon2PasswordEncoder.class);
        testUser = new ArrayList<>() {{
            add(new User("1", "John Doe", "123", Role.ADULT, "family123"));
            add(new User("2", "Jane Doe", "456", Role.ADULT, "family123"));
            add(new User("3", "Jimmy Doe", "789", Role.CHILD, "family123"));
        }};
    }

    @Test
    void loadUserByUsername_shouldReturnUserDetail_whenCalledWithUsername() {
        //GIVEN
        User user = testUser.getFirst();
        org.springframework.security.core.userdetails.User expectedUserDetails =
                new org.springframework.security.core.userdetails.User(
                        user.username(),
                        user.password(),
                        Collections.emptyList()
                );

        //WHEN
        when(mockUserRepository.findByUsername(user.username())).thenReturn(Optional.of(user));
        UserDetails actualUserDetails = userService.loadUserByUsername(user.username());

        //THEN
        assertEquals(expectedUserDetails.getUsername(), actualUserDetails.getUsername());
        assertEquals(expectedUserDetails.getPassword(), actualUserDetails.getPassword());
        assertEquals(expectedUserDetails.getAuthorities(), actualUserDetails.getAuthorities());

        verify(mockUserRepository).findByUsername(user.username());
    }

    @Test
    void registerNewUser_shouldGenerateFamilyId_whenFamilyIdIsEmpty() {
        // GIVEN
        String generatedId = "generatedId";
        String encodedPassword = "encodedPassword";
        UserDTO newUserDto = new UserDTO("username", "password", Role.CHILD, "");
        User expectedUser = new User(
                generatedId,
                newUserDto.username(),
                encodedPassword,
                newUserDto.role(),
                generatedId
        );

        when(mockUtilService.generateId()).thenReturn(generatedId);
        when(mockPasswordEncoder.encode(newUserDto.password())).thenReturn(encodedPassword); // Mock das Passwort-Encoding
        when(mockUserRepository.save(any(User.class))).thenReturn(expectedUser);

        // WHEN
        User actual = userService.registerNewUser(newUserDto);

        // THEN
        assertEquals(expectedUser.username(), actual.username());
        assertEquals(expectedUser.role(), actual.role());
        assertEquals(expectedUser.familyId(), actual.familyId());

        verify(mockUtilService, times((2))).generateId();
        verify(mockUserRepository).save(any(User.class));
    }

    @Test
    void registerNewUser_shouldUseProvidedFamilyId_whenFamilyIdIsNotEmpty() {
        // GIVEN
        String providedFamilyId = "existingFamilyId";
        String encodedPassword = "encodedPassword";
        UserDTO newUserDto = new UserDTO("username", "password", Role.CHILD, providedFamilyId);
        User expectedUser = new User(
                "generatedId",
                newUserDto.username(),
                encodedPassword,
                newUserDto.role(),
                providedFamilyId
        );

        // Mock behavior
        when(mockPasswordEncoder.encode(newUserDto.password())).thenReturn(encodedPassword); // Mock das Passwort-Encoding
        when(mockUserRepository.save(any(User.class))).thenReturn(expectedUser);

        // WHEN
        User actual = userService.registerNewUser(new UserDTO(newUserDto.username(), newUserDto.password(), newUserDto.role(), providedFamilyId));

        // THEN
        assertEquals(expectedUser.username(), actual.username());
        assertEquals(expectedUser.role(), actual.role());
        assertEquals(expectedUser.familyId(), actual.familyId());

        verify(mockUtilService).generateId(); // ensure generateId() was not called
        verify(mockUserRepository).save(any(User.class));
    }


    @Test
    void getAllUsersOfAFamily_shouldReturnAllUsersOfAFamily_whenCalledWithFamilyId() {
        String familyId = "family123";
        when(mockUserRepository.findUsersByFamilyId(familyId)).thenReturn(testUser);
        List<User> actual = userService.getAllUsersOfAFamily(familyId);
        verify(mockUserRepository).findUsersByFamilyId(familyId);
        assertEquals(testUser, actual);
    }

    @Test
    void deleteUser_shouldDeleteUser_whenCalledWithValidId() {
        //GIVEN
        when(mockUserRepository.save(any(User.class))).thenReturn(testUser.getFirst());
        mockUserRepository.save(testUser.getFirst());
        String id = testUser.getFirst().id();
        when(mockUserRepository.existsById(id)).thenReturn(true);

        //WHEN
        userService.deleteUser(id);

        //THEN
        verify(mockUserRepository).deleteById(id);
        when(mockUserRepository.existsById(id)).thenReturn(false);
        assertFalse(mockUserRepository.existsById(id));
    }

    @Test
    void updateUser_shouldUpdateUser_whenCalledWithValidId() {
        //WHEN
        when(mockUserRepository.findById("2")).thenReturn(Optional.of(testUser.get(1)));
        User actual = userService.updateUser("2", new UserDTO("Mama", "123", Role.ADULT, "family123"));
        when(mockUserRepository.save(any(User.class))).thenReturn(actual);
        //THEN
        verify(mockUserRepository).findById("2");
        verify(mockUserRepository).save(any(User.class));
        assertNotEquals(testUser.get(1), actual);
    }

    @Test
    void updateUser_shouldThrowNoSuchElementException_whenCalledWithInvalidId() {
        // GIVEN
        String invalidId = "7";

        // WHEN
        when(mockUserRepository.findById(invalidId)).thenReturn(Optional.empty());

        // THEN
        assertThrows(NoSuchElementException.class, () -> userService.updateUser(invalidId, new UserDTO("Mama", "123", Role.ADULT, "family123")));

        verify(mockUserRepository).findById(invalidId);
        verify(mockUserRepository, never()).save(any(User.class));
    }

}