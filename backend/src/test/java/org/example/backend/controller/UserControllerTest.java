package org.example.backend.controller;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

@SpringBootTest
@AutoConfigureMockMvc
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_EACH_TEST_METHOD)

public class UserControllerTest {
    @Autowired
    private MockMvc mockMvc;

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
}
