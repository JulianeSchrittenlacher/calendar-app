package org.example.backend.controller;

import org.example.backend.model.Role;
import org.example.backend.model.User;
import org.example.backend.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import java.util.List;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;

@SpringBootTest
@AutoConfigureMockMvc
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_EACH_TEST_METHOD)

public class UserControllerTest {
    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private UserRepository userRepository;

    @Test
    void getMe_shouldReturnAnonymousUser_whenCalledWithoutLogin() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.get("/api/user"))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().string("anonymousUser"));
    }

    @Test
    @WithMockUser(username = "testUser")
    void getMe_shouldReturnUsername_whenCalledWithLogin() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.get("/api/user"))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().string("testUser"));
    }

    @Test
    @WithMockUser(username = "testUser")
    void loginUser_shouldReturnIsForbidden_whenCalledWithoutCSRF() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.post("/api/user/login"))
                .andExpect(MockMvcResultMatchers.status().isForbidden());
    }

    @Test
    void loginUser_shouldReturn_whenCalledWithout() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.post("/api/user/login"))
                .andExpect(MockMvcResultMatchers.status().isForbidden());
    }

    @Test
    @WithMockUser(username = "testUser")
    void loginUser_shouldReturnUser_whenUserIsLoggedIn() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.post("/api/user/login")
                        .with(csrf()))
                .andExpect(MockMvcResultMatchers.status().isNotFound());
    }


    @Test
    @WithMockUser
    void registerUser_shouldReturnUser_whenCalledWithUserDTO() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.post("/api/user/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                 {
                                         "username": "John Doe",
                                         "password": "johndoe",
                                         "role": "ADULT",
                                         "familyId": "family123"
                                     }
                                """).with(csrf()))
                .andExpect(MockMvcResultMatchers.status().isCreated())
                .andExpect(MockMvcResultMatchers.content().json("""
                                {
                                         "username": "John Doe",
                                         "role": "ADULT"
                                 }
                        """))
                .andExpect(MockMvcResultMatchers.jsonPath("$.familyId").exists())
                .andExpect(MockMvcResultMatchers.jsonPath("$.id").exists())
                .andExpect(MockMvcResultMatchers.jsonPath("$.password").exists());
    }

    @Test
    @WithMockUser
    void logoutUser_shouldReturnIsOk_whenCalled() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.get("/api/user/logout")
                        .with(csrf()))
                .andExpect(MockMvcResultMatchers.status().isOk());
    }

    @Test
    void logoutUser_shouldReturnUnautherized_whenCalledWithoutMockUser() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.get("/api/user/logout")
                        .with(csrf()))
                .andExpect(MockMvcResultMatchers.status().isUnauthorized());
    }

    @Test
    @WithMockUser
    void getAllUser_shouldReturnUserList_whenCalled() throws Exception {
        userRepository.saveAll(List.of(
                new User("1", "John Doe", "123", Role.ADULT, "1")));

        mockMvc.perform(MockMvcRequestBuilders.get("/api/user/{familyId}", 1).with(csrf()))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().json("""
                        [{
                                "id": "1",
                                "username": "John Doe",
                                "password": "123",
                                "role": "ADULT",
                                "familyId": "1"
                        }]
                        """))
                .andExpect(MockMvcResultMatchers.jsonPath("$[0].id").exists())
                .andExpect(MockMvcResultMatchers.jsonPath("$[0].password").exists());
    }

    @Test
    @WithMockUser
    void deleteUser_shouldDeleteUser_whenCalled() throws Exception {
        userRepository.save(new User("1", "Name", "123", Role.CHILD, "1"));
        mockMvc.perform(MockMvcRequestBuilders.delete("/api/user/1").with(csrf()))
                .andExpect(MockMvcResultMatchers.status().isNoContent());
    }

    @Test
    @WithMockUser
    void updateUser_shouldUpdateUser_whenCalled() throws Exception {
        userRepository.saveAll(List.of(new User("1", "name", "123", Role.CHILD, "1")));
        mockMvc.perform(MockMvcRequestBuilders.put("/api/user/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                        "username": "newName",
                                        "password": "123",
                                        "role": "CHILD",
                                        "familyId": "1"
                                }
                                
                                """).with(csrf()))
                .andExpect(MockMvcResultMatchers.status().isCreated())
                .andExpect(MockMvcResultMatchers.content().json("""
                        {
                                "id": "1",
                                "username": "newName",
                                "role": "CHILD",
                                "familyId": "1"
                        }
                        """));
    }
}
