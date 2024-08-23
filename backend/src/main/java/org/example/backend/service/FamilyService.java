package org.example.backend.service;

import lombok.RequiredArgsConstructor;
import org.example.backend.model.Family;
import org.example.backend.model.FamilyDTO;
import org.example.backend.repository.FamilyRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor

public class FamilyService {
    private final UtilService utilService;
    private final FamilyRepository familyRepository;

    public Family createFamily(FamilyDTO familyDTO) {
        return familyRepository.save(new Family(utilService.generateId(), familyDTO.familyName(), familyDTO.state()));
    }

    public List<Family> getAllFamilies() {
        return familyRepository.findAll();
    }

    public void deleteFamily(String familyId) {
        familyRepository.deleteById(familyId);
    }

    public Family updatedFamily(String familyId, FamilyDTO familyDTO) {
        Family familyToUpdate = familyRepository.findById(familyId).orElseThrow(() -> new NoSuchElementException("Family not found"));
        return familyRepository.save(familyToUpdate
                .withFamilyName(familyDTO.familyName())
                .withState(familyDTO.state()));
    }
}
