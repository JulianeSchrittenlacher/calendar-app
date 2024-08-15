package org.example.backend.controller;

import lombok.RequiredArgsConstructor;
import org.example.backend.model.Holidays;
import org.example.backend.service.HolidayService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/holidays")
@RequiredArgsConstructor
public class HolidayController {

    private final HolidayService holidayService;

    @GetMapping("/{year}/{state}")
    public ResponseEntity<List<Holidays>> getHolidaysByYearAndState(@PathVariable String year, @PathVariable String state) throws IOException {
        List<Holidays> holidays = holidayService.getHolidaysByYearAndState(year, state);

        if (holidays == null || holidays.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        return ResponseEntity.ok(holidays);
    }
}

