package org.example.backend.controller;

import org.example.backend.model.Family;
import org.example.backend.repository.FamilyRepository;
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

public class FamilyControllerTest {
    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private FamilyRepository familyRepository;


    @Test
    void createFamily_shouldReturnFamily_whenCalledWithFamilyDTO() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.post("/api/family/create")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                "name": "testFamily1"
                                }
                                """))
                .andExpect(MockMvcResultMatchers.status().isCreated())
                .andExpect(MockMvcResultMatchers.jsonPath("$.name").value("testFamily1"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.id").exists());
    }

    @Test
    void getAllFamilies_shouldReturnAllFamilies_whenCalled() throws Exception {
        familyRepository.saveAll(List.of(new Family("1", "kasldfkal")));
        mockMvc.perform(MockMvcRequestBuilders.get("/api/family"))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$[0].name").value("kasldfkal"));
    }

    @Test
    void deleteFamily_shouldDeleteUser_whenCalled() throws Exception {
        familyRepository.save(new Family("1", "kasldfkal"));
        mockMvc.perform(MockMvcRequestBuilders.delete("/api/family/{id}", 1))
                .andExpect(MockMvcResultMatchers.status().isNoContent());
    }

    @Test
    void updateFamily_shouldUpdateFamily_whenCalled() throws Exception {
        familyRepository.save(new Family("1", "kasldfkal"));
        mockMvc.perform(MockMvcRequestBuilders.put("/api/family/{id}", 1)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                "name": "betterFamilyName"
                                }
                                """))
                .andExpect(MockMvcResultMatchers.status().isCreated())
                .andExpect(MockMvcResultMatchers.jsonPath("$.name").value("betterFamilyName"));
    }
}
