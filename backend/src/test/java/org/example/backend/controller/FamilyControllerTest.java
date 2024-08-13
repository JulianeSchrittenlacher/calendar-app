package org.example.backend.controller;

import org.example.backend.model.Family;
import org.example.backend.repository.FamilyRepository;
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

public class FamilyControllerTest {
    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private FamilyRepository familyRepository;


    @Test
    @WithMockUser
    void createFamily_shouldReturnFamily_whenCalledWithFamilyDTO() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.post("/api/family/create")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                "name": "testFamily1"
                                }
                                """).with(csrf()))
                .andExpect(MockMvcResultMatchers.status().isCreated())
                .andExpect(MockMvcResultMatchers.jsonPath("$.name").value("testFamily1"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.id").exists());
    }

    @Test
    @WithMockUser
    void getAllFamilies_shouldReturnAllFamilies_whenCalled() throws Exception {
        familyRepository.saveAll(List.of(new Family("1", "kasldfkal")));
        mockMvc.perform(MockMvcRequestBuilders.get("/api/family").with(csrf()))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$[0].name").value("kasldfkal"));
    }

    @Test
    @WithMockUser
    void deleteFamily_shouldDeleteUser_whenCalled() throws Exception {
        familyRepository.save(new Family("1", "kasldfkal"));
        mockMvc.perform(MockMvcRequestBuilders.delete("/api/family/{id}", 1).with(csrf()))
                .andExpect(MockMvcResultMatchers.status().isNoContent());
    }

    @Test
    @WithMockUser
    void updateFamily_shouldUpdateFamily_whenCalled() throws Exception {
        familyRepository.save(new Family("1", "kasldfkal"));
        mockMvc.perform(MockMvcRequestBuilders.put("/api/family/{id}", 1)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                "name": "betterFamilyName"
                                }
                                """).with(csrf()))
                .andExpect(MockMvcResultMatchers.status().isCreated())
                .andExpect(MockMvcResultMatchers.jsonPath("$.name").value("betterFamilyName"));
    }
}
