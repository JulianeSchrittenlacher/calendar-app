package org.example.backend.controller;

import org.example.backend.model.Appointment;
import org.example.backend.repository.AppointmentRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@SpringBootTest
@AutoConfigureMockMvc
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_EACH_TEST_METHOD)
class AppointmentControllerTest {
    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private AppointmentRepository appointmentRepository;

    @Test
    void createAppointment_ShouldReturnAppointment_WhenCalledWithAppointmentDTO() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.post("/api/calendar/create")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "description": "Meeting with team",
                                  "startTime": "2024-07-16T09:00:00Z",
                                  "endTime": "2024-07-16T10:00:00Z",
                                  "userIds": ["participant1", "participant2"]
                                }
                                """))
                .andExpect(MockMvcResultMatchers.status().isCreated())
                .andExpect(MockMvcResultMatchers.content().json("""
                        {
                          "description": "Meeting with team",
                          "startTime": "2024-07-16T09:00:00Z",
                          "endTime": "2024-07-16T10:00:00Z",
                          "userIds": ["participant1", "participant2"]
                        }
                        """))
                .andExpect(MockMvcResultMatchers.jsonPath("$.id").exists());
    }

    @Test
    void getAllAppointments_ShouldReturnAppointmentList_whenCalledInitially() throws Exception {
        appointmentRepository.saveAll(List.of(
                (new Appointment("1", "test", Instant.parse("2024-07-16T09:00:00Z"), Instant.parse("2024-07-16T10:00:00Z"), new ArrayList<>() {{
                    add("participant1");
                    add("participant2");
                }}))
        ));
        mockMvc.perform(MockMvcRequestBuilders.get("/api/calendar"))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().json("""
                            [{
                          "id": "1",
                          "description": "test",
                          "startTime": "2024-07-16T09:00:00Z",
                          "endTime": "2024-07-16T10:00:00Z",
                          "userIds": ["participant1", "participant2"]
                        }]
                        """));
    }

    @Test
    void deleteAppointment_ShouldReturnHttpOK_WhenCalledWithId() throws Exception {
        appointmentRepository.save(new Appointment("1", "test", Instant.parse("2024-07-16T09:00:00Z"), Instant.parse("2024-07-16T10:00:00Z"), new ArrayList<>() {{
            add("participant1");
        }}));
        mockMvc.perform(MockMvcRequestBuilders.delete("/api/calendar/{id}", "1"))
                .andExpect(MockMvcResultMatchers.status().isOk());
    }

    @Test
    void updateAppointment_ShouldReturnHttpOK_WhenCalledWithId() throws Exception {
        appointmentRepository.save(new Appointment("1", "test", Instant.parse("2024-07-16T09:00:00Z"), Instant.parse("2024-07-16T10:00:00Z"), new ArrayList<>() {{
            add("participant1");
            add("participant2");
        }}));
        mockMvc.perform(MockMvcRequestBuilders.put("/api/calendar/{id}", "1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                 {
                                  "description": "test",
                                  "startTime": "2024-07-16T09:00:00Z",
                                  "endTime": "2024-07-16T10:00:00Z",
                                  "userIds": ["participant1", "participant2"]
                                }
                                """))
                .andExpect(MockMvcResultMatchers.status().isCreated())
                .andExpect(MockMvcResultMatchers.content().json("""
                         {
                          "description": "test",
                          "startTime": "2024-07-16T09:00:00Z",
                          "endTime": "2024-07-16T10:00:00Z",
                          "userIds": ["participant1", "participant2"]
                        }
                        """));
    }
}