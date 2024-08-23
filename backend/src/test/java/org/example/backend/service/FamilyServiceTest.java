package org.example.backend.service;

import org.example.backend.model.Family;
import org.example.backend.model.FamilyDTO;
import org.example.backend.repository.FamilyRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.annotation.DirtiesContext;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_EACH_TEST_METHOD)
class FamilyServiceTest {
    private static FamilyService familyService;
    private static UtilService mockUtilService;
    private static FamilyRepository mockFamilyRepository;
    private static List<Family> testFamilies;

    @BeforeEach
    void setUp() {
        mockUtilService = mock(UtilService.class);
        mockFamilyRepository = mock(FamilyRepository.class);
        familyService = new FamilyService(mockUtilService, mockFamilyRepository);
        testFamilies = new ArrayList<>() {{
            add(new Family("1", "family1", "sh"));
            add(new Family("2", "family2", "bw"));
            add(new Family("3", "family3", "hh"));
        }};
    }

    @Test
    void createFamily_shouldReturnFamily_whenCalledWithFamilyDTO() {
        //GIVEN
        Family expectedFamily = testFamilies.getFirst();

        //WHEN
        when(mockFamilyRepository.save(expectedFamily)).thenReturn(expectedFamily);
        when(mockUtilService.generateId()).thenReturn(expectedFamily.familyId());
        Family actual = familyService.createFamily(new FamilyDTO(expectedFamily.familyName(), expectedFamily.state()));

        //THEN
        assertEquals(expectedFamily, actual);
        verify(mockFamilyRepository).save(expectedFamily);
        verify(mockUtilService).generateId();
    }

    @Test
    void getAllFamilies_shouldReturnAllFamilies_whenCalled() {
        when(mockFamilyRepository.findAll()).thenReturn(testFamilies);
        List<Family> actual = familyService.getAllFamilies();
        verify(mockFamilyRepository).findAll();
        assertEquals(testFamilies, actual);
    }

    @Test
    void deleteFamily_shouldDeleteFamily_whenCalled() {
        //GIVEN
        when(mockFamilyRepository.save(any(Family.class))).thenReturn(testFamilies.getFirst());
        mockFamilyRepository.save(testFamilies.getFirst());
        String id = testFamilies.getFirst().familyId();
        when(mockFamilyRepository.existsById(id)).thenReturn(false);

        //WHEN
        familyService.deleteFamily(id);

        //THEN
        verify(mockFamilyRepository).deleteById(id);
        assertFalse(mockFamilyRepository.existsById(id));
    }

    @Test
    void updatedFamily_shouldReturnUpdatedFamily_whenCalledWithFamilyDTO() {
        //WHEN
        when(mockFamilyRepository.findById("3")).thenReturn(Optional.of(testFamilies.get(2)));
        Family actual = familyService.updatedFamily("3", new FamilyDTO("testFamily5", "hb"));
        when(mockFamilyRepository.save(any(Family.class))).thenReturn(actual);

        //THEN
        verify(mockFamilyRepository).findById("3");
        verify(mockFamilyRepository).save(any(Family.class));
        assertNotEquals(testFamilies.get(2), actual);
    }
}
