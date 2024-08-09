package org.example.backend.service;

import org.example.backend.model.Role;
import org.example.backend.model.User;
import org.example.backend.model.UserDTO;
import org.example.backend.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.test.annotation.DirtiesContext;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
import static org.mockito.Mockito.verify;

@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_EACH_TEST_METHOD)
class UserServiceTest {

    private static UserService userService;
    private static UserRepository mockUserRepository;
    private static UtilService mockUtilService;
    private static List<User> testUser;

    @BeforeEach
    void setUp() {
        mockUserRepository = mock(UserRepository.class);
        mockUtilService = mock(UtilService.class);
        userService = new UserService(mockUtilService, mockUserRepository);
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
    void registerNewUser_shouldReturnUser_whenCalledWithUserDTO() {
        // GIVEN
        User expectedUser = testUser.getFirst();

        // WHEN
        when(mockUserRepository.save(any(User.class))).thenReturn(expectedUser);
        when(mockUtilService.generateId()).thenReturn(expectedUser.id());
        User actual = userService.registerNewUser(new UserDTO(expectedUser.username(), expectedUser.password(), expectedUser.role(), expectedUser.familyId()));

        // THEN
        assertEquals(expectedUser.username(), actual.username());
        assertEquals(expectedUser.role(), actual.role());
        assertEquals(expectedUser.familyId(), actual.familyId());

        verify(mockUserRepository).save(any(User.class));
        verify(mockUtilService).generateId();
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
}