package org.example.backend.controller;

import lombok.RequiredArgsConstructor;
import org.example.backend.model.Family;
import org.example.backend.model.FamilyDTO;
import org.example.backend.service.FamilyService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/family")
@RequiredArgsConstructor

public class FamilyController {
    private final FamilyService familyService;

    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping("/create")
    public Family createFamily(@RequestBody Family family) {
        return familyService.createFamily(family);
    }

    @ResponseStatus(HttpStatus.OK)
    @GetMapping
    public List<Family> getAllFamilies() {
        return familyService.getAllFamilies();
    }

    @ResponseStatus(HttpStatus.OK)
    @GetMapping("/{familyId}")
    public Family getFamilyById(@PathVariable String familyId) {
        return familyService.getFamilyById(familyId);
    }

    @ResponseStatus(HttpStatus.NO_CONTENT)
    @DeleteMapping("/{id}")
    public void deleteFamily(@PathVariable String id) {
        familyService.deleteFamily(id);
    }

    @ResponseStatus(HttpStatus.CREATED)
    @PutMapping("/{id}")
    public Family updateFamily(@PathVariable String id, @RequestBody FamilyDTO familyDTO) {
        return familyService.updatedFamily(id, familyDTO);
    }
}
