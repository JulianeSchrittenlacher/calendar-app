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

class EventControllerTest {
    @Autowired
    private MockMvc mockMvc;

    @Test
    void createEvent() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.post("/api/calender/create")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                        {
                          "description": "Meeting with team",
                          "startTime": "2024-07-16T09:00:00Z",
                          "endTime": "2024-07-16T10:00:00Z"
                        }
                    
                        """))
                .andExpect(MockMvcResultMatchers.status().isCreated())
                .andExpect(MockMvcResultMatchers.content().json("""
                        {
                          "description": "Meeting with team",
                          "startTime": "2024-07-16T09:00:00Z",
                          "endTime": "2024-07-16T10:00:00Z"
                        }
                        """))
                .andExpect(MockMvcResultMatchers.jsonPath("$.id").exists());
    }
}