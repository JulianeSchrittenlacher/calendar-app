package org.example.backend.controller;

import org.example.backend.model.Role;
import org.example.backend.model.User;
import org.example.backend.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import java.util.List;

@SpringBootTest
@AutoConfigureMockMvc
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_EACH_TEST_METHOD)

public class UserControllerTest {
    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private UserRepository userRepository;

    @Test
    void createUse_shouldReturnUser_whenCalledWithUserDTO() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.post("/api/user/create")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                 {
                                         "name": "John Doe",
                                         "role": "ADULT",
                                         "familyId": "family123"
                                     }
                                """))
                .andExpect(MockMvcResultMatchers.status().isCreated())
                .andExpect(MockMvcResultMatchers.content().json("""
                                {
                                         "name": "John Doe",
                                         "role": "ADULT",
                                         "familyId": "family123"
                                 }
                        """))
                .andExpect(MockMvcResultMatchers.jsonPath("$.id").exists());
    }

    @Test
    void getAllUser_shouldReturnUserList_whenCalled() throws Exception {
        userRepository.saveAll(List.of(
                new User("1", "John Doe", Role.ADULT, "1")));

        mockMvc.perform(MockMvcRequestBuilders.get("/api/user"))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().json("""
                        [{
                                "id": "1",
                                "name": "John Doe",
                                "role": "ADULT",
                                "familyId": "1"
                        }]
                        """));
    }

    @Test
    void deleteUser_shouldDeleteUser_whenCalled() throws Exception {
        userRepository.save(new User("1", "Name", Role.CHILD, "1"));
        mockMvc.perform(MockMvcRequestBuilders.delete("/api/user/1"))
                .andExpect(MockMvcResultMatchers.status().isNoContent());
    }

    @Test
    void updateUser_shouldUpdateUser_whenCalled() throws Exception {
        userRepository.saveAll(List.of(new User("1", "name", Role.CHILD, "1")));
        mockMvc.perform(MockMvcRequestBuilders.put("/api/user/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                        "name": "newName",
                                        "role": "CHILD",
                                        "familyId": "1"
                                }

                                """))
                .andExpect(MockMvcResultMatchers.status().isCreated())
                .andExpect(MockMvcResultMatchers.content().json("""
                        {
                                "id": "1",
                                "name": "newName",
                                "role": "CHILD",
                                "familyId": "1"
                        }
                        """));
    }
}
