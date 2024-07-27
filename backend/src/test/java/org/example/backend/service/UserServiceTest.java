package org.example.backend.service;

import org.example.backend.model.Role;
import org.example.backend.model.User;
import org.example.backend.model.UserDTO;
import org.example.backend.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.annotation.DirtiesContext;

import java.util.ArrayList;
import java.util.List;

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
            add(new User("1", "John Doe", Role.ADULT, "family123"));
            add(new User("2", "Jane Doe", Role.ADULT, "family456"));
            add(new User("3", "Jimmy Doe", Role.CHILD, "family123"));
        }};
    }

    @Test
    void createUser_shouldReturnUser_whenCalledWithUserDTO() {
        //GIVEN
        User expectedUser = testUser.getFirst();

        //WHEN
        when(mockUserRepository.save(expectedUser)).thenReturn(expectedUser);
        when(mockUtilService.generateId()).thenReturn(expectedUser.id());
        User actual = userService.createUser(new UserDTO(expectedUser.name(), expectedUser.role(), expectedUser.familyId()));

        //THEN
        assertEquals(expectedUser, actual);
        verify(mockUserRepository).save(expectedUser);
        verify(mockUtilService).generateId();
    }

    @Test
    void getAllUsers_shouldReturnAllUsers_whenCalledWith() {
        when(mockUserRepository.findAll()).thenReturn(testUser);
        List<User> actual = userService.getAllUsers();
        verify(mockUserRepository).findAll();
        assertEquals(testUser, actual);
    }

}